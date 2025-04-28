import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./UserContext";
import { PostsProvider } from './PostsContext';

// 페이지 컴포넌트들
import Main from "./Main";
import Login from "./Login";
import Register from "./Register";
import LoginMain from "./LoginMain";
import Profile from "./Profile";
import EditProfile from "./EditProfile";
import CreatePost from "./CreatePost";
import PostDetail from './PostDetail';

// 게시판 관련 컴포넌트
import MR from "./MR";
import OTTMR from "./OTTMR";
import FreeBoard from './FreeBoard';

// 추가 예정인 페이지들을 위한 임시 컴포넌트
const ComingSoon = () => (
  <div style={{ padding: '50px', textAlign: 'center' }}>
    <h2>준비 중입니다</h2>
    <p>해당 페이지는 현재 개발 중입니다.</p>
  </div>
);

function App() {
  return (
    <PostsProvider>
      <UserProvider>
        <Router>
          <Routes>
            {/* 메인 페이지 */}
            <Route path="/" element={<Main />} />
            <Route path="/main" element={<Main />} />
            <Route path="/loginmain" element={<LoginMain />} />

            {/* 인증 관련 */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/edit-profile" element={<EditProfile />} />

            {/* 게시판 */}
            <Route path="/mr" element={<MR />} />
            <Route path="/ottmr" element={<OTTMR />} />
            <Route path="/freeboard" element={<FreeBoard />} />
            <Route path="/createPost" element={<CreatePost />} />
            <Route path="/posts/:id" element={<PostDetail />} />

            {/* 핫이슈 */}
            <Route path="/hot-issues" element={<ComingSoon />} />
            <Route path="/top10" element={<ComingSoon />} />
            <Route path="/news" element={<ComingSoon />} />

            {/* 상영 예정작 */}
            <Route path="/upcoming" element={<ComingSoon />} />
            <Route path="/upcoming/theater" element={<ComingSoon />} />
            <Route path="/upcoming/ott" element={<ComingSoon />} />

            {/* OTT 관련 */}
            <Route path="/ott" element={<ComingSoon />} />
            <Route path="/ott/netflix" element={<ComingSoon />} />
            <Route path="/ott/tving" element={<ComingSoon />} />
            <Route path="/ott/watcha" element={<ComingSoon />} />
            <Route path="/ott/coupang" element={<ComingSoon />} />
            <Route path="/ott/wave" element={<ComingSoon />} />
            <Route path="/ott/laftel" element={<ComingSoon />} />

            {/* 영화관 */}
            <Route path="/theaters" element={<ComingSoon />} />
            <Route path="/theaters/cgv" element={<ComingSoon />} />
            <Route path="/theaters/lotte" element={<ComingSoon />} />
            <Route path="/theaters/megabox" element={<ComingSoon />} />

            {/* 고객센터 */}
            <Route path="/support" element={<ComingSoon />} />
          </Routes>
        </Router>
      </UserProvider>
    </PostsProvider>
  );
}

export default App;
