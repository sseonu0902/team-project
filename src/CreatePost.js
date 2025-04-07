import React, { useState, useContext } from "react";
import { UserContext } from "./UserContext";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import axios from 'axios';
import "./CreatePost.css";

const categories = ["자유게시판", "현재 상영 영화 게시판", "OTT 영화 게시판"];

// 별점 컴포넌트
const StarRating = ({ rating, setRating }) => {
  return (
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
};

const CreatePost = () => {
  const { user, logout } = useContext(UserContext);
  const [category, setCategory] = useState(categories[1]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div>
        <h2>로그인 후 게시물을 작성할 수 있습니다.</h2>
        <button onClick={() => navigate("/login")}>로그인</button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newPost = {
      movie_id: null,            // 필요하면 영화 ID 연결
      nickname: user.nickname,   // 닉네임 추가
      rating,
      content,
      title,
      image,
      category,
    };

    console.log(newPost);
    
    try {
      await axios.post('http://localhost:4000/api/review', newPost);
      alert('리뷰가 성공적으로 등록되었습니다.');
      navigate('/MR');
    } catch (error) {
      console.error('리뷰 등록 실패:', error);
      alert('리뷰 등록에 실패했습니다.');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
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
        {!user ? (
          <>
            <button className="login-btn" onClick={() => navigate("/login")}>
              로그인
            </button>
            <button className="register-btn" onClick={() => navigate("/register")}>
              회원가입
            </button>
          </>
        ) : (
          <>
            <p className="user-nickname">{user.nickname}님</p>
            <button className="logout-btn" onClick={logout}>
              로그아웃
            </button>
          </>
        )}
      </header>

      <nav>
        <a href="/main">홈</a>
        <div className="dropdown">
          <a href="*">리뷰게시판</a>
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
        <form onSubmit={handleSubmit} className="review-form-wrapper">
          <div className="review-post-name">
            <label>게시판 선택:</label>
          </div>
          <div className="review-post-select">
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="review-movie-post">
            <label>제목:</label>
          </div>
          <div className="review-movie-title">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
            />
          </div>

          <div className="review-image-upload">
            <label>
              {image ? (
                <img src={image} alt="첨부된 이미지" style={{ width: "100px", height: "auto" }} />
              ) : (
                <span>사진 추가</span>
              )}
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </label>
          </div>

          <div className="review-rating">
            <span className="review-rating-label">평점:</span>
            <p>별점을 선택해주세요.</p>
            <StarRating rating={rating} setRating={setRating} />
          </div>

          <div className="review">
            <label>내용:</label>
          </div>
          <div className="review-story">
            <textarea
              rows="6"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요"
            />
            <button type="submit">{category}에 작성 완료</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
