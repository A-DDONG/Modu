import React from "react";
import { useNavigate } from "react-router-dom";

function SignUpSuccess() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate("/"); // 메인 페이지로 이동
  };

  return (
    <div id="container">
      <div className="create_account_succ">
        <h3>
          <p>
            <span>홍길동</span>님<br />
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
          onClick={handleStartClick}
        >
          MODU 시작하기
        </button>
      </div>
    </div>
  );
}

export default SignUpSuccess;
