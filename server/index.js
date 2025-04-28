const express = require("express");
const mysql = require('mysql2');
const bcrypt = require("bcrypt");
const cors = require("cors"); 
const bodyParser = require("body-parser");
require("dotenv").config();
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();

// CORS 설정
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:4000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 600
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 에러 처리 미들웨어
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false,
    message: '서버 오류가 발생했습니다.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// MySQL 연결 설정
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "mydatabase",
});

db.connect((err) => {
  if (err) {
    console.error("MySQL 연결 오류:", err);
    return;
  }
  console.log("MySQL 연결 성공!");
});

// 회원가입 API
app.post("/register", async (req, res) => {
  const { name, nickname, email, password, age, gender } = req.body;

  // 성별이 누락된 경우
  if (!gender) {
    return res.status(400).json({ success: false, message: "성별을 선택해주세요." });
  }

  db.query("SELECT * FROM users WHERE email = ? OR nickname = ?", [email, nickname], (err, results) => {
    if (err) {
      console.error("중복 체크 오류:", err);
      return res.status(500).json({ success: false, message: "서버 오류 발생" });
    }

    if (results.length > 0) {
      return res.status(400).json({ success: false, message: "이메일 또는 닉네임이 이미 존재합니다." });
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error("비밀번호 해싱 오류:", err);
        return res.status(500).json({ success: false, message: "서버 오류 발생" });
      }

      db.query(
        "INSERT INTO users (name, nickname, email, password, age, gender, join_date) VALUES (?, ?, ?, ?, ?, ?, CURDATE())",
        [name, nickname, email, hashedPassword, age, gender],
        (err) => {
          if (err) {
            console.error("회원가입 오류:", err);
            return res.status(500).json({ success: false, message: "회원가입 실패" });
          }
          res.status(201).json({ success: true, message: "회원가입 성공!" });
        }
      );
    });
  });
});


// 로그인 API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error("로그인 오류:", err);
      return res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
    
    if (results.length === 0) {
      return res.status(400).json({ success: false, message: "이메일 또는 비밀번호가 잘못되었습니다." });
    }

    const user = results[0];
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({ success: false, message: "이메일 또는 비밀번호가 잘못되었습니다." });
    }

    res.status(200).json({
      success: true,
      message: "로그인 성공!",
      user: {
        user_id: user.user_id,
        name: user.name,
        nickname: user.nickname,
        email: user.email,
        age: user.age,
        gender: user.gender,
        join_date: user.join_date
      },
    });
  });
});

// 레벨 계산 함수
const calculateLevel = (points) => {
  let level = 0;
  let levelPoints = 0;
  
  if (points <= 1000) {
    level = Math.floor(points / 100) + 1; // 🎬 초보 관람객
  } else if (points <= 2400) {
    level = Math.floor((points - 1000) / 100) + 11; // 🍿 시사회 출입자
  } else if (points <= 4000) {
    level = Math.floor((points - 2400) / 100) + 21; // 🎥 영화 평론가
  } else if (points <= 6800) {
    level = Math.floor((points - 4000) / 200) + 31; // 🧠 해석 장인
  }
  
  return level;
};

// 리뷰 작성 API (포인트 지급 및 레벨 업데이트)
app.post('/review', (req, res) => {
  const { userId, title, content, movieId } = req.body;
  
  const insertReviewQuery = 'INSERT INTO reviews (userId, title, content, movieId) VALUES (?, ?, ?, ?)';
  db.query(insertReviewQuery, [userId, title, content, movieId], (err, results) => {
    if (err) return res.status(500).send('Error saving review');
    
    // 리뷰 작성 후 포인트 지급
    const pointsForReview = 50;  // 리뷰 당 포인트
    const updatePointsQuery = 'UPDATE users SET points = points + ? WHERE id = ?';
    db.query(updatePointsQuery, [pointsForReview, userId], (err, results) => {
      if (err) return res.status(500).send('Error updating points');
      
      // 레벨 계산
      const selectUserQuery = 'SELECT points FROM users WHERE id = ?';
      db.query(selectUserQuery, [userId], (err, results) => {
        if (err) return res.status(500).send('Error fetching user points');
        
        const points = results[0].points;
        const newLevel = calculateLevel(points);
        
        const updateLevelQuery = 'UPDATE users SET level = ? WHERE id = ?';
        db.query(updateLevelQuery, [newLevel, userId], (err, results) => {
          if (err) return res.status(500).send('Error updating level');
          res.status(200).send('Review posted, points awarded, and level updated');
        });
      });
    });
  });
});

// 조회수 증가 API (포인트 지급 및 레벨 업데이트)
app.post('/increment-view', (req, res) => {
  const { reviewId, userId } = req.body;

  const incrementViewsQuery = 'UPDATE reviews SET views = views + 1 WHERE id = ?';
  db.query(incrementViewsQuery, [reviewId], (err, results) => {
    if (err) return res.status(500).send('Error incrementing views');
    
    // 조회수가 100의 배수가 되면 포인트 지급
    const checkViewQuery = 'SELECT views FROM reviews WHERE id = ?';
    db.query(checkViewQuery, [reviewId], (err, results) => {
      if (err) return res.status(500).send('Error checking views');
      
      const views = results[0].views;
      if (views % 100 === 0) {
        const pointsForViews = 50;  // 조회수 100당 50포인트
        db.query('UPDATE users SET points = points + ? WHERE id = ?', [pointsForViews, userId], (err, results) => {
          if (err) return res.status(500).send('Error updating points for views');
          
          // 레벨 계산
          const selectUserQuery = 'SELECT points FROM users WHERE id = ?';
          db.query(selectUserQuery, [userId], (err, results) => {
            if (err) return res.status(500).send('Error fetching user points');
            
            const points = results[0].points;
            const newLevel = calculateLevel(points);
            
            const updateLevelQuery = 'UPDATE users SET level = ? WHERE id = ?';
            db.query(updateLevelQuery, [newLevel, userId], (err, results) => {
              if (err) return res.status(500).send('Error updating level');
              res.status(200).send('View count updated, points awarded, and level updated');
            });
          });
        });
      } else {
        res.status(200).send('View count updated');
      }
    });
  });
});

// 출석 체크 API (포인트 지급 및 레벨 업데이트)
app.post('/attendance', (req, res) => {
  const { userId } = req.body;

  const currentDate = new Date().toISOString().split('T')[0]; // 오늘 날짜
  const checkAttendanceQuery = 'SELECT * FROM attendance WHERE userId = ? AND date = ?';
  db.query(checkAttendanceQuery, [userId, currentDate], (err, results) => {
    if (err) return res.status(500).send('Error checking attendance');
    
    if (results.length === 0) {
      const insertAttendanceQuery = 'INSERT INTO attendance (userId, date) VALUES (?, ?)';
      db.query(insertAttendanceQuery, [userId, currentDate], (err, results) => {
        if (err) return res.status(500).send('Error saving attendance');
        
        // 출석 체크 후 포인트 지급
        const pointsForAttendance = 20;  // 출석 1일 당 20포인트
        const updatePointsQuery = 'UPDATE users SET points = points + ? WHERE id = ?';
        db.query(updatePointsQuery, [pointsForAttendance, userId], (err, results) => {
          if (err) return res.status(500).send('Error updating points for attendance');
          
          // 레벨 계산
          const selectUserQuery = 'SELECT points FROM users WHERE id = ?';
          db.query(selectUserQuery, [userId], (err, results) => {
            if (err) return res.status(500).send('Error fetching user points');
            
            const points = results[0].points;
            const newLevel = calculateLevel(points);
            
            const updateLevelQuery = 'UPDATE users SET level = ? WHERE id = ?';
            db.query(updateLevelQuery, [newLevel, userId], (err, results) => {
              if (err) return res.status(500).send('Error updating level');
              res.status(200).send('Attendance marked, points awarded, and level updated');
            });
          });
        });
      });
    } else {
      res.status(400).send('You have already marked attendance for today');
    }
  });
});

// 댓글 작성 API (포인트 지급 및 레벨 업데이트)
app.post('/comment', (req, res) => {
  const { userId, reviewId, content } = req.body;
  
  const insertCommentQuery = 'INSERT INTO comments (userId, reviewId, content) VALUES (?, ?, ?)';
  db.query(insertCommentQuery, [userId, reviewId, content], (err, results) => {
    if (err) return res.status(500).send('Error posting comment');
    
    // 댓글 작성 후 포인트 지급
    const pointsForComment = 20;  // 댓글 당 포인트
    const updatePointsQuery = 'UPDATE users SET points = points + ? WHERE id = ?';
    db.query(updatePointsQuery, [pointsForComment, userId], (err, results) => {
      if (err) return res.status(500).send('Error updating points for comment');
      
      // 레벨 계산
      const selectUserQuery = 'SELECT points FROM users WHERE id = ?';
      db.query(selectUserQuery, [userId], (err, results) => {
        if (err) return res.status(500).send('Error fetching user points');
        
        const points = results[0].points;
        const newLevel = calculateLevel(points);
        
        const updateLevelQuery = 'UPDATE users SET level = ? WHERE id = ?';
        db.query(updateLevelQuery, [newLevel, userId], (err, results) => {
          if (err) return res.status(500).send('Error updating level');
          res.status(200).send('Comment posted, points awarded, and level updated');
        });
      });
    });
  });
});


app.get("/check-login", (req, res) => {
  // 클라이언트에서 로그인한 유저 정보를 로컬 스토리지에 저장한다고 가정
  res.json({ message: "로그인 상태 확인은 클라이언트에서 관리합니다." });
});

// 리뷰 등록 API
app.post("/api/review", async (req, res) => {
  const { title, content, ratings, nickname, movie_id, image, category } = req.body;

  try {
    if (!Array.isArray(ratings) || ratings.length === 0) {
      return res.status(400).json({ message: "별점 항목이 없습니다." });
    }

    // 닉네임으로 유저 ID 찾기
    const [user] = await db.promise().query("SELECT user_id FROM users WHERE nickname = ?", [nickname]);

    if (user.length === 0) {
      return res.status(404).json({ message: "해당 닉네임의 유저를 찾을 수 없습니다." });
    }

    const user_id = user[0].user_id;

    // 평균 평점 계산
    const totalScore = ratings.reduce((sum, item) => sum + item.score, 0);
    const averageRating = totalScore / ratings.length;

    // 리뷰 저장
    const [result] = await db.promise().query(
      "INSERT INTO review (title, content, rating, user_id, movie_id, image, category) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [title, content, averageRating, user_id, movie_id, image || null, category]
    );

    const reviewId = result.insertId;

    // 항목별 평점 저장 (aspect → rating_type_id)
    for (const { rating_type_id, score } of ratings) {
      await db.promise().query(
        "INSERT INTO review_rating (review_id, rating_type_id, score) VALUES (?, ?, ?)",
        [reviewId, rating_type_id, score]
      );
    }

    res.status(201).json({ message: "리뷰 저장 완료" });

  } catch (err) {
    console.error("리뷰 저장 오류:", err);
    res.status(500).json({ message: "서버 오류 발생" });
  }
});


//카테고리
app.get("/api/review", async (req, res) => {
  const { category } = req.query; // URL 파라미터에서 category 값 가져오기

  try {
    let query = `
      SELECT r.review_id, r.title, r.content, r.rating, r.created_date, r.image, r.views, u.nickname, r.category
      FROM review r
      JOIN users u ON r.user_id = u.user_id
    `;

    const params = [];

    // 카테고리가 전달된 경우 쿼리에 조건 추가
    if (category) {
      query += " WHERE r.category = ?";
      params.push(category);
    }

    query += " ORDER BY r.created_date DESC";

    const [reviews] = await db.promise().query(query, params);

    res.status(200).json(reviews);
  } catch (err) {
    console.error("리뷰 목록 가져오기 오류:", err);
    res.status(500).json({ message: "서버 오류 발생" });
  }
});

// 게시글 상세 조회
app.get("/api/review/:id", async (req, res) => {
  const reviewId = parseInt(req.params.id, 10);

  try {
    // 1. 리뷰 기본 정보 조회
    const [reviewRows] = await db.promise().query(
      `SELECT r.review_id, r.title, r.content, r.rating, r.created_date, r.image, r.views, u.nickname 
       FROM review r 
       JOIN users u ON r.user_id = u.user_id 
       WHERE r.review_id = ?`,
      [reviewId]
    );

    if (reviewRows.length === 0) {
      return res.status(404).json({ message: '리뷰를 찾을 수 없습니다.' });
    }

    const post = reviewRows[0];

    // 2. 평점 항목 조회 (aspect → rating_type.name으로)
    const [ratings] = await db.promise().query(
      `SELECT rt.name AS aspect, rr.score 
       FROM review_rating rr
       JOIN rating_type rt ON rr.rating_type_id = rt.rating_type_id
       WHERE rr.review_id = ?`,
      [reviewId]
    );

    // 3. 평점도 같이 반환
    res.json({ ...post, ratings });

  } catch (err) {
    console.error('상세 조회 오류:', err);
    res.status(500).json({ message: "서버 오류 발생" });
  }
});



// 조회수 증가 전용 API
app.post("/api/review/:id/views", async (req, res) => {
  const reviewId = parseInt(req.params.id, 10);
  console.log("🔥 조회수 증가 요청 들어옴: reviewId =", reviewId);

  try {
    await db.promise().query(
      'UPDATE review SET views = views + 1 WHERE review_id = ?', [reviewId]
    );
    res.status(200).json({ message: "조회수 증가 완료" });
  } catch (err) {
    console.error("조회수 증가 실패:", err);
    res.status(500).json({ message: "서버 오류 발생" });
  }
});

//댓글
app.post("/api/review/:id/comments", async (req, res) => {
  const reviewId = req.params.id;
  const { userId, content } = req.body;

  if (!userId || !content) {
    return res.status(400).json({ error: "userId, content는 필수입니다." });
  }

  try {
    const now = new Date(); // 현재 시간 포함
    await db.promise().execute(
      `INSERT INTO comment (user_id, review_id, content, created_date)
       VALUES (?, ?, ?, ?)`,
      [userId, reviewId, content, now]
    );

    res.status(201).json({ message: "댓글 작성 완료" });
  } catch (err) {
    console.error("댓글 작성 실패:", err);
    res.status(500).json({ error: "댓글 작성 실패" });
  }
});



//댓글 목록 불러오기
app.get("/api/review/:id/comments", async (req, res) => {
  const reviewId = req.params.id;

  try {
    const [rows] = await db.promise().execute(
      `SELECT c.comment_id, c.content, c.created_date, u.nickname
       FROM comment c
       LEFT JOIN users u ON c.user_id = u.user_id
       WHERE c.review_id = ?
       ORDER BY c.created_date DESC`,
      [reviewId]    
    );

    res.json(rows);
  } catch (err) {
    console.error("댓글 조회 실패:", err);
    res.status(500).json({ error: "댓글 조회 실패" });
  }
});

// 사용자 정보 가져오기 API
app.get("/api/user/:email", async (req, res) => {
  const { email } = req.params;
  
  try {
    const [user] = await db.promise().query(
      "SELECT nickname, email, point, mileage, age, gender FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    res.json(user[0]);
  } catch (error) {
    console.error("사용자 정보 조회 오류:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

// 비밀번호 확인 API
app.post("/api/verify-password", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [user] = await db.promise().query(
      "SELECT password FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "사용자를 찾을 수 없습니다." 
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user[0].password);
    
    res.json({
      success: true,
      isMatch: isPasswordMatch
    });
  } catch (error) {
    console.error("비밀번호 확인 오류:", error);
    res.status(500).json({ 
      success: false,
      message: "서버 오류가 발생했습니다." 
    });
  }
});

// 비밀번호 재설정 API
app.post("/api/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const [user] = await db.promise().query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return res.status(404).json({ 
        success: false,
        message: "사용자를 찾을 수 없습니다." 
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await db.promise().query(
      "UPDATE users SET password = ? WHERE email = ?",
      [hashedPassword, email]
    );

    res.json({
      success: true,
      message: "비밀번호가 성공적으로 변경되었습니다."
    });
  } catch (error) {
    console.error("비밀번호 재설정 오류:", error);
    res.status(500).json({ 
      success: false,
      message: "서버 오류가 발생했습니다." 
    });
  }
});

// 프로필 수정 API
app.put('/api/user', async (req, res) => {
  const token = req.headers.authorization;
  const { nickname, age, gender } = req.body;

  if (!token) {
    return res.status(401).json({ error: '인증이 필요합니다.' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    const email = decoded.email;

    const updateQuery = `
      UPDATE users 
      SET nickname = ?, age = ?, gender = ?
      WHERE email = ?
    `;

    await db.promise().execute(updateQuery, [nickname, age, gender, email]);
    res.json({ message: '프로필이 성공적으로 업데이트되었습니다.' });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

app.use(express.static(path.join(__dirname, '../build')));

// 라우트 핸들링 - 모든 요청에 대해 index.html 제공
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});


// 서버 실행
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
