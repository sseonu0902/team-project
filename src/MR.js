import React, { useContext } from "react";
import { UserContext } from "./UserContext";
import { PostsContext } from "./PostsContext";
import { Link, useNavigate } from "react-router-dom";
import "./MR.css";

function MR() {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);
  const { posts, deletePost } = useContext(PostsContext);

  const handleDeleteLatestPost = () => {
    if (posts.length > 0) {
      deletePost(posts[0].id); // 최근 게시물을 삭제
    } else {
      alert("삭제할 게시물이 없습니다.");
    }
  };

  return (
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
        <Link to={user ? "/LoginMain" : "/Main"}>홈</Link>
        <div className="dropdown">
          <Link to="/MR">리뷰게시판</Link>
          <div className="dropdown-content">
            <Link to="/MR">영화 리뷰 게시판</Link>
            <Link to="/OTTMR">OTT 게시판</Link>
            <Link to="#">시리즈물 게시판</Link>
            <Link to="#">자유 게시판</Link>
          </div>
        </div>
        <div className="dropdown">
          <Link to="/genre">핫 이슈</Link>
          <div className="dropdown-content">
            <Link to="#">TOP10 영화</Link>
            <Link to="#">영화 뉴스</Link>
          </div>
        </div>
        <div className="dropdown">
          <Link to="/community">상영 예정작</Link>
          <div className="dropdown-content">
            <Link to="#">영화관 상영 예정작</Link>
            <Link to="#">OTT 상영 예정작</Link>
          </div>
        </div>
        <div className="dropdown">
          <Link to="/profile">OTT관</Link>
          <div className="dropdown-content">
            <Link to="#">넷플릭스</Link>
            <Link to="#">티빙</Link>
            <Link to="#">왓챠</Link>
            <Link to="#">쿠팡플레이</Link>
            <Link to="#">웨이브</Link>
            <Link to="#">라프텔</Link>
          </div>
        </div>
        <div className="dropdown">
          <Link to="/contact">영화관</Link>
          <div className="dropdown-content">
            <Link to="#">CGV</Link>
            <Link to="#">롯데시네마</Link>
            <Link to="#">메가박스</Link>
          </div>
        </div>
        <Link to="*">고객센터</Link>
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

            <button
              className="write-button"
              onClick={() => navigate('/CreatePost')}
            >
              글쓰기
            </button>

            <select className="sort-dropdown">
              <option value="views">조회수 높은 순</option>
              <option value="rating">평점 높은 순</option>
              <option value="date">최신 순</option>
            </select>
          </div>

          <div className="post-list-header">
            <span>포스터</span>
            <span>평점</span>
            <span>제목</span>
            <span>글쓴이</span>
            <span>날짜</span>
            <span>조회</span>
          </div>

          <div className="post-list">
            <div className="post-list-item">
              <span>🎬</span>
              <span>8.5</span>
              <span>영화 A</span>
              <span>사용자1</span>
              <span>2024-03-10</span>
              <span>120</span>
            </div>
            <div className="post-list-item">
              <span>🎥</span>
              <span>9.2</span>
              <span>영화 B</span>
              <span>사용자2</span>
              <span>2024-03-09</span>
              <span>150</span>
            </div>
            <div className="post-list-item">
              <span>🎭</span>
              <span>7.8</span>
              <span>영화 C</span>
              <span>사용자3</span>
              <span>2024-03-11</span>
              <span>90</span>
            </div>

            <div className="post-list">
              {posts.map((post) => (
                <div key={post.id} className="post-list-item">
                  <span>{post.image ? <img src={post.image} alt="포스터" style={{ width: "50px" }} /> : "🎬"}</span>
                  <span>{post.rating}</span>
                  <span>{post.title}</span>
                  <span>{post.author}</span>
                  <span>{post.date}</span>
                  <span>{post.views}</span>
            </div>
          ))}
        </div>
      </div>
      <button 
        style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 999 }}
        onClick={handleDeleteLatestPost}
      >
        최근 게시물 삭제 (테스트용)
      </button>

          <div className="pagination">
            <Link to="#">1</Link>
            <Link to="#">2</Link>
            <Link to="#">3</Link>
            <Link to="#">4</Link>
            <Link to="#">NEXT</Link>
          </div>
        </main>
      </div>
    </div>
  );
}

export default MR;
