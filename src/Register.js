import React, { useState,useContext } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);
  const [userData, setUserData] = useState({
    name: "",
    nickname: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
    gender: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (userData.password !== userData.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    console.log("전송할 데이터:", userData);

    try {
      const { confirmPassword, ...requestData } = userData;
      const response = await axios.post(
        "http://localhost:4000/register",
        requestData
      );

      console.log("서버 응답:", response.data);

      if (response.data.success) {
        setSuccess("회원가입이 완료되었습니다!");
        setError("");
        setUserData({
          name: "",
          nickname: "",
          email: "",
          password: "",
          confirmPassword: "",
          age: "",
          gender: "",
        });
      } else {
        setError("회원가입에 실패했습니다. 다시 시도해 주세요.");
      }
    } catch (err) {
      setError("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      <header>
        <h1>영화 커뮤니티</h1>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="검색어를 입력하세요."
          />
          <button className="search-button">검색</button>
        </div>
        {!user && (
          <>
            <button className="login-btn" onClick={() => navigate("/login")}>
              로그인
            </button>
            <button className="register-btn" onClick={() => navigate("/register")}>
              회원가입
            </button>
          </>
        )}
        {user && <p className="user-nickname">{user.nickname}님</p>}
        {user && <button className="logout-btn" onClick={logout}>로그아웃</button>}
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

      <div className="container">
        <h2>회원가입 페이지 입니다</h2>
        <form id="register-form" onSubmit={handleSubmit}>
          <label htmlFor="name">이름</label>
          <input
            type="text"
            id="name"
            name="name"
            value={userData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />

          <label htmlFor="nickname">닉네임</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={userData.nickname}
            onChange={handleChange}
            placeholder="Enter your nickname"
            required
          />

          <label htmlFor="email">이메일</label>
          <input
            type="email"
            id="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />

          <label htmlFor="password">비밀번호</label>
          <input
            type="password"
            id="password"
            name="password"
            value={userData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />

          <label htmlFor="confirmPassword">비밀번호 확인</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            required
          />

          <label htmlFor="age">나이</label>
          <input
            type="number"
            id="age"
            name="age"
            value={userData.age}
            onChange={handleChange}
            placeholder="Enter your age"
            min="1"
            required
          />

          <label htmlFor="gender">성별</label>
          <select
            id="gender"
            name="gender"
            value={userData.gender}
            onChange={handleChange}
          >
            <option value="">선택하세요</option>
            <option value="male">남성</option>
            <option value="female">여성</option>
          </select>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit">회원가입</button>
        </form>
      </div>
    </div>
  );
}

export default Register;
