import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./UserContext";
import Main from "./Main";
import Login from "./Login";
import Genre from "./Genre";
import LoginMain from "./LoginMain"; // LoginMain 컴포넌트 추가
import CreatePost from "./CreatePost";
import Register from "./Register";
import Profile from "./Profile";
import EditProfile from "./EditProfile";
import OTTMR from "./OTTMR";
import MR from "./MR";
import { PostsProvider } from "./PostsContext";
import PostDetail from "./PostDetail";
import FreeBoard from "./FreeBoard";
import CustomerSupport from "./CustomerSupport"; // 추가

function App() {
  return (
    <PostsProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/main" element={<Main />} />
            <Route path="/login" element={<Login />} /> {/* 소문자로 변경 */}
            <Route path="/register" element={<Register />} />
            {/* 소문자로 변경 */}
            <Route path="/genre" element={<Genre />} /> {/* 소문자로 변경 */}
            <Route path="/loginmain" element={<LoginMain />} />{" "}
            <Route path="/createPost" element={<CreatePost />} />{" "}
            <Route path="/profile" element={<Profile />} />{" "}
            <Route path="/update-profile" element={<EditProfile />} />
            <Route path="/ottmr" element={<OTTMR />} />
            {/* LoginMain 라우트 추가 */}
            <Route path="/mr" element={<MR />} />
            <Route path="/freeboard" element={<FreeBoard />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/customersupport" element={<CustomerSupport />} />
          </Routes>
        </Router>
      </UserProvider>
    </PostsProvider>
  );
}

export default App;
