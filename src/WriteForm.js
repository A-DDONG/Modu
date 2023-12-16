import React, { useEffect, useState } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
import { auth } from "./firebaseConfig";

function WriteForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("오늘의뉴스"); // 카테고리 상태 추가
  const [isSaving, setIsSaving] = useState(false); // 저장 중 상태 추가
  const [imagePreview, setImagePreview] = useState("");
  const { postId } = useParams(); // URL에서 postId 가져오기
  const [currentUserUid, setCurrentUserUid] = useState(null);
  const [currentUserNickname, setCurrentUserNickname] = useState(null);
  const navigate = useNavigate();
  const db = getFirestore();
  const auth = getAuth();

  // 카테고리 변경 처리 함수
  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = () => {
    setImagePreview("");
  };

  useEffect(() => {
    if (postId) {
      // 수정 모드일 경우 기존 게시글 데이터를 불러옵니다.
      const postRef = doc(db, "posts", postId);
      getDoc(postRef).then((docSnap) => {
        if (docSnap.exists()) {
          const postData = docSnap.data();
          setTitle(postData.title);
          setContent(postData.content);
          setCategory(postData.category);
          // 이미지 처리가 필요하면 여기에 추가
        } else {
          console.log("게시글이 존재하지 않습니다.");
          navigate("/");
        }
      });
    }
  }, [postId, db, navigate]);

  const handleSave = async () => {
    if (isSaving || !title || !content) {
      // 저장 중이거나 필수 필드가 비어있으면 반환
      return;
    }

    setIsSaving(true); // 저장 시작

    try {
      if (postId) {
        // postId가 있는 경우, 기존 게시글을 업데이트합니다.
        const postRef = doc(db, "posts", postId);
        await updateDoc(postRef, {
          title,
          content,
          category,
          image: imagePreview,
          // createdAt는 업데이트 하지 않음
        });
      } else {
        // postId가 없는 경우, 새 게시글을 추가합니다.
        await addDoc(collection(db, "posts"), {
          title,
          content,
          category,
          image: imagePreview,
          createdAt: serverTimestamp(),
          author: currentUserNickname || "익명",
          authorUid: currentUserUid || "익명",
        });
      }
      navigate("/"); // 게시글 저장 또는 수정 후 메인 페이지로 이동
    } catch (error) {
      console.error("글 저장 실패:", error);
    }

    setIsSaving(false); // 저장 완료
  };

  return (
    <div>
      <ul className="write_menu">
        {["오늘의뉴스", "일상생활", "맛집추천"].map((cat) => (
          <li
            key={cat}
            className={category === cat ? "active" : ""}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat}
          </li>
        ))}
      </ul>
      <div className="write_text">
        <p className="title">제목</p>
        <input
          type="text"
          placeholder="제목을 입력해주세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="write_text">
        <p className="title">내용</p>
        <textarea
          name="write_area"
          id="area"
          cols=""
          rows="15"
          placeholder="내용을 입력해주세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>

      <div className="write_img">
        <p>
          <label htmlFor="imageInput">이미지 업로드</label>
          {imagePreview && (
            <span onClick={handleDeleteImage} className="dele">
              이미지 삭제
            </span>
          )}
        </p>
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          onChange={handleImageChange}
        />
        <p>{imagePreview && <img src={imagePreview} alt="Preview" />}</p>
      </div>

      <div className="btn_wrap">
        <button className="cancel" style={{ width: "48%" }}>
          취소
        </button>
        <button
          className="save"
          style={{ width: "48%" }}
          onClick={handleSave}
          disabled={isSaving} // 저장 중일 때 버튼 비활성화
        >
          {isSaving ? "저장 중..." : "저장하기"}
        </button>
      </div>
    </div>
  );
}

export default WriteForm;
