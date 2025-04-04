import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MR.css"; // MR 페이지와 동일한 스타일 재사용

function PostDetail() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/review/${id}`);
        setPost(res.data);
  
        // 조회수 증가는 데이터 받아온 다음에 한 번만!
        await axios.post(`http://localhost:4000/api/review/${id}/views`);
      } catch (err) {
        console.error("상세 조회 실패:", err);
      }
    };
  
    fetchPost();
  }, [id]);
  
  
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div>
      {/* 헤더 */}
      <header>
        <h1>MRS</h1>
        <div className="search-container">
          <input className="search-input" placeholder="검색어를 입력하세요." />
          <button className="search-button">검색</button>
        </div>
        {!user ? (
          <>
            <button className="login-btn" onClick={() => navigate("/login")}>로그인</button>
            <button className="register-btn" onClick={() => navigate("/register")}>회원가입</button>
          </>
        ) : (
          <>
            <p className="user-nickname">{user.nickname}님</p>
            <button className="logout-btn" onClick={logout}>로그아웃</button>
          </>
        )}
      </header>

      {/* 네비게이션 */}
      <nav>
        <a href="/main">홈</a>
        <div className="dropdown">
          <a href="/mr">리뷰게시판</a>
          <div className="dropdown-content">
            <a href="/mr">영화 리뷰 게시판</a>
            <a href="/ottmr">OTT 게시판</a>
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
        <a href="/contact">고객센터</a>
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

        {/* 메인 콘텐츠 (상세 내용 출력) */}
        <main className="main-content">
          <div className="board-header">
            <h3>게시물 상세보기</h3>
            <button className="write-button" onClick={() => navigate('/CreatePost')}>글쓰기</button>
          </div>

          {!post ? (
            <p>로딩 중...</p>
          ) : (
            <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "10px", background: "#f9f9f9" }}>
              <h2>{post.title}</h2>
              <p><strong>작성자:</strong> {post.nickname}</p>
              <p><strong>작성일:</strong> {formatDate(post.created_date)}</p>
              <p><strong>조회수:</strong> {post.views}</p>
              <p><strong>평점:</strong> {post.rating}</p>

              {post.image && (
                <img src={post.image} alt="포스터" style={{ width: "200px", margin: "20px 0" }} />
              )}

              <p style={{ whiteSpace: "pre-line" }}>{post.content}</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default PostDetail;
