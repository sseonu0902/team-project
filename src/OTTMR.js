import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import "./OTTMR.css";

function OTTMR() {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);

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

      <div className="main-layout">
        {/* 사이드바 */}
        <aside className="sidebar">
          <ul>
            <li className="disabled">영화 커뮤니티</li>
            <li>OTT 영화 커뮤니티</li>
            <li>자유게시판</li>
          </ul>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="main-content">
          <div className="board-header">
            <h3>영화 커뮤니티</h3>
            <select className="sort-dropdown">
              <option value="views">조회수 높은 순</option>
              <option value="rating">평점 높은 순</option>
              <option value="date">최신 순</option>
            </select>
          </div>

          <div className="post-list">
            <div className="post-item">
              <div>🎬</div>
              <div>8.5</div>
              <div>영화 A</div>
              <div>사용자1</div>
              <div>2024-03-10</div>
              <div>120</div>
            </div>
            <div className="post-item">
              <div>🎥</div>
              <div>9.2</div>
              <div>영화 B</div>
              <div>사용자2</div>
              <div>2024-03-09</div>
              <div>150</div>
            </div>
            <div className="post-item">
              <div>📽</div>
              <div>7.8</div>
              <div>영화 C</div>
              <div>사용자3</div>
              <div>2024-03-11</div>
              <div>90</div>
            </div>
          </div>

          <div className="pagination">
            <a href="#">1</a>
            <a href="#">2</a>
            <a href="#">3</a>
            <a href="#">4</a>
            <a href="#">NEXT</a>
          </div>
        </main>
      </div>

      <button className="write-button" onClick={() => window.location.href = '/CreatePost'}>글쓰기</button>
    </div>
  );
}

export default OTTMR;
