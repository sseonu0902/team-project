import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css";

function Main() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState("popular");
  const [currentIndex, setCurrentIndex] = useState(0);

  const totalCards = 10;
  const visibleCount = 2;
  const cardWidthPercent = 100 / totalCards;

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  const nextSlide = () => {
    const newIndex = (currentIndex + visibleCount) % totalCards;
    setCurrentIndex(newIndex);
  };

  const prevSlide = () => {
    const newIndex = (currentIndex - visibleCount + totalCards) % totalCards;
    setCurrentIndex(newIndex);
  };

  const scrollToSection = (id) => {
    setActiveSection(id);
    setCurrentIndex(0);
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
        <h1>MRS</h1>
        <div className="search-container">
          <input className="search-input" placeholder="검색어를 입력하세요." />
          <button className="search-btn">검색</button>
        </div>
        <button className="login-btn" onClick={() => navigate("/login")}>
          로그인
        </button>
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
                    src={`movie${index + 1}.jpg`}
                    alt={`영화 ${index + 1}`}
                  />
                  <p>
                    {
                      categoryList.find((cat) => cat.id === activeSection)
                        ?.label
                    }{" "}
                    영화 {index + 1}
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
