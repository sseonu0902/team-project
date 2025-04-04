import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MR.css";

function MR() {
  const navigate = useNavigate();
  const { user, logout } = useContext(UserContext);
  const [posts, setPosts] = useState([]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };
  

  // 임시 게시글 데이터 (추후 API로 교체 가능)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/review", {
          params: { category: "현재 상영 영화 게시판" } // 영화 리뷰 게시판 카테고리 추가
        });
        setPosts(response.data);
      } catch (error) {
        console.error("게시물 가져오기 실패:", error);
      }
    };
  
    fetchPosts();
  }, []);
  

  const handleDeleteLatestPost = () => {
    if (posts.length > 0) {
      const updatedPosts = [...posts];
      updatedPosts.pop(); // 마지막 게시글 삭제
      setPosts(updatedPosts);
    }
  };

  return (
    <div>
      {/* 헤더 */}
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
      <a 
        href="#" 
        onClick={(e) => {
          e.preventDefault();
          navigate(user ? "/LoginMain" : "/Main");
        }}
      >
        홈
      </a>
        <div className="dropdown">
          <a href="MR">리뷰게시판</a>
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

      {/* 메인 레이아웃 */}
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

          {/* 게시글 목록 헤더 */}
          <div className="post-list-header">
            <span>포스터</span>
            <span>평점</span>
            <span>제목</span>
            <span>글쓴이</span>
            <span>날짜</span>
            <span>조회</span>
          </div>

          {/* 게시글 목록 */}
          <div className="post-list">
            {posts.length === 0 ? (
              <p className="empty-posts">게시글이 없습니다.</p>
            ) : (
              posts.map((post) => (
                <div key={post.review_id} className="post-list-item">
                  <span>
                    {post.image ? (
                      <img
                        src={post.image}
                        alt="포스터"
                        style={{ width: "50px" }}
                      />
                    ) : (
                      "🎬"
                    )}
                  </span>
                  <span>{post.rating}</span>
                  <span>
                    <Link to={`/posts/${post.review_id}`}>{post.title}</Link>
                  </span>
                  <span>{post.nickname}</span>
                  <span>{formatDate(post.created_date)}</span>
                  <span>{post.views}</span>
                </div>
              ))
            )}
          </div>

          {/* 최근 게시물 삭제 버튼 */}
          <button
            style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 999 }}
            onClick={handleDeleteLatestPost}
          >
            최근 게시물 삭제 (테스트용)
          </button>

          {/* 페이지네이션 */}
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
