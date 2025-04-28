// Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import axios from 'axios';

// API 기본 URL 설정
const API_BASE_URL = 'http://localhost:4000';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data.success) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(response.data.user));
        console.log("로그인 성공:", response.data.user);
        navigate("/LoginMain");
      } else {
        setError(response.data.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        setError(error.response.data.message || "서버 오류가 발생했습니다.");
      } else {
        setError("서버와 연결할 수 없습니다.");
      }
    }
  };

  return (
    <div>
      <div>
      <header>
        <h1>MRS</h1>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="검색어를 입력하세요."
          />
          <button className="search-button">검색</button>
        </div>
      </header>

      <nav>
        <a href="/main">홈</a>
        <div className="dropdown">
          <a href="*">리뷰게시판</a>
          <div className="dropdown-content">
            <a href="MR">영화 리뷰 게시판</a>
            <a href="OTTMR">OTT 게시판</a>
            <a href="FreeBoard">자유 게시판</a>
          </div>
        </div>
        <div className="dropdown">
          <a href="/genre">핫 이슈</a>
          <div className="dropdown-content">
            <a href="#">TOP10 영화</a>
            <a href="#">영화 뉴스</a>
          </div>
        </div>
        <div className="dropdown">
          <a href="/community">상영 예정작</a>
          <div className="dropdown-content">
            <a href="#">영화관 상영 예정작</a>
            <a href="#">OTT 상영 예정작</a>
          </div>
        </div>
        <div className="dropdown">
          <a href="/profile">OTT관</a>
          <div className="dropdown-content">
            <a href="#">넷플릭스</a>
            <a href="#">티빙</a>
            <a href="#">왓챠</a>
            <a href="#">쿠팡플레이</a>
            <a href="#">웨이브</a>
            <a href="#">라프텔</a>
          </div>
        </div>
        <div className="dropdown">
          <a href="/contact">영화관</a>
          <div className="dropdown-content">
            <a href="#">CGV</a>
            <a href="#">롯데시네마</a>
            <a href="#">메가박스</a>
          </div>
        </div>
        <a href="*">고객센터</a>
      </nav>
    </div>  

      <h2>사용자 로그인</h2>

      {/* 로그인 오류 메시지 표시 */}
      {error && <p className="error">{error}</p>}

      <form id="login-form" onSubmit={handleSubmit}>
        <label htmlFor="email">이메일</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Enter your email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Enter your password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">로그인</button>
      </form>

      <div className="register-container">
        <Link to="/register">
          <button>회원가입</button>
        </Link>
      </div>
    </div>
  );
}

export default Login;
