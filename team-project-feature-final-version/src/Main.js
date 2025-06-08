import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css";

function Main() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState("popular");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [movies, setMovies] = useState([]);

  const totalCards = 10;
  const visibleCount = 2;
  const cardWidthPercent = 100 / totalCards;
  const fetchMoviesByCategory = async (category) => {
    let url = "";
  
    switch (category) {
      case "popular": // 인기 TOP10
        url = `https://api.themoviedb.org/3/movie/popular?api_key=6cf75faf0d9e5849e3c6650632ae6ff5&language=ko-KR&region=KR&page=1`;
        break;
  
      case "recommend": // 추천 수 TOP10 (평점 높은 영화)
        url = `https://api.themoviedb.org/3/movie/top_rated?api_key=6cf75faf0d9e5849e3c6650632ae6ff5&language=ko-KR&region=KR&page=1`;
        break;
  
      case "rising": // 급 상승 TOP10 (지금 상영 중인 영화)
        url = `https://api.themoviedb.org/3/movie/now_playing?api_key=6cf75faf0d9e5849e3c6650632ae6ff5&language=ko-KR&region=KR&page=1`;
        break;
  
      case "falling": // 급 하락 TOP10 (임시: 인기 영화 10페이지, 인기 낮은 편 가정)
        url = `https://api.themoviedb.org/3/movie/popular?api_key=6cf75faf0d9e5849e3c6650632ae6ff5&language=ko-KR&region=KR&page=10`;
        break;
  
      case "ott": // OTT 인기 TOP10 (임시로 popular 2페이지 데이터)
        url = `https://api.themoviedb.org/3/movie/popular?api_key=6cf75faf0d9e5849e3c6650632ae6ff5&language=ko-KR&region=KR&page=2`;
        break;
  
      default:
        url = `https://api.themoviedb.org/3/movie/popular?api_key=6cf75faf0d9e5849e3c6650632ae6ff5&language=ko-KR&region=KR&page=1`;
        break;
    }
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      // 영화 리스트 중 상위 10개만 반환
      return data.results.slice(0, 10);
    } catch (error) {
      console.error("API 호출 오류:", error);
      return [];
    }
  };

  const onCategoryClick = async (categoryId) => {
    setActiveSection(categoryId);
    setCurrentIndex(0);

    const moviesData = await fetchMoviesByCategory(categoryId);
    setMovies(moviesData);
  };

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    const loadInitialMovies = async () => {
      const initialMovies = await fetchMoviesByCategory("popular");
      setMovies(initialMovies);
    };
    const fetchKoreanPopularMovies = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=6cf75faf0d9e5849e3c6650632ae6ff5&language=ko-KR&region=KR&page=1`
        );
        const data = await response.json();
        console.log("TMDB API data.results:", data.results);
        const top10 = data.results.slice(0, 10);
        setMovies(top10);
      } catch (error) {
        console.error("TMDB API 호출 오류:", error);
      }
    };
  
    fetchKoreanPopularMovies();
    loadInitialMovies();
  }, []);

  const nextSlide = () => {
    const newIndex = (currentIndex + visibleCount) % totalCards;
    setCurrentIndex(newIndex);
  };

  const prevSlide = () => {
    const newIndex = (currentIndex - visibleCount + totalCards) % totalCards;
    setCurrentIndex(newIndex);
  };

  const scrollToSection = async (id) => {
    setActiveSection(id);
    setCurrentIndex(0);
    const newMovies = await fetchMoviesByCategory(id);
    setMovies(newMovies);
  };

  const categoryList = [
    { id: "popular", label: "인기 TOP10" },
    { id: "recommend", label: "추천 수 TOP10" },
    { id: "rising", label: "급 상승 TOP10" },
    { id: "falling", label: "급 하락 TOP10" },
    { id: "ott", label: "OTT 인기 TOP10" },
  ];

  return (
    <div>
      <header>
        <div className="header-left">
          <h1 style={{ margin: 0 }}>MRS</h1>
        </div>

        <div className="search-container">
          <input
            type="text"
            class="search-input"
            placeholder="검색어를 입력하세요."
          />
          <button class="search-button">검색</button>
        </div>

        <div className="header-right">
          {!isLoggedIn && (
            <button className="login-btn" onClick={() => navigate("/login")}>
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
          <a href="MR">리뷰게시판</a>
          <div className="dropdown-content">
            <a href="MR">영화 리뷰 게시판</a>
            <a href="OTTMR">OTT 게시판</a>
            <a href="FreeBoard">자유 게시판</a>
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
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            if (isLoggedIn) {
              navigate("/support");
            } else {
              alert("로그인 후 이용할 수 있습니다.");
              navigate("/login");
            }
          }}
        >
          고객센터
        </a>
      </nav>

      <div className="hero-section">
        <div className="hero-overlay">
          <h2 className="hero-title">Explore the World of Cinema</h2>
          <p className="hero-subtitle">
            Discover your next favorite movie. Personalized recommendations
            await.
          </p>
          <button className="hero-button">🎬 View Featured Movie</button>
        </div>
      </div>

      <div className="carousel-nav">
        {categoryList.map((cat) => (
          <button
            key={cat.id}
            onClick={() => scrollToSection(cat.id)}
            className={activeSection === cat.id ? "active" : ""}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="carousel-container">
        <h2>{categoryList.find((cat) => cat.id === activeSection)?.label}</h2>
        <div className="carousel-wrapper">
          <button className="carousel-button prev" onClick={prevSlide}>
            &lt;
          </button>
          <div className="carousel">
            <div
              className="carousel-track"
              style={{
                display: "flex",
                overflow: "hidden",
                transform: `translateX(-${cardWidthPercent * currentIndex}%)`,
                transition: "transform 0.5s ease-in-out",
              }}
            >
              {movies.map((movie, index) => (
                <div
                  className="movie-card"
                  key={movie.id || index}
                  style={{
                    flex: `0 0 ${cardWidthPercent}%`,
                    maxWidth: `${cardWidthPercent}%`,
                    padding: "0 5px",
                  }}
                >
                  <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : `movie${index + 1}.jpg`
              }
              alt={movie.title || movie.original_title}
              style={{ width: "100%", borderRadius: "8px" }}
            />
                    <p style={{ textAlign: "center", marginTop: "8px" }}>
              {movie.title || movie.original_title}
            </p>
                </div>
              ))}
            </div>
          </div>
          <button className="carousel-button next" onClick={nextSlide}>
            &gt;
          </button>
        </div>
      </div>

      <footer>
        <div className="footer-content">
          <div className="footer-left">
            <h3>MRS</h3>
            <p>영화를 사랑하는 사람들을 위한 최고의 리뷰 플랫폼</p>
          </div>
          <div className="footer-right">
            <a href="#">개인정보처리방침</a>
            <a href="#">이용약관</a>
            <a href="#">고객센터</a>
          </div>
        </div>
        <div className="footer-bottom">
          &copy; 2025 MRS Movie Review System. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Main;
