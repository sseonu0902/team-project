// Login.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import "./Login.css";
import Header from './components/Header';
import Navigation from './components/Navigation';

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
      });

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/loginmain");
      } else {
        setError(response.data.message || "로그인에 실패했습니다.");
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        setError(error.response.data.message || "이메일 또는 비밀번호가 올바르지 않습니다.");
      } else {
        setError("서버와 연결할 수 없습니다.");
      }
    }
  };

  return (
    <div>
      <Header />
      <Navigation />
      <div className="container">
        <form id="login-form" onSubmit={handleSubmit}>
          <h2>로그인</h2>
          {error && <div className="error">{error}</div>}
          <div>
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일을 입력하세요"
              required
            />
          </div>
          <div>
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
          <button type="submit">로그인</button>
          <div className="register-container">
            계정이 없으신가요? <Link to="/register">회원가입</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
