// Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";  // axios 추가
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");  // 사용자 이메일
  const [password, setPassword] = useState("");  // 사용자 비밀번호
  const [error, setError] = useState("");  // 로그인 오류 상태
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 서버로 로그인 요청 보내기
      const response = await axios.post("http://localhost:4000/login", {
        email,
        password,
      });

      if (response.data.success) {
        console.log("로그인 성공! 받은 사용자 정보:", response.data.user);
        // 로그인 성공 시 모든 사용자 정보 저장
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("user", JSON.stringify(response.data.user)); // 로컬 스토리지에 사용자 정보 저장
        navigate("/loginmain");  // 로그인 후 이동할 페이지
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      setError("서버 오류가 발생했습니다.");
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
            <a href="#">시리즈물 게시판</a>
            <a href="#">자유 게시판</a>
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

      <form id="login-form" onSubmit={handleLogin}>
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
