import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import axios from "axios";
import "./CreatePost.css";

const categories = ["자유게시판", "현재 상영 영화 게시판", "OTT 영화 게시판"];
const ratingAspects = ["스토리", "배우(캐릭터)", "음악(OST)", "몰입도", "연출"];

const ratingTypeMap = {
  스토리: 1,
  "배우(캐릭터)": 2,
  "음악(OST)": 3,
  몰입도: 4,
  연출: 5,
};

const StarRating = ({ rating, setRating }) => (
  <div className="star-rating">
    {[1, 2, 3, 4, 5].map((n) => (
      <FaStar
        key={n}
        size={30}
        onClick={() => setRating(n)}
        color={n <= rating ? "#ffc107" : "#e4e5e9"}
        style={{ cursor: "pointer" }}
      />
    ))}
  </div>
);

const CreatePost = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [category, setCategory] = useState(categories[1]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [ratings, setRatings] = useState([
    { aspect: ratingAspects[0], score: 0 },
  ]);
  const [nickname, setNickname] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      if (parsed.nickname) setNickname(parsed.nickname);
    }
    if (!loggedIn) navigate("/login");
  }, [navigate]);

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
    const avgRating =
      ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length;

    const newPost = {
      movie_id: null,
      nickname: user.nickname,
      category,
      title,
      content,
      image,
      rating: parseFloat(avgRating.toFixed(1)),
      ratings: ratings.map((r) => ({
        rating_type_id: ratingTypeMap[r.aspect],
        score: r.score,
      })),
    };

    try {
      await axios.post("http://localhost:4000/api/review", newPost);
      alert("리뷰가 성공적으로 등록되었습니다.");
      navigate("/MR");
    } catch (error) {
      console.error("등록 실패:", error);
      alert("리뷰 등록에 실패했습니다.");
    }
  };

  return (
    <div>
      <header>
        <h1>MRS</h1>
        <div className="search-container">
          <input className="search-input" placeholder="검색어를 입력하세요." />
          <button className="search-button">검색</button>
        </div>
        {isLoggedIn && nickname && (
          <div className="user-info">
            <img
              src={user?.profileImage || "/images/BasicProfile.png"}
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
            <button className="logout-btn" onClick={() => navigate("/logout")}>
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
            <a href="OTTComingSoon  ">OTT 상영 예정작</a>
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

      <div className="review-container">
        <h2>리뷰 작성</h2>

        <div className="top-row">
          <div className="form-group">
            <label>게시판 선택:</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
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

        <div className="middle-row">
          <div className="form-group full-width">
            <label>내용:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>사진 추가:</label>
            <div className="review-image-upload">
              <label>
                {image ? (
                  <img src={image} alt="첨부 이미지" />
                ) : (
                  <span>사진 추가</span>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div className="ratings-bottom">
              <label>평가 항목 선택:</label>
              {ratings.map((item, index) => (
                <div key={index} className="rating-group-with-remove">
                  <div className="rating-select-wrap">
                    <select
                      value={item.aspect}
                      onChange={(e) =>
                        handleAspectChange(index, e.target.value)
                      }
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
