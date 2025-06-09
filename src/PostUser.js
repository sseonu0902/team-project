import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PostUser.css";
import { setupPostUserLogic } from "./postUserLogic";

function PostUser() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    setupPostUserLogic();
    const loginStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loginStatus);
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        if (userData?.nickname) setNickname(userData.nickname);
        if (userData?.profileImage) setProfileImage(userData.profileImage);
      } catch (e) {
        console.warn("⚠ 사용자 정보 파싱 실패:", e);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
    setNickname("");
    navigate("/Main");
  };

  return (
    <div className="postuser-body">
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
            <p className="user-nickname" onClick={() => navigate("/profile")}>
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
          <a href="#">리뷰게시판</a>
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
        <a href="CustomerSupport">고객센터</a>
      </nav>

      <div className="postuser-container">
        <h2>내가 작성한 게시물</h2>

        <div className="postuser-clearfix">
          <input
            type="text"
            id="searchInput"
            className="postuser-search-input"
            placeholder="제목 검색..."
          />
        </div>

        <table id="postTable" className="postuser-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th id="sortDate">작성일 ▲▼</th>
              <th id="sortViews">조회수 ▲▼</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>어벤져스: 엔드게임 리뷰</td>
              <td data-date="2025-06-05">2025년 6월 5일</td>
              <td>153</td>
              <td></td>
            </tr>
            <tr>
              <td>2</td>
              <td>존 윅 4 기대평</td>
              <td data-date="2025-06-01">2025년 6월 1일</td>
              <td>98</td>
              <td></td>
            </tr>
          </tbody>
        </table>

        {/* 하단 버튼 그룹 */}
        <div className="postuser-btn-group">
          <button className="postuser-btn postuser-btn-edit">수정</button>
          <button className="postuser-btn postuser-btn-delete">삭제</button>
          <button
            className="postuser-btn postuser-btn-profile"
            onClick={() => navigate("/profile")}
          >
            프로필
          </button>
        </div>
      </div>
    </div>
  );
}

export default PostUser;
