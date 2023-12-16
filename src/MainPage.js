import React, { useEffect, useState } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { auth } from "./firebaseConfig";
import "./css/layout.css"; // 가정된 CSS 파일 임포트

function MainPage() {
  const [posts, setPosts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("오늘의뉴스");

  const location = useLocation();
  const user = location.state; // 로그인 페이지에서 전달된 사용자 정보

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      const db = getFirestore();
      const q = query(
        collection(db, "posts"),
        where("category", "==", selectedCategory),
        orderBy("createdAt", "desc")
      );

      try {
        const querySnapshot = await getDocs(q);
        const fetchedPosts = [];
        querySnapshot.forEach((doc) => {
          fetchedPosts.push({ id: doc.id, ...doc.data() });
        });
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("게시글 불러오기 실패:", error);
      }
    };

    fetchPosts();
  }, [selectedCategory]);

  return (
    <div id="container">
      <div className="main">
        <div className="board_menu">
          <ul>
            {["오늘의뉴스", "일상생활", "맛집추천"].map((cat) => (
              <li
                key={cat}
                className={selectedCategory === cat ? "on" : ""}
                onClick={() => setSelectedCategory(cat)}
              >
                <a href="#">{cat}</a>
              </li>
            ))}
          </ul>
        </div>
        <div className="title">
          <h3>{selectedCategory}</h3>
          <p>모두와 {selectedCategory}에 대해 이야기 해보세요!</p>
        </div>

        <table className="board_wrap">
          <colgroup>
            <col style={{ width: "15%" }} />
            <col style={{ width: "auto" }} />
            <col style={{ width: "25%" }} />
          </colgroup>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>글쓴이</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post, index) => (
              <tr key={post.id}>
                <td>{posts.length - index}</td>
                <td>
                  <Link to={`/posts/${post.id}`}>{post.title}</Link>
                </td>
                <td>{post.author || "익명"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="main_btn">
          <Link to="/write">
            <button>글쓰기</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
