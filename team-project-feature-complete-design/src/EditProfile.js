import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditProfile.css";
import { UserContext } from "./UserContext";

function EditProfile() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("john.doe@example.com");
  const [point, setPoint] = useState(0);
  const [mileage, setMileage] = useState(300);
  const [profileImage, setProfileImage] = useState(null);
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState("남성");
  const { user, logout } = useContext(UserContext);
  const [originalNickname, setOriginalNickname] = useState("");

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loginStatus);

    if (loginStatus) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.nickname) {
          setOriginalNickname(userData.nickname);
          setNickname(userData.nickname);
          setEmail(userData.email || "john.doe@example.com");
          if (userData.age) setAge(userData.age);
          if (userData.gender) setGender(userData.gender);

          axios
            .get(`http://localhost:4000/api/user-info`, {
              params: { nickname: userData.nickname },
            })
            .then((res) => {
              setPoint(res.data.points);
            })
            .catch((err) => {
              console.error("유저 포인트 조회 실패:", err);
            });
        }
        if (userData.age) setAge(userData.age);
        if (userData.gender) setGender(userData.gender);
        fetchUserProfile(userData.email);
      }
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

  const handleSave = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.user_id) {
      alert("로그인 정보를 불러올 수 없습니다.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:4000/api/user/${storedUser.user_id}/profile`,
        {
          nickname,
          age,
          gender,
        }
      );

      alert("프로필이 수정되었습니다. 다시 로그인해주세요.");
      localStorage.removeItem("user");
      localStorage.setItem("isLoggedIn", "false");
      navigate("/login");
    } catch (err) {
      console.error("프로필 저장 오류:", err);
      alert(
        "프로필 저장 실패: " +
          (err.response?.data?.message || "알 수 없는 오류")
      );
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
    const levels = [...Array(40)].map((_, i) => ({
      level: i + 1,
      point:
        100 +
        (i < 10
          ? i * 100
          : i - 10 < 10
          ? 1000 + (i - 10) * 100
          : 3000 + (i - 20) * 100),
    }));
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
            navigate(user ? "/LoginMain" : "/Main");
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
            <a href="/Genre">TOP10 영화</a>
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
    <a href="https://www.netflix.com" target="_blank" rel="noopener noreferrer">넷플릭스</a>
    <a href="https://www.tving.com" target="_blank" rel="noopener noreferrer">티빙</a>
    <a href="https://watcha.com" target="_blank" rel="noopener noreferrer">왓챠</a>
    <a href="https://www.coupangplay.com" target="_blank" rel="noopener noreferrer">쿠팡플레이</a>
    <a href="https://www.wavve.com" target="_blank" rel="noopener noreferrer">웨이브</a>
    <a href="https://www.laftel.net" target="_blank" rel="noopener noreferrer">라프텔</a>
  </div>
</div>
<div className="dropdown">
  <a href="/contact">영화관</a>
  <div className="dropdown-content">
    <a href="https://www.cgv.co.kr" target="_blank" rel="noopener noreferrer">CGV</a>
    <a href="https://www.lottecinema.co.kr" target="_blank" rel="noopener noreferrer">롯데시네마</a>
    <a href="https://www.megabox.co.kr" target="_blank" rel="noopener noreferrer">메가박스</a>
  </div>
</div>
        <a href="CustomerSupport">고객센터</a>
      </nav>

      <div className="profile-card">
        <div className="profile-image">
          <div className="circle" onClick={handleImageClick}>
            <img
              src={profileImage || "/images/BasicProfile.png"}
              alt="프로필"
              className="proflie-image"
            />
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
          <label>
            <strong>닉네임:</strong>
          </label>
          <input
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          <p>
            <strong>이메일:</strong> {email}
          </p>

          <p>
            <strong>포인트:</strong> {point} / {nextLevelPoint}
          </p>
          <p>
            <strong>레벨:</strong> {title} (Lv.{currentLevel})
          </p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p style={{ fontSize: "0.8rem" }}>{progress.toFixed(1)}% 진행중</p>

          <p>
            <strong>마일리지:</strong> {mileage}
          </p>

          <label>
            <strong>나이:</strong>
          </label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(Number(e.target.value))}
          />

          <label>
            <strong>성별:</strong>
          </label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="남성">남성</option>
            <option value="여성">여성</option>
          </select>

          <button onClick={handleSave}>저장</button>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;
