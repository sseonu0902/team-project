import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = (dropdownName) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(dropdownName);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 300); // 300ms 지연 시간
  };

  return (
    <nav className="nav-container">
      <Link to="/" className="nav-item">홈</Link>
      
      <div 
        className="dropdown"
        onMouseEnter={() => handleMouseEnter('review')}
        onMouseLeave={handleMouseLeave}
      >
        <Link to="/review" className="nav-item">리뷰게시판</Link>
        <div className={`dropdown-content ${activeDropdown === 'review' ? 'active' : ''}`}>
          <Link to="/mr">현재 상영 영화</Link>
          <Link to="/ottmr">OTT관</Link>
        </div>
      </div>

      <div 
        className="dropdown"
        onMouseEnter={() => handleMouseEnter('community')}
        onMouseLeave={handleMouseLeave}
      >
        <Link to="/community" className="nav-item">핫 이슈</Link>
        <div className={`dropdown-content ${activeDropdown === 'community' ? 'active' : ''}`}>
          <Link to="/freeboard">자유게시판</Link>
        </div>
      </div>

      <Link to="/sangmyung" className="nav-item">상명 예정작</Link>
      <Link to="/ott" className="nav-item">OTT관</Link>
      <Link to="/english" className="nav-item">영화관</Link>
      <Link to="/customer" className="nav-item">고객센터</Link>
    </nav>
  );
}

export default Navigation; 