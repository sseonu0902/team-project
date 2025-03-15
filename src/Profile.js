import { useState } from "react";
import { Link } from "react-router-dom"; // Link 컴포넌트 import
import "./Profile.css";

function Profile() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div>
      <header>
        <h1>MRS</h1>
        <button className="menu-button" onClick={toggleMenu}>
          메뉴
        </button>
      </header>

      <div className={`side-menu ${menuOpen ? "open" : ""}`}>
        <ul>
          <li><Link to="/LoginMain">홈으로</Link></li> {/* 홈 경로 수정 */}
          <li><Link to="/community">커뮤니티</Link></li>
          <li><Link to="/genre">장르</Link></li>
          <li><Link to="/logout">로그아웃</Link></li> {/* 로그아웃 경로 수정 */}
        </ul>
      </div>

      {menuOpen && <div className="overlay" onClick={toggleMenu}></div>}

      <div className="container">
        <h2>나의 프로필</h2>
        <div className="user-info">
          <h3>이름: John Doe</h3>
          <p>포인트: 120</p>
          <p>마일리지: 300</p>
          <button>프로필 수정</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
