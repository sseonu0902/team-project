import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CustomerSupport.css";

function CustomerSupport() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const questions = document.querySelectorAll(".custom-faq-question");
    questions.forEach((q) => {
      q.addEventListener("click", () => {
        const answer = q.nextElementSibling;
        if (answer) {
          answer.style.display =
            answer.style.display === "block" ? "none" : "block";
        }
      });
    });

    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        setNickname(userData.nickname || "");
        setProfileImage(userData.profileImage || null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.setItem("isLoggedIn", "false");
    setIsLoggedIn(false);
    navigate("/Main");
  };

  return (
    <div>
      <header>
        <h1 style={{ margin: 0 }}>MRS</h1>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="검색어를 입력하세요."
          />
          <button className="search-button">검색</button>

          {isLoggedIn ? (
            <div className="user-info">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="프로필"
                  className="profile-image"
                />
              ) : (
                <div className="default-profile-circle"></div>
              )}
              <p className="user-nickname" onClick={() => navigate("/profile")}>
                {nickname}님
              </p>
              <button className="logout-btn" onClick={handleLogout}>
                로그아웃
              </button>
            </div>
          ) : (
            <button className="login-btn" onClick={() => navigate("/login")}>
              로그인
            </button>
          )}
        </div>
      </header>

      <nav>
        <a href="/LoginMain">홈</a>
        <div className="dropdown">
          <a href="#">리뷰게시판</a>
          <div className="dropdown-content">
            <a href="/MR">영화 리뷰 게시판</a>
            <a href="/OTTMR">OTT 게시판</a>
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
        <a href="CustomerSupport">고객센터</a>
      </nav>

      <div className="custom-container">
        <section className="custom-faq">
          <h2>자주 묻는 질문 (FAQ)</h2>
          {[
            {
              q: "Q. 비밀번호를 잊어버렸어요.",
              a: "A. 로그인 페이지에서 '비밀번호 찾기'를 클릭하여 안내에 따라 주세요.",
            },
            {
              q: "Q. 닉네임을 변경하고 싶어요.",
              a: "A. 마이페이지에서 닉네임 변경이 가능합니다.",
            },
            {
              q: "Q. 게시물이 삭제되었어요.",
              a: "A. 운영정책 위반 시 관리자에 의해 삭제될 수 있습니다. 자세한 사항은 문의 바랍니다.",
            },
          ].map((item, idx) => (
            <div className="custom-faq-item" key={idx}>
              <div className="custom-faq-question">{item.q}</div>
              <div className="custom-faq-answer" style={{ display: "none" }}>
                {item.a}
              </div>
            </div>
          ))}
        </section>

        <section className="custom-inquiry-history">
          <h2>나의 문의내역</h2>
          <div className="custom-inquiry-list">
            <div className="custom-inquiry-item">
              <div className="custom-inquiry-header">
                <span className="custom-inquiry-date">2024-03-20</span>
                <span className="custom-inquiry-status custom-status-answered">
                  답변완료
                </span>
              </div>
              <div className="custom-inquiry-content">
                <strong>제목: 게시물 삭제 관련 문의</strong>
                <p>게시물이 갑자기 삭제되었는데 이유를 알고 싶습니다.</p>
              </div>
              <div className="custom-inquiry-answer">
                <strong>답변:</strong>
                <p>
                  안녕하세요. 해당 게시물은 커뮤니티 가이드라인 위반으로
                  삭제되었습니다. 자세한 내용은 운영정책을 참고해 주시기
                  바랍니다.
                </p>
              </div>
            </div>

            <div className="custom-inquiry-item">
              <div className="custom-inquiry-header">
                <span className="custom-inquiry-date">2024-03-18</span>
                <span className="custom-inquiry-status custom-status-pending">
                  답변대기
                </span>
              </div>
              <div className="custom-inquiry-content">
                <strong>제목: 프로필 사진 변경 오류</strong>
                <p>프로필 사진을 변경하려고 하는데 계속 오류가 발생합니다.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="custom-contact-form">
          <h2>문의하기</h2>
          <form>
            <label htmlFor="name">이름</label>
            <input type="text" id="name" name="name" required />

            <label htmlFor="email">이메일</label>
            <input type="email" id="email" name="email" required />

            <label htmlFor="message">문의 내용</label>
            <textarea id="message" name="message" rows="5" required></textarea>

            <button type="submit">문의 보내기</button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default CustomerSupport;
