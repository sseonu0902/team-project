import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import axios from 'axios';

function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("john.doe@example.com");
  const [point, setPoint] = useState(0);
  const [mileage, setMileage] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState("남성");

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
        if (userData.age) setAge(userData.age);
        if (userData.gender) setGender(userData.gender);

        // 로그인 시 백엔드에서 포인트와 마일리지 가져오기
        fetchUserProfile(userData.email);
      }
    }
  }, []);

  // 백엔드에서 사용자 포인트와 마일리지 가져오기
  const fetchUserProfile = async (email) => {
    try {
      const response = await axios.get(`http://localhost:4000/mypage/${email}`);
      const userData = response.data;

      // 서버에서 포인트와 마일리지 받아오기
      setPoint(userData.point);
      setMileage(userData.mileage); // <- 추가된 부분
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
    navigate("/Main");
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const getLevelInfo = (point) => {
    const levels = [
      { level: 1, point: 100 },
      { level: 2, point: 200 },
      { level: 3, point: 300 },
      { level: 4, point: 400 },
      { level: 5, point: 500 },
      { level: 6, point: 600 },
      { level: 7, point: 700 },
      { level: 8, point: 800 },
      { level: 9, point: 900 },
      { level: 10, point: 1000 },
      { level: 11, point: 1500 },
      { level: 12, point: 1600 },
      { level: 13, point: 1700 },
      { level: 14, point: 1800 },
      { level: 15, point: 1900 },
      { level: 16, point: 2000 },
      { level: 17, point: 2100 },
      { level: 18, point: 2200 },
      { level: 19, point: 2300 },
      { level: 20, point: 2400 },
      { level: 21, point: 3100 },
      { level: 22, point: 3200 },
      { level: 23, point: 3300 },
      { level: 24, point: 3400 },
      { level: 25, point: 3500 },
      { level: 26, point: 3600 },
      { level: 27, point: 3700 },
      { level: 28, point: 3800 },
      { level: 29, point: 3900 },
      { level: 30, point: 4000 },
      { level: 31, point: 5000 },
      { level: 32, point: 5200 },
      { level: 33, point: 5400 },
      { level: 34, point: 5600 },
      { level: 35, point: 5800 },
      { level: 36, point: 6000 },
      { level: 37, point: 6200 },
      { level: 38, point: 6400 },
      { level: 39, point: 6600 },
      { level: 40, point: 6800 },
    ];

    let currentLevel = 1;
    let nextLevelPoint = 100;

    for (let i = 0; i < levels.length; i++) {
      if (point < levels[i].point) {
        currentLevel = levels[i].level - 1;
        nextLevelPoint = levels[i].point;
        break;
      }
    }

    let title = "";
    if (currentLevel <= 10) title = "🎬 초보 관람객";
    else if (currentLevel <= 20) title = "🍿 시사회 출입자";
    else if (currentLevel <= 30) title = "🎥 영화 평론가";
    else title = "🧠 해석 장인";

    return { currentLevel, nextLevelPoint, title };
  };

  const { currentLevel, nextLevelPoint, title } = getLevelInfo(point);
  const progress = Math.min((point / nextLevelPoint) * 100, 100);

  return (
    <div>
      <header>
        <h1>MRS</h1>
        <div className="search-container">
          <input type="text" className="search-input" placeholder="검색어를 입력하세요." />
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
        <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
      </header>

      <nav>
        <a href="/main">홈</a>
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
          <h3><strong>이름:</strong> {nickname || "John Doe"}</h3>
          <p><strong>이메일:</strong> {email}</p>
          <p><strong>포인트:</strong> {point} / {nextLevelPoint}</p>
          <p><strong>레벨:</strong> {title} (Lv.{currentLevel})</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <p style={{ fontSize: "0.8rem" }}>{progress.toFixed(1)}% 진행중</p>
          <p><strong>마일리지:</strong> {mileage}</p>
          <p><strong>나이:</strong> {age}</p>
          <p><strong>성별:</strong> {gender}</p>
        </div>
        <div className="button-group">
          <button onClick={() => navigate("/update-profile")}>프로필 수정</button>
          <button className="profile-btn">마일리지 내역</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
