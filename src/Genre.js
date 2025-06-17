// Genre.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Genre.css";

function Genre() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const genres = [
    { name: "액션", description: "짜릿한 액션 영화들을 만나보세요!" },
    {
      name: "코미디",
      description: "유쾌한 코미디 영화들로 웃음을 찾아보세요!",
    },
    { name: "로맨스", description: "가슴 설레는 로맨스 영화들을 경험하세요!" },
    { name: "스릴러", description: "소름 끼치는 스릴러 영화를 감상해보세요!" },
    {
      name: "드라마",
      description: "감동적인 드라마 영화로 마음을 채워보세요!",
    },
    { name: "SF", description: "미래를 그린 SF 영화를 즐겨보세요!" },
    {
      name: "판타지",
      description: "상상 속 세계를 그린 판타지 영화를 만나보세요!",
    },
    { name: "공포", description: "오싹한 공포 영화를 체험해보세요!" },
    { name: "모험", description: "흥미진진한 모험 영화로 떠나보세요!" },
    {
      name: "뮤지컬",
      description: "아름다운 음악과 함께하는 뮤지컬 영화를 감상하세요!",
    },
    {
      name: "전쟁",
      description: "역사의 한 장면을 그린 전쟁 영화를 만나보세요!",
    },
    { name: "범죄", description: "긴장감 넘치는 범죄 영화를 즐겨보세요!" },
    {
      name: "애니메이션",
      description: "다양한 스토리를 담은 애니메이션 영화를 감상하세요!",
    },
    { name: "역사", description: "역사를 생생히 그린 영화들을 만나보세요!" },
    {
      name: "다큐멘터리",
      description: "현실을 바탕으로 한 다큐멘터리 영화를 감상하세요!",
    },
    {
      name: "가족",
      description: "온 가족이 함께 즐길 수 있는 영화를 만나보세요!",
    },
    { name: "스포츠", description: "짜릿한 스포츠 영화를 경험해보세요!" },
    { name: "서부", description: "황야의 이야기 서부 영화를 즐겨보세요!" },
    {
      name: "음악",
      description: "음악이 중심이 되는 특별한 영화를 감상하세요!",
    },
    {
      name: "미스터리",
      description: "궁금증을 자아내는 미스터리 영화를 즐겨보세요!",
    },
  ];

  return (
    <div>
      <header>
        <h1>MRS</h1>
        <button className="menu-button" onClick={toggleMenu}>
          메뉴
        </button>
      </header>

      <div className={`side-menu ${isMenuOpen ? "open" : ""}`}>
        <ul>
          <li>
            <Link to="/Main">홈으로</Link>
          </li>
          <li>
            <Link to="/Login">로그인</Link>
          </li>
          <li>
            <Link to="/Community">커뮤니티</Link>
          </li>
          <li>
            <Link to="/Profile">프로필</Link>
          </li>
        </ul>
      </div>
      <div
        className={`overlay ${isMenuOpen ? "open" : ""}`}
        onClick={toggleMenu}
      />

      <div className="container">
        {genres.map((genre, index) => (
          <div className="genre-card" key={index}>
            <h3>{genre.name}</h3>
            <p>{genre.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Genre;
