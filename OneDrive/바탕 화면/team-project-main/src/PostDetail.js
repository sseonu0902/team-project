import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./MR.css";

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

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  return (
    <div>
      {/* 헤더 */}
      <div className="header">
        <h1>MRS</h1>
        <div className="search-auth-wrapper">
          <div className="search-bar">
            <input type="text" placeholder="검색어를 입력하세요." />
            <button className="search-button">검색</button>
          </div>
          {!user ? (
            <div className="auth-buttons">
              <button className="login-btn" onClick={() => navigate("/login")}>
                로그인
              </button>
              <button
                className="register-btn"
                onClick={() => navigate("/register")}
              >
                회원가입
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <span className="user-nickname">{user.nickname}님</span>
              <button className="logout-btn" onClick={logout}>
                로그아웃
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 네비게이션 */}
      <nav className="navbar">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            navigate(isLoggedIn ? "/LoginMain" : "/Main");
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

      {/* 본문 */}
      <div className="main-layout">
        <aside className="sidebar">
          <ul>
            <li className="disabled">영화 커뮤니티</li>
            <li>OTT 영화 커뮤니티</li>
            <li>자유게시판</li>
          </ul>
        </aside>

        <main className="main-content">
          <div className="board-header">
            <h3>게시물 상세보기</h3>
            <button
              className="write-button"
              onClick={() => navigate("/CreatePost")}
            >
              글쓰기
            </button>
          </div>

          {!post ? (
            <p>로딩 중...</p>
          ) : (
            <div className="post-container">
              <div className="post-body-row">
                <div className="post-info">
                  <h2>{post.title}</h2>
                  <p>
                    <strong>작성자:</strong> {post.nickname}
                  </p>
                  <p>
                    <strong>작성일:</strong> {formatDate(post.created_date)}
                  </p>
                  <p>
                    <strong>조회수:</strong> {post.views}
                  </p>
                  <p>
                    <strong>평균평점:</strong> {Number(post.rating).toFixed(1)}
                  </p>

                  {post.ratings?.length > 0 && (
                    <div className="post-ratings">
                      <h4>항목별 평점</h4>
                      <ul>
                        {post.ratings.map((item, i) => (
                          <li key={i}>
                            <strong>{item.aspect}:</strong> {item.score}점
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {post.image && (
                  <div className="post-image">
                    <img src={post.image} alt="포스터" />
                  </div>
                )}
              </div>
              <div className="post-content">{post.content}</div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default PostDetail;
