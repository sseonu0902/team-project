import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css";

function Main() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
  }, []);

  const slideCarousel = (id, direction) => {
    const carousel = document.querySelector(`#${id} .carousel-track`);
    const cardWidth = 280;
    let currentTransform =
      parseInt(
        carousel.style.transform.replace("translateX(", "").replace("px)", "")
      ) || 0;
    const cardCount = document.querySelectorAll(`#${id} .movie-card`).length;
    const maxTransform = -(cardCount - 1) * cardWidth;

    let newTransform = currentTransform + direction * cardWidth;

    if (newTransform > 0) {
      newTransform = maxTransform;
    } else if (newTransform < maxTransform) {
      newTransform = 0;
    }

    carousel.style.transform = `translateX(${newTransform}px)`;
  };

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
        <button className="login-btn" onClick={() => navigate("/login")}>
          로그인
        </button>
        <button className="register-btn" onClick={() => navigate("/register")}>
          회원가입
        </button>
      </header>

      <nav>
        <a href="/main">홈</a>
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

      <div className="carousel-container" id="popular1">
        <h2>인기 TOP10 영화</h2>
        <button
          className="carousel-button prev"
          onClick={() => slideCarousel("popular1", 1)}
        >
          &lt;
        </button>
        <div className="carousel">
          <div className="carousel-track">
            <div className="movie-card">
              <img src="movie1.jpg" alt="영화 1" />
              <p>영화 1</p>
            </div>
            <div className="movie-card">
              <img src="movie2.jpg" alt="영화 2" />
              <p>영화 2</p>
            </div>
            <div className="movie-card">
              <img src="movie3.jpg" alt="영화 3" />
              <p>영화 3</p>
            </div>
            <div className="movie-card">
              <img src="movie4.jpg" alt="영화 4" />
              <p>영화 4</p>
            </div>
            <div className="movie-card">
              <img src="movie5.jpg" alt="영화 5" />
              <p>영화 5</p>
            </div>
            <div className="movie-card">
              <img src="movie6.jpg" alt="영화 6" />
              <p>영화 6</p>
            </div>
            <div className="movie-card">
              <img src="movie7.jpg" alt="영화 7" />
              <p>영화 7</p>
            </div>
            <div className="movie-card">
              <img src="movie8.jpg" alt="영화 8" />
              <p>영화 8</p>
            </div>
            <div className="movie-card">
              <img src="movie9.jpg" alt="영화 9" />
              <p>영화 9</p>
            </div>
            <div className="movie-card">
              <img src="movie10.jpg" alt="영화 10" />
              <p>영화 10</p>
            </div>
          </div>
        </div>
        <button
          className="carousel-button next"
          onClick={() => slideCarousel("popular1", -1)}
        >
          &gt;
        </button>
      </div>

      <div className="carousel-container" id="popular2">
        <h2>추천 수 TOP10 영화</h2>
        <button
          className="carousel-button prev"
          onClick={() => slideCarousel("popular2", 1)}
        >
          &lt;
        </button>
        <div className="carousel">
          <div className="carousel-track">
            {/* ... (repeat movie cards) ... */}
            <div className="movie-card">
              <img src="movie1.jpg" alt="영화 1" />
              <p>영화 1</p>
            </div>
            <div className="movie-card">
              <img src="movie2.jpg" alt="영화 2" />
              <p>영화 2</p>
            </div>
            <div className="movie-card">
              <img src="movie3.jpg" alt="영화 3" />
              <p>영화 3</p>
            </div>
            <div className="movie-card">
              <img src="movie4.jpg" alt="영화 4" />
              <p>영화 4</p>
            </div>
            <div className="movie-card">
              <img src="movie5.jpg" alt="영화 5" />
              <p>영화 5</p>
            </div>
            <div className="movie-card">
              <img src="movie6.jpg" alt="영화 6" />
              <p>영화 6</p>
            </div>
            <div className="movie-card">
              <img src="movie7.jpg" alt="영화 7" />
              <p>영화 7</p>
            </div>
            <div className="movie-card">
              <img src="movie8.jpg" alt="영화 8" />
              <p>영화 8</p>
            </div>
            <div className="movie-card">
              <img src="movie9.jpg" alt="영화 9" />
              <p>영화 9</p>
            </div>
            <div className="movie-card">
              <img src="movie10.jpg" alt="영화 10" />
              <p>영화 10</p>
            </div>
          </div>
        </div>
        <button
          className="carousel-button next"
          onClick={() => slideCarousel("popular2", -1)}
        >
          &gt;
        </button>
      </div>

      <div className="carousel-container" id="popular3">
        <h2>급 상승 중인인 TOP10 영화</h2>
        <button
          className="carousel-button prev"
          onClick={() => slideCarousel("popular3", 1)}
        >
          &lt;
        </button>
        <div className="carousel">
          <div className="carousel-track">
            {/* ... (repeat movie cards) ... */}
            <div className="movie-card">
              <img src="movie1.jpg" alt="영화 1" />
              <p>영화 1</p>
            </div>
            <div className="movie-card">
              <img src="movie2.jpg" alt="영화 2" />
              <p>영화 2</p>
            </div>
            <div className="movie-card">
              <img src="movie3.jpg" alt="영화 3" />
              <p>영화 3</p>
            </div>
            <div className="movie-card">
              <img src="movie4.jpg" alt="영화 4" />
              <p>영화 4</p>
            </div>
            <div className="movie-card">
              <img src="movie5.jpg" alt="영화 5" />
              <p>영화 5</p>
            </div>
            <div className="movie-card">
              <img src="movie6.jpg" alt="영화 6" />
              <p>영화 6</p>
            </div>
            <div className="movie-card">
              <img src="movie7.jpg" alt="영화 7" />
              <p>영화 7</p>
            </div>
            <div className="movie-card">
              <img src="movie8.jpg" alt="영화 8" />
              <p>영화 8</p>
            </div>
            <div className="movie-card">
              <img src="movie9.jpg" alt="영화 9" />
              <p>영화 9</p>
            </div>
            <div className="movie-card">
              <img src="movie10.jpg" alt="영화 10" />
              <p>영화 10</p>
            </div>
          </div>
        </div>
        <button
          className="carousel-button next"
          onClick={() => slideCarousel("popular3", -1)}
        >
          &gt;
        </button>
      </div>

      <div className="carousel-container" id="popular4">
        <h2>급 하락 중인 TOP10 영화</h2>
        <button
          className="carousel-button prev"
          onClick={() => slideCarousel("popular4", 1)}
        >
          &lt;
        </button>
        <div className="carousel">
          <div className="carousel-track">
            {/* ... (repeat movie cards) ... */}
            <div className="movie-card">
              <img src="movie1.jpg" alt="영화 1" />
              <p>영화 1</p>
            </div>
            <div className="movie-card">
              <img src="movie2.jpg" alt="영화 2" />
              <p>영화 2</p>
            </div>
            <div className="movie-card">
              <img src="movie3.jpg" alt="영화 3" />
              <p>영화 3</p>
            </div>
            <div className="movie-card">
              <img src="movie4.jpg" alt="영화 4" />
              <p>영화 4</p>
            </div>
            <div className="movie-card">
              <img src="movie5.jpg" alt="영화 5" />
              <p>영화 5</p>
            </div>
            <div className="movie-card">
              <img src="movie6.jpg" alt="영화 6" />
              <p>영화 6</p>
            </div>
            <div className="movie-card">
              <img src="movie7.jpg" alt="영화 7" />
              <p>영화 7</p>
            </div>
            <div className="movie-card">
              <img src="movie8.jpg" alt="영화 8" />
              <p>영화 8</p>
            </div>
            <div className="movie-card">
              <img src="movie9.jpg" alt="영화 9" />
              <p>영화 9</p>
            </div>
            <div className="movie-card">
              <img src="movie10.jpg" alt="영화 10" />
              <p>영화 10</p>
            </div>
          </div>
        </div>
        <button
          className="carousel-button next"
          onClick={() => slideCarousel("popular4", -1)}
        >
          &gt;
        </button>
      </div>

      <div className="carousel-container" id="popular2">
        <h2>OTT TOP10 영화</h2>
        <button
          className="carousel-button prev"
          onClick={() => slideCarousel("popular5", 1)}
        >
          &lt;
        </button>
        <div className="carousel">
          <div className="carousel-track">
            <div className="movie-card">
              <img src="movie1.jpg" alt="영화 1" />
              <p>영화 1</p>
            </div>
            <div className="movie-card">
              <img src="movie2.jpg" alt="영화 2" />
              <p>영화 2</p>
            </div>
            <div className="movie-card">
              <img src="movie3.jpg" alt="영화 3" />
              <p>영화 3</p>
            </div>
            <div className="movie-card">
              <img src="movie4.jpg" alt="영화 4" />
              <p>영화 4</p>
            </div>
            <div className="movie-card">
              <img src="movie5.jpg" alt="영화 5" />
              <p>영화 5</p>
            </div>
            <div className="movie-card">
              <img src="movie6.jpg" alt="영화 6" />
              <p>영화 6</p>
            </div>
            <div className="movie-card">
              <img src="movie7.jpg" alt="영화 7" />
              <p>영화 7</p>
            </div>
            <div className="movie-card">
              <img src="movie8.jpg" alt="영화 8" />
              <p>영화 8</p>
            </div>
            <div className="movie-card">
              <img src="movie9.jpg" alt="영화 9" />
              <p>영화 9</p>
            </div>
            <div className="movie-card">
              <img src="movie10.jpg" alt="영화 10" />
              <p>영화 10</p>
            </div>
          </div>
        </div>
        <button
          className="carousel-button next"
          onClick={() => slideCarousel("popular5", -1)}
        >
          &gt;
        </button>
      </div>
    </div>
  );
}

export default Main;
