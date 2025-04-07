import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import "./CreatePost.css";

const categories = ["자유게시판", "현재 상영 영화 게시판", "OTT 영화 게시판"];
const ratingAspects = ["스토리", "배우(캐릭터)", "음악(OST)", "몰입도", "연출"];

const StarRating = ({ rating, setRating }) => (
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map((star) => (
      <FaStar
        key={star}
        size={30}
        onClick={() => setRating(star)}
        color={star <= rating ? "#ffc107" : "#e4e5e9"}
        style={{ cursor: "pointer" }}
      />
    ))}
  </div>
);

const CreatePost = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const [category, setCategory] = useState(categories[1]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [ratings, setRatings] = useState([
    { aspect: ratingAspects[0], score: 0 },
  ]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loginStatus);

    if (loginStatus) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData.nickname) {
          setNickname(userData.nickname);
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRatingChange = (index, score) => {
    const updated = [...ratings];
    updated[index].score = score;
    setRatings(updated);
  };

  const handleAspectChange = (index, value) => {
    const updated = [...ratings];
    updated[index].aspect = value;
    setRatings(updated);
  };

  const handleAddRatingField = () => {
    setRatings([...ratings, { aspect: ratingAspects[0], score: 0 }]);
  };

  const handleRemoveRatingField = (index) => {
    if (ratings.length <= 1) return;
    const updated = [...ratings];
    updated.splice(index, 1);
    setRatings(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newPost = {
      movie_id: null,
      nickname: user.nickname,
      category,
      title,
      content,
      image,
      ratings,
    };

    try {
      await axios.post("http://localhost:4000/api/review", newPost);
      alert("리뷰가 성공적으로 등록되었습니다.");
      navigate("/MR");
    } catch (error) {
      console.error("리뷰 등록 실패:", error);
      alert("리뷰 등록에 실패했습니다.");
    }
  };

  if (!user) {
    return (
      <div>
        <h2>로그인 후 게시물을 작성할 수 있습니다.</h2>
        <button onClick={() => navigate("/login")}>로그인</button>
      </div>
    );
  }

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
          <p className="user-nickname" onClick={() => navigate("/profile")}>
            {nickname}님
          </p>
        )}
        <button className="logout-btn" onClick={handleLogout}>
          로그아웃
        </button>
      </header>

      <nav>
        <a href="/LoginMain">홈</a>
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

      <div className="review-container">
        <h2>리뷰 작성</h2>

        {/* 게시판 + 제목 */}
        <div className="top-row">
          <div className="form-group">
            <label>게시판 선택:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>제목:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
            />
          </div>
        </div>

        {/* 사진 + 평가 항목 */}
        <div className="middle-row">
          <div className="form-group">
            <label>사진 추가:</label>
            <div className="review-image-upload">
              <label>
                {image ? <img src={image} alt="첨부 이미지" /> : "이미지 선택"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>

          <div className="form-group">
            <label>평가 항목 선택:</label>
            {ratings.map((item, index) => (
              <div key={index} className="form-group rating-group-with-remove">
                <div className="rating-select-wrap">
                  <select
                    value={item.aspect}
                    onChange={(e) => handleAspectChange(index, e.target.value)}
                  >
                    {ratingAspects.map((aspect) => (
                      <option key={aspect} value={aspect}>
                        {aspect}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="remove-rating-btn"
                    onClick={() => handleRemoveRatingField(index)}
                    disabled={ratings.length === 1}
                  >
                    ×
                  </button>
                </div>
                <p>{item.aspect}에 대한 별점을 선택해주세요.</p>
                <StarRating
                  rating={item.score}
                  setRating={(score) => handleRatingChange(index, score)}
                />
              </div>
            ))}
            <button
              type="button"
              className="add-rating-btn"
              onClick={handleAddRatingField}
            >
              + 항목 추가
            </button>
          </div>
        </div>

        {/* 내용 */}
        <div className="form-group full-width">
          <label>내용:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="review-submit">
          <button type="submit" onClick={handleSubmit}>
            {category}에 작성 완료
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
