import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MileageHistory.css";

function MileageHistory() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [gradeHistory, setGradeHistory] = useState([]);
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

        // ⭐ 유저 ID로 등급 이력 불러오기
        if (userData?.user_id) {
          fetch(`http://localhost:4000/api/grade-history/${userData.user_id}`)
            .then((res) => res.json())
            .then((data) => setGradeHistory(data))
            .catch((err) => console.error("이력 불러오기 실패:", err));
        }
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
          <a href="MR">게시판</a>
          <div className="dropdown-content">
            <a href="MR">영화 게시판</a>
            <a href="OTTMR">OTT 게시판</a>
            <a href="FreeBoard">자유 게시판</a>
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
        <a href="CustomerSupport">고객센터</a>
      </nav>

      <div className="profile-card">
        <div className="profile-info">
          <h3 style={{ textAlign: "center", marginBottom: "30px" }}>
            마일리지 변동 내역
          </h3>

          <div className="mileage-summary">
            <div>
              마일리지: <span>0</span> P
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
              {gradeHistory.length > 0 ? (
                gradeHistory.map((item, index) => (
                  <tr key={index}>
                    <td>
                      {new Date(item.change_datetime).toLocaleDateString()}
                    </td>
                    <td>
                      {item.change_description.includes("댓글")
                        ? "댓글 작성"
                        : item.change_description.includes("리뷰")
                        ? "게시물 작성"
                        : item.change_description.includes("좋아요")
                        ? "좋아요 받음"
                        : item.change_description.includes("이벤트")
                        ? "이벤트 참여"
                        : "기타"}
                    </td>
                    <td>
                      {item.change_amount > 0
                        ? `+${item.change_amount} XP`
                        : `${item.change_amount} XP`}
                    </td>
                    <td>{item.change_description}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    이력 데이터가 없습니다.
                  </td>
                </tr>
              )}
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
