import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Profile.css';
import defaultProfileImage from './assets/default-profile.png';

const API_BASE_URL = 'http://localhost:4000';

function Profile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [userData, setUserData] = useState({
    nickname: '',
    email: '',
    point: 0,
    grade: '초보 리뷰어',
    level: 1,
    age: '',
    gender: '',
    profileImage: null
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // localStorage에서 token과 user 정보 가져오기
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        // token 또는 user 정보가 없다면 로그인 화면으로 이동
        if (!token || !user) {
          console.log('No token or user found in localStorage');
          navigate('/login');
          return;
        }

        // 서버에서 사용자 정보 가져오기
        const response = await axios.get(`${API_BASE_URL}/api/user`, {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data) {
          // 응답 데이터에서 필요한 정보 가져오기
          const { nickname, email, point, grade, level, age, gender, profileImage } = response.data;

          // 상태 업데이트
          setUserData({
            nickname: nickname || '개발자',
            email: email || 'wndlswo1048@naver.com',
            point: point || 0,
            grade: grade || '초보 리뷰어',
            level: level || 1,
            age: age || '24',
            gender: gender || 'M',
            profileImage: profileImage || null
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const formData = new FormData();
        formData.append('profileImage', file);

        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_BASE_URL}/api/upload-profile-image`, formData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.data.imageUrl) {
          setUserData(prev => ({
            ...prev,
            profileImage: response.data.imageUrl
          }));
        }
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    }
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  const getGenderText = (gender) => {
    switch(gender) {
      case 'M': return '남성';
      case 'F': return '여성';
      default: return '미입력';
    }
  };

  // 레벨별 포인트 기준 설정
  const levelUpPoints = [
    { level: 1, points: 100 },
    { level: 2, points: 200 },
    { level: 3, points: 300 },
    { level: 4, points: 400 },
    { level: 5, points: 500 },
    { level: 6, points: 600 },
    { level: 7, points: 700 },
    { level: 8, points: 800 },
    { level: 9, points: 900 },
    { level: 10, points: 1000 },
    { level: 11, points: 1500 },
    { level: 12, points: 1600 },
    { level: 13, points: 1700 },
    { level: 14, points: 1800 },
    { level: 15, points: 1900 },
    { level: 16, points: 2000 },
    { level: 17, points: 2100 },
    { level: 18, points: 2200 },
    { level: 19, points: 2300 },
    { level: 20, points: 2400 },
    { level: 21, points: 3100 },
    { level: 22, points: 3200 },
    { level: 23, points: 3300 },
    { level: 24, points: 3400 },
    { level: 25, points: 3500 },
    { level: 26, points: 3600 },
    { level: 27, points: 3700 },
    { level: 28, points: 3800 },
    { level: 29, points: 3900 },
    { level: 30, points: 4000 },
    { level: 31, points: 5000 },
    { level: 32, points: 5200 },
    { level: 33, points: 5400 },
    { level: 34, points: 5500 },
    { level: 35, points: 5600 },
    { level: 36, points: 5700 },
    { level: 37, points: 5800 },
    { level: 38, points: 5900 },
    { level: 39, points: 6000 },
    { level: 40, points: 6800 },
  ];

  const getNextLevelPoints = () => {
    const currentLevelPoints = levelUpPoints[userData.level - 1]?.points || 0;
    const nextLevelPoints = levelUpPoints[userData.level]?.points || 0;
    return nextLevelPoints - currentLevelPoints;
  };

  const nextLevelPoints = 100;

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
        <button className="logout-btn" onClick={() => navigate("/login")}>
          로그아웃
        </button>
      </header>

      <nav>
        <Link to="/main">홈</Link>
        <div className="dropdown">
          <Link to="/MR">리뷰게시판</Link>
          <div className="dropdown-content">
            <Link to="/MR">영화 리뷰 게시판</Link>
            <Link to="/OTTMR">OTT 게시판</Link>
            <Link to="/FreeBoard">자유 게시판</Link>
          </div>
        </div>
        <div className="dropdown">
          <Link to="/genre">핫 이슈</Link>
          <div className="dropdown-content">
            <Link to="/top10">TOP10 영화</Link>
            <Link to="/news">영화 뉴스</Link>
          </div>
        </div>
        <div className="dropdown">
          <Link to="/upcoming">상영 예정작</Link>
          <div className="dropdown-content">
            <Link to="/upcoming/theater">영화관 상영 예정작</Link>
            <Link to="/upcoming/ott">OTT 상영 예정작</Link>
          </div>
        </div>
        <div className="dropdown">
          <Link to="/ott">OTT관</Link>
          <div className="dropdown-content">
            <Link to="/ott/netflix">넷플릭스</Link>
            <Link to="/ott/tving">티빙</Link>
            <Link to="/ott/watcha">왓챠</Link>
            <Link to="/ott/coupang">쿠팡플레이</Link>
            <Link to="/ott/wavve">웨이브</Link>
            <Link to="/ott/laftel">라프텔</Link>
          </div>
        </div>
        <div className="dropdown">
          <Link to="/theater">영화관</Link>
          <div className="dropdown-content">
            <Link to="/theater/cgv">CGV</Link>
            <Link to="/theater/lotte">롯데시네마</Link>
            <Link to="/theater/megabox">메가박스</Link>
          </div>
        </div>
        <Link to="/support">고객센터</Link>
      </nav>

      <div className="profile-card">
        <div className="profile-image">
          <div className="circle" onClick={handleImageClick}>
            {userData.profileImage ? (
              <img src={userData.profileImage} alt="프로필" className="preview-image" />
            ) : (
              <img src={defaultProfileImage} alt="기본 프로필" className="default-profile-image" />
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: 'none' }}
          />
        </div>

        <div className="level-info">
          <div className="level-header">
            <div className="level-title-container">
              <div className="level-title">{userData.grade}</div>
              <div className="level-text">Lv.{userData.level}</div>
            </div>
            <div className="point-info">
              <span>현재: {userData.point}P</span>
              <span>다음 레벨까지: {nextLevelPoints - userData.point}P</span>
            </div>
          </div>
          <div className="level-container">
            <div className="level-bar">
              <div 
                className="level-progress" 
                style={{ width: `${(userData.point / nextLevelPoints) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="profile-info">
          <div className="info-row">
            <span className="info-label">닉네임</span>
            <span className="info-value">{userData.nickname}</span>
          </div>
          <div className="info-row">
            <span className="info-label">이메일</span>
            <span className="info-value">{userData.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">나이</span>
            <span className="info-value">{userData.age}</span>
          </div>
          <div className="info-row">
            <span className="info-label">성별</span>
            <span className="info-value">{getGenderText(userData.gender)}</span>
          </div>
          <div className="button-container">
            <button className="edit-profile-btn" onClick={handleEditProfile}>
              프로필 수정
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
