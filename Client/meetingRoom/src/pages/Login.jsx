import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 1. 引入剛剛寫好的自訂 Hook

const loginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState(""); // 新增 email state 來抓取輸入框的值
  const navigate = useNavigate();

  const { login } = useAuth(); // 2. 從 Context 拿出 login 函式

  const handleSubmit = (e) => {
    e.preventDefault();

    // 3. 呼叫 Context 裡的 login 函式，並把輸入的 email 傳進去
    login(email);
    // 這裡未來會串接後端 API (例如 axios.post('/api/login'))
    alert(isLogin ? "模擬登入成功！" : "模擬註冊成功！");

    // 成功後將使用者導向首頁
    navigate("/");
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          {" "}
          {/* 登入框不需要太寬，使用 col-lg-4 剛剛好 */}
          <div className="card shadow-sm border-0 p-4 mt-5">
            <div className="text-center mb-4">
              {/* 頂部 Icon */}
              <i
                className="bi bi-person-circle text-primary"
                style={{ fontSize: "3rem" }}
              ></i>
              <h3 className="fw-bold mt-2">
                {isLogin ? "登入系統" : "建立新帳號"}
              </h3>
              <p className="text-muted small">
                {isLogin
                  ? "歡迎回來，請輸入您的帳號密碼"
                  : "請填寫以下資訊以開始預約會議室"}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* 只有在「註冊模式」時，才顯示姓名輸入框 */}
              {!isLogin && (
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingName"
                    placeholder="王小明"
                    required
                  />
                  <label htmlFor="floatingName">姓名</label>
                </div>
              )}

              {/* 電子郵件 (共用) */}
              <div className="form-floating mb-3">
                <input
                  type="email"
                  className="form-control"
                  id="floatingEmail"
                  placeholder="name@example.com"
                  value={email} // 綁定 state
                  onChange={(e) => setEmail(e.target.value)} // 讓 React 記住你打的字
                  required
                />
                <label htmlFor="floatingEmail">電子郵件</label>
              </div>

              {/* 密碼 (共用) */}
              <div className="form-floating mb-4">
                <input
                  type="password"
                  className="form-control"
                  id="floatingPassword"
                  placeholder="Password"
                  required
                />
                <label htmlFor="floatingPassword">密碼</label>
              </div>

              {/* 送出按鈕 */}
              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-bold"
              >
                {isLogin ? "登入" : "註冊"}
              </button>
            </form>

            {/* 切換模式的按鈕 */}
            <div className="text-center mt-4">
              <span className="text-muted small">
                {isLogin ? "還沒有帳號嗎？" : "已經有帳號了？"}
              </span>
              <button
                type="button"
                className="btn btn-link text-decoration-none p-0 ms-1 align-baseline"
                onClick={() => setIsLogin(!isLogin)} // 點擊時切換 true / false
              >
                {isLogin ? "立即註冊" : "登入現有帳號"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default loginPage;
