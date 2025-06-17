import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MileageHistory.css";

function MileageHistory() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loginStatus);

    if (!loginStatus) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    }

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
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    setNickname("");
    navigate("/Main");
  };

  return (
    <div className="mileage-page">
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
            <p
              className="user-nickname"
              style={{ cursor: "pointer" }}
              onClick={() => navigate("/profile")}
            >
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
          <a href="MR">리뷰게시판</a>
          <div className="dropdown-content">
            <a href="MR">영화 리뷰 게시판</a>
            <a href="OTTMR">OTT 게시판</a>
            <a href="FreeBoard">자유 게시판</a>
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
        <a href="CustomerSupport">고객센터</a>
      </nav>

      <div className="profile-card">
        <div className="profile-info">
          <h3 style={{ textAlign: "center", marginBottom: "30px" }}>
            경험치 & 마일리지 변동 내역
          </h3>

          <div className="mileage-summary">
            <div>
              현재 경험치: <span>1,250</span> XP
            </div>
            <div>
              마일리지: <span>3,400</span> P
            </div>
          </div>

          <table className="mileage-table">
            <thead>
              <tr>
                <th>날짜</th>
                <th>활동</th>
                <th>변동</th>
                <th>설명</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2025-05-24</td>
                <td>댓글 작성</td>
                <td>+10 XP</td>
                <td>리뷰에 댓글을 남김</td>
              </tr>
              <tr>
                <td>2025-05-23</td>
                <td>게시물 작성</td>
                <td>+50 XP</td>
                <td>'기생충 분석' 게시물 작성</td>
              </tr>
              <tr>
                <td>2025-05-22</td>
                <td>이벤트 참여</td>
                <td>+500 P</td>
                <td>출석 이벤트 참여</td>
              </tr>
              <tr>
                <td>2025-05-20</td>
                <td>좋아요 받음</td>
                <td>+20 XP</td>
                <td>내 글이 10개 좋아요 받음</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div
          className="button-group"
          style={{
            marginTop: "10px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <button
            className="mileage-profile-btn"
            onClick={() => navigate("/profile")}
          >
            프로필
          </button>
        </div>
      </div>
    </div>
  );
}

export default MileageHistory;
