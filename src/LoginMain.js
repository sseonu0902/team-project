import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css";

function Main() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [activeSection, setActiveSection] = useState("popular");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [movies, setMovies] = useState([]);

  const totalCards = 10;
  const visibleCount = 2;
  const cardWidthPercent = 100 / totalCards;

  const heroImages = [
    "/images/alex-avalos-dnUNjIUCg5c-unsplash.jpg",
    "/images/daniel-k-cheung-i5Lmb7qPR7s-unsplash.jpg",
    "/images/geoffrey-moffett-TFRezw7pQwI-unsplash.jpg",
    "/images/anika-de-klerk-dWYjy9zIiF8-unsplash.jpg",
    "/images/felix-mooneeram-evlkOfkQ5rE-unsplash.jpg",
  ];
  const [heroIndex, setHeroIndex] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // 이미지 로드 후 상태 변경
  useEffect(() => {
    const img = new Image();
    img.src = heroImages[heroIndex];
    img.onload = () => setIsImageLoaded(true);
  }, [heroIndex]);

  // 이미지 자동 전환
  useEffect(() => {
    const interval = setInterval(() => {
      setIsImageLoaded(false); // 로딩 전환 효과 적용
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchMoviesByCategory = async (category) => {
    let url = "";
    switch (category) {
      case "popular":
        url = `https://api.themoviedb.org/3/movie/popular?api_key=6cf75faf0d9e5849e3c6650632ae6ff5&language=ko-KR&region=KR&page=1`;
        break;
      case "recommend":
        url = `https://api.themoviedb.org/3/movie/top_rated?api_key=6cf75faf0d9e5849e3c6650632ae6ff5&language=ko-KR&region=KR&page=1`;
        break;
      case "rising":
        url = `https://api.themoviedb.org/3/movie/now_playing?api_key=6cf75faf0d9e5849e3c6650632ae6ff5&language=ko-KR&region=KR&page=1`;
        break;
      case "falling":
        url = `https://api.themoviedb.org/3/movie/popular?api_key=6cf75faf0d9e5849e3c6650632ae6ff5&language=ko-KR&region=KR&page=10`;
        break;
      case "ott":
        url = `https://api.themoviedb.org/3/movie/popular?api_key=6cf75faf0d9e5849e3c6650632ae6ff5&language=ko-KR&region=KR&page=2`;
        break;
      default:
        url = `https://api.themoviedb.org/3/movie/popular?api_key=6cf75faf0d9e5849e3c6650632ae6ff5&language=ko-KR&region=KR&page=1`;
    }

    try {
      const response = await fetch(url);
      const data = await response.json();
      return data.results.slice(0, 10);
    } catch (error) {
      console.error("API 호출 오류:", error);
      return [];
    }
  };

  const categoryList = [
    { id: "popular", label: "인기 TOP10" },
    { id: "recommend", label: "추천 수 TOP10" },
    { id: "rising", label: "급 상승 TOP10" },
    { id: "falling", label: "급 하락 TOP10" },
    { id: "ott", label: "OTT 인기 TOP10" },
  ];

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");

    const loadInitialMovies = async () => {
      const initialMovies = await fetchMoviesByCategory("popular");
      setMovies(initialMovies);
    };
    loadInitialMovies();

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData?.nickname) setNickname(userData.nickname);
        if (userData?.profileImage) setProfileImage(userData.profileImage);
      } catch (e) {
        console.warn("⚠ JSON 파싱 실패:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    setNickname("");
    navigate("/Main");
  };

  const scrollToSection = async (id) => {
    setActiveSection(id);
    setCurrentIndex(0);
    const newMovies = await fetchMoviesByCategory(id);
    setMovies(newMovies);
  };

  const nextSlide = () => {
    const newIndex = (currentIndex + visibleCount) % totalCards;
    setCurrentIndex(newIndex);
  };

  const prevSlide = () => {
    const newIndex = (currentIndex - visibleCount + totalCards) % totalCards;
    setCurrentIndex(newIndex);
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
        {isLoggedIn && nickname && (
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
          <a href="#">리뷰게시판</a>
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

      <div
        className="hero-section"
        style={{ backgroundImage: `url(${heroImages[heroIndex]})` }}
      ></div>

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
              {[...Array(totalCards)].map((_, index) => (
                <div
                  className="movie-card"
                  key={index}
                  style={{
                    flex: `0 0 ${cardWidthPercent}%`,
                    maxWidth: `${cardWidthPercent}%`,
                  }}
                >
                  <img
                    src={
                      movies[index]?.poster_path
                        ? `https://image.tmdb.org/t/p/w500${movies[index].poster_path}`
                        : `movie${index + 1}.jpg`
                    }
                    alt={movies[index]?.title || `영화 ${index + 1}`}
                  />
                  <p>
                    {movies[index]
                      ? movies[index].title || movies[index].original_title
                      : "로딩 중..."}
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
