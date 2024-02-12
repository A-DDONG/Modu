import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import logo from "./assets/images/logo.png";
import homeIcon from "./assets/images/home.png";

function Header() {
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // 로그아웃 팝업 상태
  const [popupVisible, setPopupVisible] = useState(false);

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

  // const handleLogout = () => {
  //   auth
  //     .signOut()
  //     .then(() => {
  //       navigate("/login");
  //     })
  //     .catch((error) => {
  //       console.error("로그아웃 실패:", error);
  //     });
  // };
  // const handleLogoutClick = () => {
  //   setShowLogoutPopup(true); // 로그아웃 팝업 표시
  // };

  const handleLogoutConfirm = () => {
    auth
      .signOut()
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error("로그아웃 실패:", error);
      });
    setShowLogoutPopup(false); // 팝업 닫기
  };

  // 팝업숨김
  const closePopup = () => {
    // fadeOut 애니메이션 시작
    setShowLogoutPopup(false);

    // 애니메이션 지속 시간 이후에 팝업 요소를 완전히 숨김
    setTimeout(() => {
      setPopupVisible(false);
    }, 500); // 애니메이션 지속 시간과 일치
  };

  // 팝업을 표시하는 함수
  const openPopup = () => {
    setPopupVisible(true);
    setShowLogoutPopup(true);
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
          <li className="logout" onClick={openPopup}>
            <a>로그아웃</a>
          </li>
        )}
      </ul>
      {popupVisible && (
        <div className={`layer_wrap ${!showLogoutPopup ? "fadeOut" : ""}`}>
          <div className="layerpop">
            <p className="pop_text">로그아웃 하시겠습니까?</p>
            <p className="pop_btn">
              <button onClick={handleLogoutConfirm}>확인</button>
              <button id="closePopup" onClick={closePopup}>
                취소
              </button>
            </p>
          </div>
        </div>
      )}

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
