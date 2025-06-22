import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./FreeBoard.css";

function FreeBoard() {
  const navigate = useNavigate();
  const location = useLocation(); // 현재 경로 추적
  const { logout } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [sort, setSort] = useState("date");
  const [category, setCategory] = useState("자유 게시판");

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
          <a href="#">게시판</a>
          <div className="dropdown-content">
            <a href="/MR">영화 게시판</a>
            <a href="/OTTMR">OTT 게시판</a>
            <a href="/FreeBoard">자유 게시판</a>
          </div>
        </div>
        <div className="dropdown">
          <a href="Genre">장르</a>
          <div className="dropdown-content"></div>
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
            <a
              href="https://www.netflix.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              넷플릭스
            </a>
            <a
              href="https://www.tving.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              티빙
            </a>
            <a
              href="https://watcha.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              왓챠
            </a>
            <a
              href="https://www.coupangplay.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              쿠팡플레이
            </a>
            <a
              href="https://www.wavve.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              웨이브
            </a>
            <a
              href="https://www.laftel.net"
              target="_blank"
              rel="noopener noreferrer"
            >
              라프텔
            </a>
          </div>
        </div>
        <div className="dropdown">
          <a href="/contact">영화관</a>
          <div className="dropdown-content">
            <a
              href="https://www.cgv.co.kr"
              target="_blank"
              rel="noopener noreferrer"
            >
              CGV
            </a>
            <a
              href="https://www.lottecinema.co.kr"
              target="_blank"
              rel="noopener noreferrer"
            >
              롯데시네마
            </a>
            <a
              href="https://www.megabox.co.kr"
              target="_blank"
              rel="noopener noreferrer"
            >
              메가박스
            </a>
          </div>
        </div>
        <a href="/CustomerSupport">고객센터</a>
      </nav>

      <div className="main-layout">
        <aside className="sidebar">
          <ul>
            <li
              className={location.pathname === "/MR" ? "active" : ""}
              onClick={() => navigate("/MR")}
            >
              영화 커뮤니티
            </li>
            <li
              className={location.pathname === "/OTTMR" ? "active" : ""}
              onClick={() => navigate("/OTTMR")}
            >
              OTT 커뮤니티
            </li>
            <li
              className={location.pathname === "/FreeBoard" ? "active" : ""}
              onClick={() => navigate("/FreeBoard")}
            >
              자유 게시판
            </li>
          </ul>
        </aside>

        <main className="main-content">
          <div className="board-header">
            <h3>{category}</h3>
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

          <div className="post-list-header">
            <span>포스터</span>
            <span>평균평점</span>
            <span>제목</span>
            <span>글쓴이</span>
            <span>날짜</span>
            <span>조회</span>
          </div>

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
