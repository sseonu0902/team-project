const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const cors = require("cors"); // CORS 해결을 위해 추가
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express(); // CORS 문제 방지
app.use(bodyParser.json()); // JSON 요청 처리

const corsOptions = {
  origin: "http://localhost:3000", // 클라이언트 주소
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
  const { name, nickname, email, password, age } = req.body;

  // 이메일 또는 닉네임 중복 체크
  db.query("SELECT * FROM users WHERE email = ? OR nickname = ?", [email, nickname], (err, results) => {
    if (err) {
      console.error("중복 체크 오류:", err);
      return res.status(500).json({ success: false, message: "서버 오류 발생" });
    }

    if (results.length > 0) {
      return res.status(400).json({ success: false, message: "이메일 또는 닉네임이 이미 존재합니다." });
    }

    // 비밀번호 해싱
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.error("비밀번호 해싱 오류:", err);
        return res.status(500).json({ success: false, message: "서버 오류 발생" });
      }

      // 사용자 추가
      db.query(
        "INSERT INTO users (name, nickname, email, password, age) VALUES (?, ?, ?, ?, ?)",
        [name, nickname, email, hashedPassword, age],
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

  // 이메일로 사용자 찾기
  db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
    if (err) {
      console.error("로그인 오류:", err);
      return res.status(500).json({ success: false, message: "서버 오류 발생" });
    }
    
    if (results.length === 0) {
      // 이메일이 존재하지 않으면
      return res.status(400).json({ success: false, message: "이메일 또는 비밀번호가 잘못되었습니다." });
    }

    // 비밀번호 비교
    const user = results[0];
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      // 비밀번호가 일치하지 않으면
      return res.status(400).json({ success: false, message: "이메일 또는 비밀번호가 잘못되었습니다." });
    }

    // 로그인 성공
    res.status(200).json({
      success: true,
      message: "로그인 성공!",
      user: {
        name: user.name,
        nickname: user.nickname,
        email: user.email,
        age: user.age,
      },
    });
  });
});

// 서버 실행
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
