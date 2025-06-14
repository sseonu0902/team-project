import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./TheaterComingSoon.css";

function TheaterComingSoon() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const theaterMovies = [
    {
      image: "/images/movie1.jpg",
      title: "파묘",
      description: "고대 무덤의 비밀을 파헤치는 미스터리 스릴러",
      author: "관리자",
      releaseDate: "2025.06.27",
      views: 153,
    },
    {
      image: "/images/movie2.jpg",
      title: "범죄도시 4",
      description: "형사 마석도의 새로운 통쾌한 액션 수사극",
      author: "운영자",
      releaseDate: "2025.07.03",
      views: 210,
    },
    {
      image: "/images/movie3.jpg",
      title: "쿵푸팬더4",
      description: "포와 친구들의 모험과 성장 이야기",
      author: "영화봇",
      releaseDate: "2025.07.11",
      views: 98,
    },
    {
      image: "/images/movie4.jpg",
      title: "혹성탈출: 새로운 시대",
      description: "인류와 유인원의 운명을 건 전쟁",
      author: "영화연구소",
      releaseDate: "2025.07.20",
      views: 120,
    },
    {
      image: "/images/movie5.jpg",
      title: "이프",
      description: "상상 속 친구와의 따뜻한 판타지 여행",
      author: "상상이",
      releaseDate: "2025.08.02",
      views: 187,
    },
  ];

  const totalPages = Math.ceil(theaterMovies.length / itemsPerPage);
  const currentItems = theaterMovies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
        console.warn("⚠ JSON 파싱 실패:", e);
      }
    }
  }, []);

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

      <main
        className="theater-main-content"
        style={{ marginTop: "160px", padding: "20px" }}
      >
        <h2>🎬 영화관 상영 예정작</h2>
        <div className="post-list-header">
          <span>포스터</span>
          <span>제목</span>
          <span>설명</span>
          <span>글쓴이</span>
          <span>개봉일</span>
          <span>조회</span>
        </div>

        <div className="post-list">
          {currentItems.map((movie, index) => (
            <div key={index} className="post-list-item">
              <span>
                <img
                  src={movie.image}
                  alt="포스터"
                  style={{ width: "50px", borderRadius: "4px" }}
                />
              </span>
              <span>{movie.title}</span>
              <span>{movie.description}</span>
              <span>{movie.author}</span>
              <span>{movie.releaseDate}</span>
              <span>{movie.views}</span>
            </div>
          ))}
        </div>

        {/* 페이지네이션 - Link 기반 */}
        <div className="pagination">
          <Link to="#">1</Link>
          <Link to="#">2</Link>
          <Link to="#">3</Link>
          <Link to="#">4</Link>
          <Link to="#">NEXT</Link>
        </div>
      </main>
    </div>
  );
}

export default TheaterComingSoon;
