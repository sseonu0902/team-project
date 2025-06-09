import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "./UserContext";
import Main from "./Main";
import Login from "./Login";
import Genre from "./Genre";
import LoginMain from "./LoginMain";
import CreatePost from "./CreatePost";
import Register from "./Register";
import Profile from "./Profile";
import EditProfile from "./EditProfile";
import OTTMR from "./OTTMR";
import MR from "./MR";
import { PostsProvider } from "./PostsContext";
import PostDetail from "./PostDetail";
import FreeBoard from "./FreeBoard";
import CustomerSupport from "./CustomerSupport";
import MileageHistory from "./MileageHistory"; // ✅ 컴포넌트 import
import PostUser from "./PostUser"; // ✅ 추가된 컴포넌트 import
import "./MileageHistory.css"; // ✅ CSS 파일 import

function App() {
  return (
    <PostsProvider>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/main" element={<Main />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/genre" element={<Genre />} />
            <Route path="/loginmain" element={<LoginMain />} />
            <Route path="/createPost" element={<CreatePost />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/update-profile" element={<EditProfile />} />
            <Route path="/ottmr" element={<OTTMR />} />
            <Route path="/mr" element={<MR />} />
            <Route path="/freeboard" element={<FreeBoard />} />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/customersupport" element={<CustomerSupport />} />
            <Route path="/MileageHistory" element={<MileageHistory />} />
            <Route path="/PostUser" element={<PostUser />} />{" "}
            {/* ✅ 추가된 경로 */}
          </Routes>
        </Router>
      </UserProvider>
    </PostsProvider>
  );
}

export default App;
