import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "./EditProfile.css";
import Header from './components/Header';
import Navigation from './components/Navigation';

const API_BASE_URL = 'http://localhost:4000';

function EditProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nickname: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [userInfo, setUserInfo] = useState({
    nickname: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/api/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.data) {
          const userData = response.data.user || response.data;
          setUserInfo(userData);
          setFormData(prev => ({
            ...prev,
            nickname: userData.nickname || ''
          }));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        if (error.response?.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword) {
      if (formData.newPassword !== formData.confirmPassword) {
        setError('새 비밀번호가 일치하지 않습니다.');
        return;
      }
      if (formData.newPassword.length < 6) {
        setError('비밀번호는 최소 6자 이상이어야 합니다.');
        return;
      }
    }

    try {
      const token = localStorage.getItem('token');
      const updateData = {
        nickname: formData.nickname,
        ...(formData.currentPassword && formData.newPassword ? {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        } : {})
      };

      await axios.put(`${API_BASE_URL}/api/user`, updateData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('프로필 수정 중 오류가 발생했습니다.');
      }
    }
  };

  return (
    <div className="edit-profile-page">
      <Header isLoggedIn={true} nickname={userInfo.nickname} />
      <Navigation />
      
      <div className="edit-profile-container">
        <h2>프로필 수정</h2>
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label>닉네임</label>
            <input
              type="text"
              name="nickname"
              value={formData.nickname}
              onChange={handleChange}
              placeholder="새로운 닉네임을 입력하세요"
            />
          </div>

          <div className="password-section">
            <h3>비밀번호 변경</h3>
            <div className="form-group">
              <label>현재 비밀번호</label>
              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="현재 비밀번호를 입력하세요"
              />
            </div>

            <div className="form-group">
              <label>새 비밀번호</label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="새 비밀번호를 입력하세요"
              />
            </div>

            <div className="form-group">
              <label>새 비밀번호 확인</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="새 비밀번호를 다시 입력하세요"
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="button-container">
            <button type="submit" className="save-button">저장</button>
            <button type="button" className="cancel-button" onClick={() => navigate('/profile')}>
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile; 