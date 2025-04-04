import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("john.doe@example.com");
  const [point, setPoint] = useState(150);
  const [mileage, setMileage] = useState(300);
  const [profileImage, setProfileImage] = useState(null); // 업로드한 이미지 상태

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loginStatus);

    if (loginStatus) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.nickname) {
          setNickname(userData.nickname);
          setEmail(userData.email || "john.doe@example.com");
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
    navigate("/Main");
  };

  const handleImageClick = () => {
    fileInputRef.current.click(); // 숨겨진 파일 input 열기
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
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
          <p
            className="user-nickname"
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => navigate("/profile")}
          >
            {nickname}님
          </p>
        )}
        <button className="logout-btn" onClick={handleLogout}>
          로그아웃
        </button>
      </header>

      <nav>
        <Link to="/LoginMain">홈</Link>
        <div className="dropdown">
          <Link to="/MR">리뷰게시판</Link>
          <div className="dropdown-content">
            <Link to="/MR">영화 리뷰 게시판</Link>
            <Link to="/OTTMR">OTT 게시판</Link>
            <a href="#">시리즈물 게시판</a>
            <a href="#">자유 게시판</a>
          </div>
        </div>
        <div className="dropdown">
          <Link to="/genre">핫 이슈</Link>
          <div className="dropdown-content">
            <a href="#">TOP10 영화</a>
            <a href="#">영화 뉴스</a>
          </div>
        </div>
        <div className="dropdown">
          <Link to="/community">상영 예정작</Link>
          <div className="dropdown-content">
            <a href="#">영화관 상영 예정작</a>
            <a href="#">OTT 상영 예정작</a>
          </div>
        </div>
        <div className="dropdown">
          <Link to="/profile">OTT관</Link>
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
          <Link to="/contact">영화관</Link>
          <div className="dropdown-content">
            <a href="#">CGV</a>
            <a href="#">롯데시네마</a>
            <a href="#">메가박스</a>
          </div>
        </div>
        <a href="*">고객센터</a>
      </nav>

      <div className="profile-card">
        <div className="profile-image">
          <div className="circle" onClick={handleImageClick}>
            {profileImage ? (
              <img src={profileImage} alt="프로필" className="preview-image" />
            ) : (
              "프로필 사진"
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>
        <div className="profile-info">
          <h3>
            <strong>이름:</strong> {nickname}
          </h3>
          <p>
            <strong>이메일:</strong> {email}
          </p>
          <p>
            <strong>포인트:</strong> {point}
          </p>
          <p>
            <strong>마일리지:</strong> {mileage}
          </p>
        </div>
        <div className="button-group">
          <button className="profile-btn">프로필 수정</button>
          <button className="profile-btn">마일리지 내역</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
