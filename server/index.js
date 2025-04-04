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

app.get("/check-login", (req, res) => {
  // 클라이언트에서 로그인한 유저 정보를 로컬 스토리지에 저장한다고 가정
  res.json({ message: "로그인 상태 확인은 클라이언트에서 관리합니다." });
});

// 리뷰 등록 API
app.post("/api/review", async (req, res) => {
  const { title, content, rating, nickname, movie_id, image, category } = req.body;

  try {
    // 닉네임으로 유저 ID 찾기 (DB에서)
    const [user] = await db.promise().query("SELECT user_id FROM users WHERE nickname = ?", [nickname]);

    if (user.length === 0) {
      return res.status(404).json({ message: "해당 닉네임의 유저를 찾을 수 없습니다." });
    }

    const user_id = user[0].user_id;

    // 리뷰 저장
    await db.promise().query(
      "INSERT INTO review (title, content, rating, user_id, movie_id, image, category) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [title, content, rating, user_id, movie_id, image || null, category]
    );

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
    const [rows] = await db.promise().query(
      `SELECT r.review_id, r.title, r.content, r.rating, r.created_date, r.image, r.views, u.nickname 
       FROM review r 
       JOIN users u ON r.user_id = u.user_id 
       WHERE r.review_id = ?`,
      [reviewId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: '리뷰를 찾을 수 없습니다.' });
    }

    res.json(rows[0]); // ✅ 조회수 증가 없음!
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




// 서버 실행
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
