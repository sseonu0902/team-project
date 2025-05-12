const express = require("express");
const mysql = require('mysql2');
const bcrypt = require("bcrypt");
const cors = require("cors"); 
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const corsOptions = {
  origin: "http://localhost:3000", 
  methods: "GET,POST",
};
app.use(cors(corsOptions));

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
// 프로필 수정 라우트
app.put('/editprofile/:email', (req, res) => {
  const { email } = req.params;
  const { nickname, age, gender } = req.body;

  const sql = `UPDATE users SET nickname = ?, age = ?, gender = ? WHERE email = ?`;
  db.query(sql, [nickname, age, gender, email], (err, result) => {
    if (err) {
      console.error("프로필 수정 실패:", err);
      return res.status(500).json({ message: "프로필 수정 실패" });
    }
    return res.status(200).json({ message: "프로필 수정 완료" });
  });
});

// 유저 포인트 + 등급 정보 가져오기
app.get("/api/user-info", async (req, res) => {
  const { nickname } = req.query;

  try {
    const [userRows] = await db.promise().query(
      `SELECT u.points, u.grade_code, g.grade_name
       FROM users u
       JOIN grade g ON u.grade_code = g.grade_code
       WHERE u.nickname = ?`,
      [nickname]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "해당 닉네임의 유저를 찾을 수 없습니다." });
    }

    const { points, grade_code, grade_name } = userRows[0];
    res.status(200).json({ points, grade_code, grade_name });

  } catch (err) {
    console.error("유저 정보 가져오기 오류:", err);
    res.status(500).json({ message: "서버 오류 발생" });
  }
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
    const [userRows] = await db.promise().query("SELECT user_id, points, grade_code FROM users WHERE nickname = ?", [nickname]);

    if (userRows.length === 0) {
      return res.status(404).json({ message: "해당 닉네임의 유저를 찾을 수 없습니다." });
    }

    const user_id = userRows[0].user_id;
    let points = userRows[0].points ?? 0;
    let current_grade_code = userRows[0].grade_code ?? 1;

    // ⭐ 포인트 무조건 +10
    const updatedPoints = points + 10;

    // ⭐ 새로운 레벨 계산
    let new_grade_code;
    if (updatedPoints >= 300) {
      new_grade_code = 4;
    } else if (updatedPoints >= 200) {
      new_grade_code = 3;
    } else if (updatedPoints >= 100) {
      new_grade_code = 2;
    } else {
      new_grade_code = 1;
    }

    // ⭐ 무조건 포인트랑 레벨 업데이트
    await db.promise().query(
      "UPDATE users SET points = ?, grade_code = ? WHERE user_id = ?",
      [updatedPoints, new_grade_code, user_id]
    );

    // 리뷰 저장
    const [result] = await db.promise().query(
      "INSERT INTO review (title, content, rating, user_id, movie_id, image, category) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [title, content, ratings.reduce((sum, item) => sum + item.score, 0) / ratings.length, user_id, movie_id, image || null, category]
    );

    const reviewId = result.insertId;

    // 항목별 평점 저장
    for (const { rating_type_id, score } of ratings) {
      await db.promise().query(
        "INSERT INTO review_rating (review_id, rating_type_id, score) VALUES (?, ?, ?)",
        [reviewId, rating_type_id, score]
      );
    }

    // 리뷰 등록 후 포인트 지급 로직 추가
    const pointsToAdd = 50; // 예시로 리뷰 작성시 50포인트 지급
    await db.promise().query(
      "UPDATE users SET points = points + ? WHERE user_id = ?",
      [pointsToAdd, user_id]
    );

    res.status(201).json({ message: "리뷰 저장 완료" });

  } catch (err) {
    console.error("리뷰 저장 오류:", err);
    res.status(500).json({ message: "서버 오류 발생" });
  }
});

//카테고리 및 게시물 정렬
app.get("/api/review", async (req, res) => {
  const { category, sort } = req.query;

  try {
    let query = `
      SELECT r.review_id, r.title, r.content, r.rating, r.created_date, r.image, r.views, u.nickname, r.category
      FROM review r
      JOIN users u ON r.user_id = u.user_id
    `;
    const params = [];

    if (category) {
      query += " WHERE r.category = ?";
      params.push(category);
    }

    // 정렬 기준 처리
    switch (sort) {
      case "views":
        query += " ORDER BY r.views DESC, r.created_date DESC";
        break;
      case "rating":
        query += " ORDER BY r.rating DESC, r.created_date DESC";
        break;
      case "date":
      default:
        query += " ORDER BY r.created_date DESC";
    }    
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

// 댓글
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

    // 댓글 작성 후 포인트 지급 로직 추가
    const pointsToAdd = 20; // 예시로 댓글 작성시 20포인트 지급
    await db.promise().query(
      "UPDATE users SET points = points + ? WHERE user_id = ?",
      [pointsToAdd, userId]
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

// 좋아요 토글 (추가 또는 삭제)
app.post("/api/review/:id/like", async (req, res) => {
  const reviewId = req.params.id;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId가 필요합니다." });
  }

  try {
    // 이미 좋아요 했는지 확인
    const [rows] = await db.promise().query(
      "SELECT * FROM likes WHERE review_id = ? AND user_id = ?",
      [reviewId, userId]
    );

    if (rows.length > 0) {
      // 이미 좋아요 했다면 → 삭제
      await db.promise().query(
        "DELETE FROM likes WHERE review_id = ? AND user_id = ?",
        [reviewId, userId]
      );
      res.status(200).json({ liked: false });
    } else {
      // 아직 안 했으면 → 추가
      await db.promise().query(
        "INSERT INTO likes (review_id, user_id, like_date) VALUES (?, ?, CURDATE())",
        [reviewId, userId]
      );
      res.status(200).json({ liked: true });
    }
  } catch (err) {
    console.error("좋아요 토글 실패:", err);
    res.status(500).json({ message: "좋아요 처리 중 오류 발생" });
  }
});

// 좋아요 수 조회
app.get("/api/review/:id/likes", async (req, res) => {
  const reviewId = req.params.id;
  try {
    const [rows] = await db.promise().query(
      "SELECT COUNT(*) AS likeCount FROM likes WHERE review_id = ?",
      [reviewId]
    );
    res.status(200).json({ likeCount: rows[0].likeCount });
  } catch (err) {
    console.error("좋아요 수 조회 실패:", err);
    res.status(500).json({ message: "좋아요 수 조회 실패" });
  }
});

// 좋아요 여부 확인 API
app.get("/api/review/:id/liked", async (req, res) => {
  const reviewId = req.params.id;
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ message: "userId가 필요합니다." });
  }

  try {
    const [rows] = await db.promise().query(
      "SELECT * FROM likes WHERE review_id = ? AND user_id = ?",
      [reviewId, userId]
    );

    res.status(200).json({ liked: rows.length > 0 });
  } catch (err) {
    console.error("좋아요 여부 조회 실패:", err);
    res.status(500).json({ message: "좋아요 여부 조회 실패" });
  }
});

// 서버 실행
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
