import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import Navigation from './Navigation';
import './EditProfile.css';

const API_BASE_URL = 'http://localhost:4000';

function EditProfile() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [point, setPoint] = useState(0);
  const [mileage, setMileage] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    setIsLoggedIn(true);
    fetchUserData(token);
  }, [navigate]);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/user`, {
        headers: { Authorization: token }
      });
      const userData = response.data;
      setNickname(userData.nickname || '');
      setEmail(userData.email || '');
      setAge(userData.age || '');
      setGender(userData.gender || '');
      setPoint(userData.point || 0);
      setMileage(userData.mileage || 0);
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('사용자 정보를 불러오는데 실패했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    try {
      await axios.put(`${API_BASE_URL}/api/user`, {
        nickname,
        age,
        gender
      }, {
        headers: { Authorization: token }
      });
      
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('프로필 업데이트에 실패했습니다.');
    }
  };

  return (
    <div>
      <Header isLoggedIn={isLoggedIn} />
      <Navigation />
      <div className="edit-profile-container">
        <h2 className="edit-profile-title">프로필 수정</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nickname">닉네임</label>
            <input
              type="text"
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              value={email}
              className="readonly-field"
              readOnly
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="age">나이</label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="gender">성별</label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">선택하세요</option>
              <option value="male">남성</option>
              <option value="female">여성</option>
            </select>
          </div>

          {error && <p className="error-message">{error}</p>}
          
          <div className="button-group">
            <button type="submit" className="save-button">저장</button>
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate('/profile')}
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile; 