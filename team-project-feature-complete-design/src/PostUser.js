import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PostUser.css";
import { setupPostUserLogic } from "./postUserLogic";

function PostUser() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [posts, setPosts] = useState([]); // 🔹 게시물 목록

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

        // 🔹 게시물 불러오기
        fetch(`http://localhost:4000/api/review/user/${userData.user_id}`)
          .then((res) => res.json())
          .then((data) => setPosts(data))
          .catch((err) => console.error("게시물 불러오기 실패:", err));
      } catch (e) {
        console.warn("⚠ 사용자 정보 파싱 실패:", e);
      }
    }
  }, []);

  const handleDelete = async (reviewId) => {
  if (!window.confirm("정말로 이 게시글을 삭제하시겠습니까?")) return;

  try {
    await fetch(`http://localhost:4000/api/review/${reviewId}`, {
      method: "DELETE",
    });
    // 삭제 후 목록 갱신
    setPosts((prev) => prev.filter((post) => post.review_id !== reviewId));
    alert("삭제가 완료되었습니다.");
  } catch (error) {
    console.error("게시물 삭제 실패:", error);
    alert("삭제 중 오류가 발생했습니다.");
  }
};

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
            {posts.map((post, index) => (
              <tr key={post.review_id}>
                <td>{index + 1}</td>
                <td
                  style={{ color: "#007bff", cursor: "pointer" }}
                  onClick={() => navigate(`/posts/${post.review_id}`)} // 상세보기로 이동
                >
                  {post.title}
                </td>
                <td>{new Date(post.created_date).toLocaleDateString("ko-KR")}</td>
                <td>{post.views}</td>
                <td>
                  <button
                    className="postuser-btn postuser-btn-edit"
                    onClick={() => navigate(`/edit/${post.review_id}`)} // 수정으로 이동
                  >
                    수정
                  </button>
                  <button
                    className="postuser-btn postuser-btn-delete"
                    onClick={() => handleDelete(post.review_id)} // 삭제도 연결 가능
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* 하단 버튼 그룹 */}
        <div className="postuser-btn-group">
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
