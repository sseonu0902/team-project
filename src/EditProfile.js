import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./EditProfile.css"; // EditProfile CSS 파일을 추가하세요.
import axios from "axios";

function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [point, setPoint] = useState(0);
  const [mileage, setMileage] = useState(0);
  const [profileImage, setProfileImage] = useState(null);
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState("남성");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setNickname(userData.nickname);
      setEmail(userData.email);
      setAge(userData.age);
      setGender(userData.gender);

      // 백엔드에서 포인트와 마일리지 가져오기
      fetchUserProfile(userData.email);
    }
  }, []);

  const fetchUserProfile = async (email) => {
    try {
      const response = await axios.get(`http://localhost:4000/mypage/${email}`);
      const userData = response.data;
      setPoint(userData.point);
      setMileage(userData.mileage);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
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

  const handleSaveChanges = () => {
    // 프로필 변경 사항 저장 로직
    // 예: 백엔드에 변경된 프로필 데이터를 전송
  };

  const handleCancel = () => {
    navigate("/profile");
  };

  return (
    <div>
      {/* 상단 헤더 */}
      <header>
        <h1>MRS</h1>
        <div className="search-container">
          <input type="text" className="search-input" placeholder="검색어를 입력하세요." />
          <button className="search-button">검색</button>
        </div>
        <p
          className="user-nickname"
          style={{ cursor: "pointer", textDecoration: "underline" }}
          onClick={() => navigate("/profile")}
        >
          {nickname}님
        </p>
        <button className="logout-btn">로그아웃</button>
      </header>

      {/* 네비게이션 바 */}
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

      <div className="edit-profile-card">
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
            <strong>이름:</strong>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </h3>
          <p><strong>이메일:</strong> {email}</p>
          <p><strong>포인트:</strong> {point}</p>
          <p><strong>마일리지:</strong> {mileage}</p>
          <p><strong>나이:</strong>
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </p>
          <p><strong>성별:</strong>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="남성">남성</option>
              <option value="여성">여성</option>
            </select>
          </p>
        </div>

        <div className="button-group">
          <button onClick={handleSaveChanges}>저장</button>
          <button onClick={handleCancel}>취소</button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
