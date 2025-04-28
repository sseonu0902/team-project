import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import "./EditProfile.css";

const API_BASE_URL = 'http://localhost:4000';

function EditProfile() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loginStatus);

    if (loginStatus) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setNickname(userData.nickname || "");
          setEmail(userData.email || "");
        } catch (error) {
          console.error('Error parsing user data:', error);
          setError("사용자 정보를 불러오는데 실패했습니다.");
        }
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const response = await axios.put(`${API_BASE_URL}/api/user/update`, {
        email,
        nickname,
        currentPassword,
        newPassword
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      if (response.data.success) {
        const userData = JSON.parse(localStorage.getItem("user"));
        userData.nickname = nickname;
        localStorage.setItem("user", JSON.stringify(userData));
        navigate("/profile");
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("프로필 수정에 실패했습니다.");
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm("정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/api/user/delete`, {
          data: { email, currentPassword },
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (response.data.success) {
          localStorage.removeItem("user");
          localStorage.setItem("isLoggedIn", "false");
          navigate("/main");
        }
      } catch (error) {
        console.error('Error deleting account:', error);
        setError("계정 삭제에 실패했습니다.");
      }
    }
  };

  return (
    <div className="edit-profile-page">
      <header>
        <h1>MRS</h1>
        <div className="search-container">
          <input type="text" className="search-input" placeholder="검색어를 입력하세요." />
          <button className="search-button">검색</button>
        </div>
        {isLoggedIn && nickname && (
          <p className="user-nickname">{nickname}님</p>
        )}
      </header>

      <nav>
        <Link to="/LoginMain">홈</Link>
        <div className="dropdown">
          <Link to="/MR">리뷰게시판</Link>
          <div className="dropdown-content">
            <a href="MR">영화 리뷰 게시판</a>
            <a href="OTTMR">OTT 게시판</a>
            <a href="FreeBoard">자유 게시판</a>
          </div>
        </div>
        <div className="dropdown">
          <Link to="/genre">핫 이슈</Link>
          <div className="dropdown-content">
            <a href="#">TOP10 영화</a>
            <a href="#">영화 뉴스</a>
          </div>
        </div>
        <div className="dropdown">
          <Link to="/community">상영 예정작</Link>
          <div className="dropdown-content">
            <a href="#">영화관 상영 예정작</a>
            <a href="#">OTT 상영 예정작</a>
          </div>
        </div>
        <div className="dropdown">
          <Link to="/profile">OTT관</Link>
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
          <Link to="/contact">영화관</Link>
          <div className="dropdown-content">
            <a href="#">CGV</a>
            <a href="#">롯데시네마</a>
            <a href="#">메가박스</a>
          </div>
        </div>
        <a href="*">고객센터</a>
      </nav>

      <div className="edit-profile-container">
        <h2>프로필 수정</h2>
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="nickname">닉네임</label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              value={email}
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="currentPassword">현재 비밀번호</label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">새 비밀번호</label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="변경하지 않으려면 비워두세요"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">새 비밀번호 확인</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="변경하지 않으려면 비워두세요"
            />
          </div>

          <div className="button-group">
            <button type="submit" className="save-btn">저장</button>
            <button type="button" className="cancel-btn" onClick={() => navigate("/profile")}>취소</button>
          </div>
          
          <span className="delete-account-link" onClick={handleDelete}>
            계정 삭제
          </span>
        </form>
      </div>
    </div>
  );
}

export default EditProfile; 