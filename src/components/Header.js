import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Header.css';

function Header({ isLoggedIn, nickname }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/loginmain');
  };

  const handleNicknameClick = () => {
    navigate('/profile');
  };

  return (
    <header className="main-header">
      <h1 onClick={() => navigate('/')}>MRS</h1>
      
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="검색어를 입력하세요."
        />
        <button className="search-button">검색</button>
      </div>

      <div className="user-controls">
        {isLoggedIn ? (
          <div className="auth-buttons">
            <span 
              className="user-nickname" 
              onClick={handleNicknameClick}
              style={{ cursor: 'pointer' }}
            >
              {nickname}님
            </span>
            <button className="logout-btn" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="login-btn">
              로그인
            </Link>
            <Link to="/register" className="register-btn">
              회원가입
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header; 