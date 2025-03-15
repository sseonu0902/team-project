// LoginMain.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Main.css";

function LoginMain() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState(""); // 닉네임을 저장할 상태 변수

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loginStatus);

    if (loginStatus) {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        const userData = JSON.parse(storedUser);
        console.log("저장된 사용자 정보:", userData); // 🟢 디버깅용 로그
        if (userData && userData.nickname) {
          setNickname(userData.nickname);
        } else {
          console.warn("⚠ nickname 값이 없음! 서버 응답을 확인하세요.");
        }
      } else {
        console.warn("⚠ localStorage에서 user가 없음!");
      }
    }
  }, []);

  const handleLogout = () => {
    // 로그아웃 처리: localStorage에서 isLoggedIn 삭제
    localStorage.removeItem("user");
    
    // 상태를 false로 설정
    setIsLoggedIn(false);

    // Main 페이지로 리디렉션
    navigate("/Main");
  };

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
      newTransform = 0;
    } else if (newTransform < maxTransform) {
      newTransform = maxTransform;
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
        {isLoggedIn && nickname && (
          <p className="user-nickname">{nickname}님</p>
        )}
        <button className="logout-btn" onClick={handleLogout}>
          로그아웃
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

export default LoginMain;
