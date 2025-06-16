import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./UserContext";
import { PostsProvider } from "./PostsContext";

// 주요 페이지 컴포넌트 import
import Main from "./Main";
import Login from "./Login";
import Register from "./Register";
import Genre from "./Genre";
import LoginMain from "./LoginMain";
import CreatePost from "./CreatePost";
import Profile from "./Profile";
import EditProfile from "./EditProfile";
import OTTMR from "./OTTMR";
import MR from "./MR";
import FreeBoard from "./FreeBoard";
import PostDetail from "./PostDetail";
import CustomerSupport from "./CustomerSupport";
import MileageHistory from "./MileageHistory";
import PostUser from "./PostUser";
import OTTComingSoon from "./OTTComingSoon";
import TheaterComingSoon from "./TheaterComingSoon"; // ✅ 정확한 이름 확인

// CSS
import "./MileageHistory.css";

function App() {
  return (
    <PostsProvider>
      <UserProvider>
        <Router>
          <Routes>
            {/* 기본 경로 */}
            <Route path="/" element={<Main />} />
            <Route path="/main" element={<Main />} />

            {/* 로그인/회원가입 */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 로그인 후 메인 */}
            <Route path="/loginmain" element={<LoginMain />} />

            {/* 장르, 마이페이지, 글쓰기 */}
            <Route path="/genre" element={<Genre />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/update-profile" element={<EditProfile />} />
            <Route path="/createPost" element={<CreatePost />} />

            {/* 리뷰 게시판 */}
            <Route path="/mr" element={<MR />} />
            <Route path="/ottmr" element={<OTTMR />} />
            <Route path="/freeboard" element={<FreeBoard />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/edit/:id" element={<CreatePost />} />
            
            {/* 고객센터/마일리지/내 포스트 */}
            <Route path="/customersupport" element={<CustomerSupport />} />
            <Route path="/mileagehistory" element={<MileageHistory />} />
            <Route path="/postuser" element={<PostUser />} />

            {/* ✅ 상영 예정작 페이지 경로 */}
            <Route path="/OTTComingSoon" element={<OTTComingSoon />} />
            <Route path="/TheaterComingSoon" element={<TheaterComingSoon />} />
          </Routes>
        </Router>
      </UserProvider>
    </PostsProvider>
  );
}

export default App;
