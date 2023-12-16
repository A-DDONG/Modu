import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import "./css/reset.css";
import "./css/layout.css";
import logo from "./assets/images/logo.png";

function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [showEmailError, setShowEmailError] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [nicknameCheckStatus, setNicknameCheckStatus] = useState(null);
  const [signUpSuccess, setSignUpSuccess] = useState(false); // 회원가입 성공 상태 추가

  const navigate = useNavigate();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const passwordRegex = /^[a-zA-Z0-9!@#$%^&*]{6,20}$/;
  const firestore = getFirestore();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setShowEmailError(!emailRegex.test(e.target.value));
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setShowPasswordError(!passwordRegex.test(e.target.value));
  };

  const checkNicknameUnique = async () => {
    const usersRef = collection(firestore, "users");
    const q = query(usersRef, where("nickname", "==", nickname));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      setNicknameCheckStatus("available");
    } else {
      setNicknameCheckStatus("unavailable");
    }
  };

  const handleSignUp = async () => {
    // 이용약관 동의 여부 확인
    if (!termsAgreed) {
      alert("이용약관에 동의해주세요."); // 이용약관 미동의 시 알림
      return;
    }
    if (
      nicknameCheckStatus !== "available" ||
      !nickname ||
      !termsAgreed ||
      showEmailError ||
      showPasswordError
    ) {
      alert("입력 항목을 다시 확인해주세요.");
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await setDoc(doc(firestore, "users", user.uid), { nickname });
      setSignUpSuccess(true); // 회원가입 성공 상태 설정
    } catch (error) {
      console.error("회원가입 실패:", error);
    }
  };

  // 회원가입 성공 페이지 렌더링
  if (signUpSuccess) {
    return (
      <div id="container">
        <div className="create_account_succ">
          <h3>
            <p>
              <span>{nickname}</span>님<br />
              MODU의 회원이 되신걸
              <br />
              환영합니다!
            </p>
          </h3>
          <p>이제 모두와 소통을 즐겨보세요!</p>
        </div>

        <div className="btn_wrap">
          <button
            className="save"
            style={{ width: "100%" }}
            onClick={() => navigate("/")}
          >
            MODU 시작하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="container">
      <div className="create_account">
        <h3>
          <p>
            MODU 회원이 되어
            <br />
            모두와 소통을 즐겨보세요!
          </p>
        </h3>
        <div className="acc_info">
          <span>이용약관</span>
          <p className="acc_text">
            ① 국가공간정보포털은 다음의 목적을 위하여 개인정보를 처리합니다.
            처리하고 있는 개인정보는 다음의 목적 이외의 용도로공간정보포털은
            다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는
            다공간정보포털은 다음의 목적을 위하여 개인정보를 처리합니다.
            처리하고 있는 개인정보는 다는 이용되지 않으며, 이용 목적이 변경되는
            경우에는 개인정보 보호법 제18조에 따라 별도의 동의를 받는 등 필요한
            조치를 이행할 예정입니다.{" "}
          </p>
          <div className="acc_agree">
            <input
              type="checkbox"
              id="termsCheckbox"
              checked={termsAgreed}
              onChange={() => setTermsAgreed(!termsAgreed)}
              required
            />
            <label htmlFor="termsCheckbox">이용약관에 동의합니다.</label>
            {!termsAgreed && (
              <p className="acc_error">이용약관에 동의해주세요.</p>
            )}
          </div>
        </div>
        <ul>
          <li>
            <label htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={email}
              onChange={handleEmailChange}
            />
            {showEmailError && (
              <p className="acc_error">이메일 형식을 확인해주세요</p>
            )}
          </li>
          <li style={{ height: "120px" }}>
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              value={password}
              onChange={handlePasswordChange}
            />
            <p className="acc_pass">
              * 비밀번호는 6-20자의 영문자, 숫자, 특수문자만 가능합니다
            </p>
            {showPasswordError && (
              <p className="acc_error">비밀번호 양식을 확인해주세요</p>
            )}
          </li>
          <li>
            <label htmlFor="username">닉네임</label>
            <input
              type="text"
              placeholder="닉네임"
              value={nickname}
              className="username"
              onChange={(e) => setNickname(e.target.value)}
            />
            <button className="username" onClick={checkNicknameUnique}>
              중복확인
            </button>
            {nicknameCheckStatus === "available" && (
              <p className="acc_ok">사용할 수 있는 닉네임입니다</p>
            )}
            {nicknameCheckStatus === "unavailable" && (
              <p className="acc_error">이미 사용 중인 닉네임입니다</p>
            )}
          </li>
          <button
            type="button"
            onClick={handleSignUp}
            //   disabled={nicknameCheckStatus !== "available"}
            className="create_save"
          >
            회 원 가 입
          </button>
        </ul>
      </div>
    </div>
  );
}

export default SignUp;
