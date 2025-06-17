// 상단 import 동일
import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./FreeBoard.css";

function FreeBoard() {
  const navigate = useNavigate();
  const { logout } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState("date");
  const [category, setCategory] = useState("자유게시판");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loginStatus);

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData?.nickname) setNickname(userData.nickname);
        if (userData?.profileImage) setProfileImage(userData.profileImage);
      } catch (e) {
        console.warn("⚠ 사용자 정보 파싱 실패:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
    setNickname("");
    logout();
    navigate("/Main");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/review", {
          params: { category, sort },
        });
        setPosts(response.data);
      } catch (error) {
        console.error("게시물 가져오기 실패:", error);
      }
    };
    fetchPosts();
  }, [category, sort]);

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

        <div className="user-info">
          {isLoggedIn && nickname ? (
            <>
              <img
                src={profileImage || "/images/BasicProfile.png"}
                alt="프로필"
                className="preview-image"
              />
              <p
                className="user-nickname"
                onClick={() => navigate("/profile")}
                style={{ cursor: "pointer" }}
              >
                {nickname}님
              </p>
              <button className="logout-btn" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <button className="login-btn" onClick={handleLogin}>
              로그인
            </button>
          )}
        </div>
      </header>

      {/* 네비게이션 */}
      <nav>
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
          <a href="#">리뷰게시판</a>
          <div className="dropdown-content">
            <a href="/MR">영화 리뷰 게시판</a>
            <a href="/OTTMR">OTT 게시판</a>
            <a href="/FreeBoard">자유 게시판</a>
          </div>
        </div>
        <div className="dropdown">
          <a href="#">핫 이슈</a>
          <div className="dropdown-content">
            <a href="/Top10">TOP10 영화</a>
            <a href="#">영화 뉴스</a>
          </div>
        </div>
        <div className="dropdown">
          <a href="/community">상영 예정작</a>
          <div className="dropdown-content">
            <a href="TheaterComingSoon">영화관 상영 예정작</a>
            <a href="OTTComingSoon">OTT 상영 예정작</a>
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
        <a href="/CustomerSupport">고객센터</a>
      </nav>

      {/* 메인 레이아웃 */}
      <div className="main-layout">
        {/* 사이드바 */}
        <aside className="sidebar">
          <ul>
            <li onClick={() => setCategory("현재 상영 영화 게시판")}>
              영화 커뮤니티
            </li>
            <li onClick={() => setCategory("OTT 영화 게시판")}>
              OTT 영화 커뮤니티
            </li>
            <li onClick={() => setCategory("자유게시판")}>자유게시판</li>
          </ul>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="main-content">
          <div className="board-header">
            <h3>자유게시판</h3>
            <button
              className="write-button"
              onClick={() => navigate("/CreatePost")}
            >
              글쓰기
            </button>
            <select
              className="sort-dropdown"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="views">조회수 높은 순</option>
              <option value="rating">평점 높은 순</option>
              <option value="date">최신 순</option>
            </select>
          </div>

          {/* 게시글 목록 헤더 */}
          <div className="post-list-header">
            <span>포스터</span>
            <span>평균평점</span>
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
                  <span>{Number(post.rating).toFixed(1)}</span>
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

export default FreeBoard;
