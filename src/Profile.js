import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Profile.css";
import axios from 'axios';

// API 기본 URL 설정
const API_BASE_URL = 'http://localhost:4000';

function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [point, setPoint] = useState(0);
  const [mileage, setMileage] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [level, setLevel] = useState(1);
  const [nextLevelPoints, setNextLevelPoints] = useState(200);

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loginStatus);

    if (loginStatus) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setNickname(userData.nickname || "");
          setEmail(userData.email || "");
          
          // 서버에서 최신 사용자 정보 가져오기
          const fetchUserData = async () => {
            try {
              const response = await axios.get(`${API_BASE_URL}/api/user/${userData.email}`, {
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                }
              });
              
              if (response.data) {
                const serverData = response.data;
                console.log('서버에서 받은 사용자 데이터:', serverData); // 디버깅용 로그
                setPoint(serverData.point || 0);
                setMileage(serverData.mileage || 0);
                setAge(serverData.age ? serverData.age.toString() : "");
                setGender(serverData.gender || "");
                
                // 포인트에 따른 레벨 계산
                const calculatedLevel = Math.floor((serverData.point || 0) / 100) + 1;
                setLevel(calculatedLevel);
                setNextLevelPoints(calculatedLevel * 100);
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
              if (error.response) {
                console.error('Error response:', error.response.data);
              }
            }
          };
          
          fetchUserData();
        } catch (error) {
          console.error('Error parsing user data:', error);
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
    fileInputRef.current.click();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const getLevelTitle = (level) => {
    if (level < 3) return "초보 리뷰어";
    if (level < 5) return "중급 리뷰어";
    if (level < 7) return "고급 리뷰어";
    return "마스터 리뷰어";
  };

  const calculateProgress = () => {
    const currentLevelPoints = (level - 1) * 100;
    const progress = ((point - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  return (
    <div>
      <header>
        <h1>MRS</h1>
        <div className="search-container">
          <input type="text" className="search-input" placeholder="검색어를 입력하세요." />
          <button className="search-button">검색</button>
        </div>
        {isLoggedIn && nickname && (
          <p className="user-nickname" style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => navigate("/profile")}>
            {nickname}님
          </p>
        )}
        <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
      </header>

      <nav>
        <Link to="/LoginMain">홈</Link>
        <div className="dropdown">
          <Link to="/MR">리뷰게시판</Link>
          <div className="dropdown-content">
            <a href="MR">영화 리뷰 게시판</a>
            <a href="OTTMR">OTT 게시판</a>
            <a href="FreeBoard">자유 게시판</a>
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
        
        <div className="level-info">
          <div className="level-header">
            <div className="level-title-container">
              <div className="level-title">{getLevelTitle(level)}</div>
              <div className="level-text">Lv.{level}</div>
            </div>
            <div className="point-info">
              <span>현재: {point}P</span>
              <span>다음 레벨까지: {nextLevelPoints - point}P</span>
            </div>
          </div>
          <div className="level-container">
            <div className="level-bar">
              <div className="level-progress" style={{ width: `${calculateProgress()}%` }}></div>
            </div>
          </div>
        </div>

        <div className="profile-info">
          <div className="info-row">
            <span className="info-label">닉네임:</span>
            <span className="info-value">{nickname}</span>
          </div>
          <div className="info-row">
            <span className="info-label">이메일:</span>
            <span className="info-value">{email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">나이:</span>
            <span className="info-value">{age ? `${age}세` : "미입력"}</span>
          </div>
          <div className="info-row">
            <span className="info-label">성별:</span>
            <span className="info-value">
              {gender === 'M' ? '남성' : gender === 'F' ? '여성' : '미입력'}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">마일리지:</span>
            <span className="info-value">{mileage}P</span>
          </div>
          <div className="button-container">
            <button className="edit-profile-btn" onClick={() => navigate('/edit-profile')}>
              프로필 수정
            </button>
            <button className="mileage-btn" onClick={() => navigate('/mileage-history')}>
              마일리지 내역
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
