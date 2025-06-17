import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TheaterComingSoon.css";

const API_KEY = "6cf75faf0d9e5849e3c6650632ae6ff5"; // 🔁 여기 본인의 TMDb API 키 입력

function TheaterComingSoon() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [movies, setMovies] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/upcoming?language=ko-KR&region=KR&api_key=${API_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data?.results) {
          const filtered = data.results.filter(
            (movie) => movie.original_language === "ko"
          );
          setMovies(filtered);
        }
      })
      .catch((err) => console.error("TMDb API 에러:", err));
  }, []);

  const totalPages = Math.ceil(movies.length / itemsPerPage);
  const currentItems = movies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    setNickname("");
    navigate("/main");
  };

  return (
    <div className="theater-page">
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

        {isLoggedIn && nickname ? (
          <div className="user-info">
            <img
              src={profileImage || "/images/BasicProfile.png"}
              alt="프로필"
              className="preview-image"
            />
            <p className="user-nickname" onClick={() => navigate("/profile")}>
              {nickname}님
            </p>
            <button className="logout-btn" onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        ) : (
          <button className="login-btn" onClick={() => navigate("/login")}>
            로그인
          </button>
        )}
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
          <a href="/MR">리뷰게시판</a>
          <div className="dropdown-content">
            <a href="/MR">영화 리뷰 게시판</a>
            <a href="/OTTMR">OTT 게시판</a>
            <a href="/FreeBoard">자유 게시판</a>
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
          <a href="#">상영 예정작</a>
          <div className="dropdown-content">
            <a href="/TheaterComingSoon">영화관 상영 예정작</a>
            <a href="/OTTComingSoon">OTT 상영 예정작</a>
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

      <main className="theater-main-content" style={{ marginTop: "160px", padding: "20px" }}>
        <h2>🎬 영화관 상영 예정작</h2>
        <div className="post-list-header">
          <span>포스터</span>
          <span>제목</span>
          <span>설명</span>
          <span>개봉일</span>
        </div>

        <div className="post-list">
          {currentItems.map((movie) => (
            <div key={movie.id} className="post-list-item">
              <span>
                <img
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  alt={movie.title}
                  style={{ width: "50px", borderRadius: "4px" }}
                />
              </span>
              <span>{movie.title}</span>
              <span>{movie.overview.slice(0, 50)}...</span>
              <span>{movie.release_date}</span>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button onClick={handlePrev} disabled={currentPage === 1}>
            이전
          </button>
          <span>{currentPage} / {totalPages}</span>
          <button onClick={handleNext} disabled={currentPage === totalPages}>
            다음
          </button>
        </div>
      </main>
    </div>
  );
}

export default TheaterComingSoon;
