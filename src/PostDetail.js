import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getFirestore,
  doc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  collection,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./css/layout.css";

function PostDetail() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [currentUserUid, setCurrentUserUid] = useState(null); // 현재 사용자의 UID 저장
  const [currentUserNickname, setCurrentUserNickname] = useState(null);
  const { postId } = useParams(); // URL에서 postId 파라미터 가져오기
  const db = getFirestore();
  const auth = getAuth();
  const navigate = useNavigate();
  const [editingCommentId, setEditingCommentId] = useState(null); // 수정 중인 댓글의 ID
  const [editingCommentText, setEditingCommentText] = useState(""); // 수정 중인 댓글의 텍스트

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUserUid(user.uid); // 현재 로그인한 사용자의 UID 저장
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setCurrentUserNickname(userDocSnap.data().nickname); // 현재 사용자의 닉네임 저장
        }
      } else {
        setCurrentUserUid(null);
        setCurrentUserNickname(null);
      }
    });

    const fetchPost = async () => {
      // 게시글 불러오기
      const docRef = doc(db, "posts", postId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setPost(docSnap.data());
      } else {
        console.log("No such document!");
      }
    };

    const fetchComments = async () => {
      // 댓글 불러오기
      const querySnapshot = await getDocs(
        collection(db, "posts", postId, "comments")
      );
      const fetchedComments = [];
      querySnapshot.forEach((doc) => {
        fetchedComments.push(doc.data());
      });
      setComments(fetchedComments);
    };

    fetchPost();
    fetchComments();
  }, [postId, db, auth]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    const commentData = {
      text: newComment,
      createdAt: new Date(),
      author: currentUserNickname || "익명",
    };
    await addDoc(collection(db, "posts", postId, "comments"), commentData);
    setComments([...comments, commentData]);
    setNewComment("");
  };

  const handlePostDelete = async () => {
    const confirmDelete = window.confirm("게시글을 삭제하시겠습니까?");
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, "posts", postId));
        navigate("/");
      } catch (error) {
        console.error("게시글 삭제 실패:", error);
      }
    }
  };

  const handlePostEdit = () => {
    navigate(`/edit/${postId}`); // 게시글 수정 페이지로 이동
  };

  // 댓글 수정 시작
  const startEditComment = (commentId, currentText) => {
    setEditingCommentId(commentId);
    setEditingCommentText(currentText);
  };

  // 댓글 수정 완료
  const finishEditComment = async (commentId) => {
    setEditingCommentId(null);
  };

  // 댓글 삭제
  const deleteComment = async (commentId) => {};

  if (!post) return <div>Loading...</div>;

  return (
    <div className="watch_page">
      <div className="watch_title">
        <h3>{post.title}</h3>
        <div className="title_info">
          <p>
            <span>작성자: </span>
            <span>{post.author}</span>
          </p>
          <p>
            <span id="currentDate">
              {new Date(post.createdAt.toDate()).toLocaleDateString()}
            </span>
          </p>
        </div>
      </div>
      <div className="watch_text">
        {post.image && <img src={post.image} alt="Post" />}
        {post.content}
      </div>
      {currentUserUid === post.authorUid && (
        <div className="btn_wrap" style={{ marginTop: "30px" }}>
          <button
            className="cancel"
            style={{ width: "48%" }}
            onClick={handlePostEdit}
          >
            수정
          </button>
          <button
            className="save"
            style={{ width: "48%" }}
            onClick={handlePostDelete}
          >
            삭제하기
          </button>
        </div>
      )}
      {/* 댓글 영역 */}
      <div className="comment">
        <ul>
          {comments.map((comment, index) => (
            <li key={index}>
              <p className="com_text">{comment.text}</p>
              <p className="com_name">{comment.author}</p>
              {currentUserUid === comment.authorUid && (
                <div>
                  <button
                    onClick={() => startEditComment(comment.id, comment.text)}
                  >
                    수정
                  </button>
                  <button onClick={() => deleteComment(comment.id)}>
                    삭제
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
        <div className="comment_self">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button onClick={handleCommentSubmit}>등록</button>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
