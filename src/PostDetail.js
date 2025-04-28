import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import "./PostDetail.css";
import { Link } from "react-router-dom";


ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

function PostDetail() {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(`http://localhost:4000/api/review/${id}`);
        setPost(res.data);
        await axios.post(`http://localhost:4000/api/review/${id}/views`);
        const commentRes = await axios.get(`http://localhost:4000/api/review/${id}/comments`);
        setComments(commentRes.data);
      } catch (err) {
        console.error("상세 조회 실패:", err);
      }
    };
    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      await axios.post(`http://localhost:4000/api/review/${id}/comments`, {
        content: newComment,
        userId: user.user_id,
      });
      const updated = await axios.get(`http://localhost:4000/api/review/${id}/comments`);
      setComments(updated.data);
      setNewComment("");
    } catch (err) {
      console.error("댓글 작성 실패:", err);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getRatingChartData = (ratings) => {
    const colors = [
      "#4dabf7", // blue
      "#ff6b6b", // red
      "#51cf66", // green
      "#ffd43b", // yellow
      "#845ef7", // purple
    ];
  
    return {
      labels: ratings.map((r) => r.aspect),
      datasets: [
        {
          label: "평점",
          data: ratings.map((r) => r.score),
          backgroundColor: colors.slice(0, ratings.length),
        },
      ],
    };
  };
  

  return (
    <div>
      <header>
        <h1>MRS</h1>
        <div className="search-container">
          <input className="search-input" placeholder="검색어를 입력하세요." />
          <button className="search-button">검색</button>
        </div>
        {!user ? (
          <>
            <button className="login-btn" onClick={() => navigate("/login")}>로그인</button>
            <button className="register-btn" onClick={() => navigate("/register")}>회원가입</button>
          </>
        ) : (
          <>
            <p className="user-nickname">{user.nickname}님</p>
            <button className="logout-btn" onClick={logout}>로그아웃</button>
          </>
        )}
      </header>

      <nav>
  <Link to={user ? "/LoginMain" : "/Main"}>홈</Link>
  <div className="dropdown">
    <Link to="/MR">리뷰게시판</Link>
    <div className="dropdown-content">
      <Link to="/MR">영화 리뷰 게시판</Link>
      <Link to="/OTTMR">OTT 게시판</Link>
      <Link to="/FreeBoard">자유 게시판</Link>
    </div>
  </div>
  <div className="dropdown">
    <Link to="/genre">핫 이슈</Link>
    <div className="dropdown-content">
      <Link to="#">TOP10 영화</Link>
      <Link to="#">영화 뉴스</Link>
    </div>
  </div>
  <div className="dropdown">
    <Link to="/community">상영 예정작</Link>
    <div className="dropdown-content">
      <Link to="#">영화관 상영 예정작</Link>
      <Link to="#">OTT 상영 예정작</Link>
    </div>
  </div>
  <div className="dropdown">
    <Link to="/profile">OTT관</Link>
    <div className="dropdown-content">
      <Link to="#">넷플릭스</Link>
      <Link to="#">티빙</Link>
      <Link to="#">왓챠</Link>
      <Link to="#">쿠팡플레이</Link>
      <Link to="#">웨이브</Link>
      <Link to="#">라프텔</Link>
    </div>
  </div>
  <div className="dropdown">
    <Link to="/contact">영화관</Link>
    <div className="dropdown-content">
      <Link to="#">CGV</Link>
      <Link to="#">롯데시네마</Link>
      <Link to="#">메가박스</Link>
    </div>
  </div>
  <Link to="*">고객센터</Link>
</nav>


      <div className="main-layout">
        <aside className="sidebar">
          <ul>
            <li className="disabled">영화 커뮤니티</li>
            <li>OTT 영화 커뮤니티</li>
            <li>자유게시판</li>
          </ul>
        </aside>

        <main className="main-content">
          <div className="board-header">
            <h3>게시물 상세보기</h3>
            <button className="write-button" onClick={() => navigate('/CreatePost')}>글쓰기</button>
          </div>

          {!post ? (
            <p>로딩 중...</p>
          ) : (
            <div style={{ border: "1px solid #ccc", padding: "20px", borderRadius: "10px", background: "#f9f9f9" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "30px" }}>
                <div style={{ flex: 1 }}>
                  <h2>{post.title}</h2>
                  <p><strong>작성자:</strong> {post.nickname}</p>
                  <p><strong>작성일:</strong> {formatDate(post.created_date)}</p>
                  <p><strong>조회수:</strong> {post.views}</p>
                  <p><strong>평균평점:</strong> {Number(post.rating).toFixed(1)}</p>

                  {post.ratings && post.ratings.length > 0 && (
                    <div style={{ maxWidth: "400px", marginTop: "20px" }}>
                      <h4>항목별 평점</h4>
                      <Bar
                        data={getRatingChartData(post.ratings)}
                        options={{
                          scales: {
                            y: { beginAtZero: true, max: 5 },
                          },
                          plugins: {
                            legend: { display: false },
                          },
                        }}
                      />
                    </div>
                  )}
                </div>
                {post.image && (
                  <div style={{ flexShrink: 0 }}>
                    <img src={post.image} alt="포스터" style={{ width: "200px", borderRadius: "5px" }} />
                  </div>
                )}
              </div>

              <div style={{ marginTop: "40px" }}>
                <h4 style={{ marginBottom: "10px", color: "#444", fontWeight: "bold", borderBottom: "1px solid #eee", paddingBottom: "5px" }}>
                  리뷰 내용
                </h4>
                <p style={{
                  whiteSpace: "pre-line",
                  lineHeight: "1.7",
                  fontSize: "16px",
                  color: "#333",
                  backgroundColor: "#fafafa",
                  padding: "15px 20px",
                  borderRadius: "6px",
                  boxShadow: "inset 0 0 4px rgba(0,0,0,0.05)"
                }}>
                  {post.content}
                </p>
              </div>


              <hr style={{ margin: "30px 0" }} />
              <section>
                <h3>댓글</h3>
                {comments.length === 0 ? (
                  <p>아직 댓글이 없습니다.</p>
                ) : (
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {comments.map((comment) => (
                      <li key={comment.comment_id} style={{ background: "#fff", padding: "10px", border: "1px solid #ddd", borderRadius: "5px", marginBottom: "10px" }}>
                        <strong>{comment.nickname}</strong> ({formatDate(comment.created_date)})
                        <p style={{ marginTop: "5px" }}>{comment.content}</p>
                      </li>
                    ))}
                  </ul>
                )}
                {user ? (
                  <form onSubmit={handleCommentSubmit} style={{ marginTop: "20px" }}>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      rows={4}
                      placeholder="댓글을 입력하세요..."
                      style={{ width: "100%", padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
                    />
                    <button type="submit" className="write-button" style={{ marginTop: "10px" }}>
                      댓글 작성
                    </button>
                  </form>
                ) : (
                  <p>로그인 후 댓글을 작성할 수 있습니다.</p>
                )}
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default PostDetail;
