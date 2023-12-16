import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "./firebaseConfig"; // db를 가져옴
import { doc, getDoc } from "firebase/firestore";
import logo from "./assets/images/logo.png";
import homeIcon from "./assets/images/home.png"; // 홈 아이콘 이미지

function Header() {
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.currentUser) {
      // Firestore에서 닉네임 가져오기
      const docRef = doc(db, "users", auth.currentUser.uid);
      getDoc(docRef).then((docSnap) => {
        if (docSnap.exists()) {
          setDisplayName(docSnap.data().nickname || auth.currentUser.email);
        }
      });
    }
  }, [auth.currentUser]);

  const handleLogout = () => {
    auth
      .signOut()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("로그아웃 실패:", error);
      });
  };

  return (
    <div id="header">
      <ul className="login_wrap">
        <li className="home">
          <Link to="/">
            <img src={homeIcon} alt="홈" />
          </Link>
        </li>
        {!auth.currentUser ? (
          <li className="login">
            <Link to="/login">로그인</Link>
          </li>
        ) : (
          <li className="logout" onClick={handleLogout}>
            <a href="#">로그아웃</a>
          </li>
        )}
      </ul>
      {auth.currentUser && (
        <p className="top_name">
          <span>{displayName}</span>님 안녕하세요!
        </p>
      )}
      <img src={logo} alt="모두의 게시판 로고" />
    </div>
  );
}

export default Header;
