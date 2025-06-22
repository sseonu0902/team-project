import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Genre.css";

function Genre() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);

  const sliderTrackRef = useRef(null);
  const itemsPerView = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (loggedIn && user) {
      setIsLoggedIn(true);
      setNickname(user.nickname || "");
      setProfileImage(user.profileImage || null);
    }
  }, []);

  const genreIds = {
    액션: 28,
    모험: 12,
    애니메이션: 16,
    코미디: 35,
    범죄: 80,
    다큐멘터리: 99,
    드라마: 18,
    가족: 10751,
    판타지: 14,
    역사: 36,
    공포: 27,
    음악: 10402,
    미스터리: 9648,
    로맨스: 10749,
    SF: 878,
    스릴러: 53,
    전쟁: 10752,
    서부: 37,
    뮤지컬: 10402,
    스포츠: 10770,
  };

  const genres = Object.keys(genreIds);

  const fetchMoviesByGenre = async (genreName) => {
    setError(null);
    const genreId = genreIds[genreName];
    if (!genreId) {
      setError("해당 장르의 ID가 존재하지 않습니다.");
      setMovies([]);
      setSelectedGenre("");
      return;
    }

    const apiKey = "6cf75faf0d9e5849e3c6650632ae6ff5";
    const url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_genres=${genreId}&language=ko-KR&region=KR&sort_by=vote_average.desc&vote_count.gte=100&vote_average.gte=7&page=1`;

    try {
      setLoading(true);
      const response = await fetch(url);
      if (!response.ok) throw new Error(`API 호출 실패: ${response.status}`);
      const data = await response.json();
      if (!data.results || data.results.length === 0) {
        setError("해당 장르의 영화가 없습니다.");
        setMovies([]);
        setSelectedGenre("");
        return;
      }
      setMovies(data.results.slice(0, 20));
      setSelectedGenre(genreName);
      setCurrentIndex(0);
    } catch (error) {
      console.error("장르별 영화 불러오기 실패:", error);
      setError("영화 정보를 불러오는 중 오류가 발생했습니다.");
      setMovies([]);
      setSelectedGenre("");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    setNickname("");
    navigate("/Main");
  };

  const updateSlider = () => {
    if (sliderTrackRef.current) {
      const itemWidth = sliderTrackRef.current.offsetWidth / itemsPerView;
      sliderTrackRef.current.style.transform = `translateX(-${
        currentIndex * itemWidth * itemsPerView
      }px)`;
    }
  };

  const handleNext = () => {
    const maxIndex = Math.ceil(movies.length / itemsPerView) - 1;
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    const maxIndex = Math.ceil(movies.length / itemsPerView) - 1;
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  useEffect(() => {
    updateSlider();
  }, [currentIndex, movies]);

  return (
    <div className="genre-page">
      <header>
        <h1 onClick={() => navigate(isLoggedIn ? "/LoginMain" : "/Main")}>
          MRS
        </h1>
        <div className="search-container">
          <input className="search-input" placeholder="검색어를 입력하세요." />
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
              <p className="user-nickname" onClick={() => navigate("/profile")}>
                {nickname}님
              </p>
              <button className="logout-btn" onClick={handleLogout}>
                로그아웃
              </button>
            </>
          ) : (
            <button className="login-btn" onClick={() => navigate("/login")}>
              로그인
            </button>
          )}
        </div>
      </header>

      <nav className="nav-bar">
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
          <a href="#">상영 예정작</a>
          <div className="dropdown-content">
            <a href="/TheaterComingSoon">영화관 상영 예정작</a>
            <a href="/OTTComingSoon">OTT 상영 예정작</a>
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

      <div className="genre-buttons-wrapper">
        {Array.from({ length: Math.ceil(genres.length / 5) }, (_, rowIndex) => (
          <div key={rowIndex} className="genre-button-row">
            {genres.slice(rowIndex * 5, rowIndex * 5 + 5).map((genre) => (
              <button
                key={genre}
                className={`genre-button ${
                  selectedGenre === genre ? "active" : ""
                }`}
                onClick={() => fetchMoviesByGenre(genre)}
              >
                {genre}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="movie-slider-wrapper">
        {loading ? (
          <p className="loading-text">불러오는 중...</p>
        ) : error ? (
          <p className="error-text">{error}</p>
        ) : movies.length > 0 ? (
          <>
            <button className="slider-arrow left-arrow" onClick={handlePrev}>
              &lt;
            </button>

            <div className="slider-wrapper">
              <div className="slider-container">
                <div className="slider-track" ref={sliderTrackRef}>
                  {movies.map((movie) => (
                    <div className="slider-item" key={movie.id}>
                      <img
                        src={
                          movie.poster_path
                            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                            : "/images/no-poster.png"
                        }
                        alt={movie.title}
                        className="movie-poster"
                      />
                      <div className="movie-info">
                        <h4 className="movie-title">{movie.title}</h4>
                        <p>⭐ 평점: {movie.vote_average?.toFixed(1)}</p>
                        <p>📅 개봉일: {movie.release_date || "정보 없음"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button className="slider-arrow right-arrow" onClick={handleNext}>
              &gt;
            </button>
          </>
        ) : (
          <p className="no-selection-text">
            장르를 선택하여 영화를 확인하세요.
          </p>
        )}
      </div>
    </div>
  );
}

export default Genre;
