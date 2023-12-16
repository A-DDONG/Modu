import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import biglogo from "./assets/images/logo_big.png";
import naverLogo from "./assets/images/naver.png";
import kakaoLogo from "./assets/images/kakao.png";
import googleLogo from "./assets/images/google.png";
import { signInWithGooglePopup } from "./firebaseConfig";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      alert("아이디와 비밀번호를 모두 입력해주세요.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const firestore = getFirestore();
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
      const nickname = userDoc.data()?.nickname || user.email;

      navigate("/", { state: { email: user.email, displayName: nickname } });
    } catch (error) {
      console.error(error);

      switch (error.code) {
        case "auth/invalid-email":
          alert("잘못된 이메일 형식입니다.");
          break;
        case "auth/user-not-found":
          alert("존재하지 않는 이메일입니다.");
          break;
        case "auth/wrong-password":
          alert("잘못된 비밀번호입니다.");
          break;
        default:
          alert("로그인에 실패했습니다.");
          break;
      }
    }
  };

  const handleSignUp = () => {
    navigate("/signup"); // 회원가입 페이지로 이동
  };
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithGooglePopup();
      const { displayName, email, uid } = result.user;
      // 필요한 정보만 state로 전달
      navigate("/", { state: { displayName, email, uid } });
    } catch (error) {
      console.error(error);
      alert("로그인에 실패했습니다.");
    }
  };

  return (
    <div id="container_login">
      <h4>
        <img src={biglogo} alt="모두의게시판 로고" />
      </h4>

      <ul className="login_input">
        <li>
          <input
            type="text"
            placeholder="아이디"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </li>
        <li>
          <input
            type="password"
            placeholder="비밀번호"
            name="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </li>
      </ul>

      <p className="login_fail" style={{ display: "none" }}>
        입력하신 정보의 계정이 없습니다
      </p>

      <div className="btn_wrap">
        <button
          className="login"
          style={{ width: "100%" }}
          onClick={handleLogin}
        >
          로 그 인
        </button>
      </div>

      <ul className="login_search">
        <li>아이디 찾기</li>
        <li>비밀번호 찾기</li>
        <li onClick={handleSignUp}>회원가입</li>
      </ul>

      <ul className="login_more">
        <li>
          <button>
            <img src={naverLogo} alt="네이버로 시작하기" />
          </button>
        </li>
        <li>
          <button>
            <img src={kakaoLogo} alt="카카오로 시작하기" />
          </button>
        </li>
        <li>
          <button onClick={handleGoogleLogin}>
            <img src={googleLogo} alt="구글로 시작하기" />
          </button>
        </li>
      </ul>
    </div>
  );
}

export default Login;
