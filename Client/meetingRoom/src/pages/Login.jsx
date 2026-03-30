import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 1. 引入剛剛寫好的自訂 Hook
import toast from "react-hot-toast";

const loginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const { login, register } = useAuth(); // 2. 從 Context 拿出 login 函式

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        await login(email, password);
        toast.success("🎉 登入成功！");
        navigate("/");
      } else {
        await register(name, email, password);
        toast.success("✅ 註冊成功！請直接登入。");
        setIsLogin(true); // 切換回登入模式讓使用者登入
        setPassword(""); // 清空密碼框比較安全
      }
    } catch (err) {
      // 這裡會接住我們在 Context 裡拋出的 Error (例如密碼錯誤)
      toast.error("❌ 發生錯誤：" + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow border-0 rounded-3 p-4 p-md-5">
            <h2 className="text-center fw-bold mb-4 text-primary">
              {isLogin ? "會員登入" : "註冊帳號"}
            </h2>

            <form onSubmit={handleSubmit}>
              {/* 只有在「註冊模式」時，才顯示姓名輸入框 */}
              {!isLogin && (
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingName"
                    placeholder="填名字呦!"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <label htmlFor="floatingPassword">密碼</label>
              </div>

              {/* 送出按鈕 */}
              <button
                type="submit"
                className="btn btn-primary w-100 py-2 fw-bold"
                disabled={isLoading}
              >
                {isLoading ? "處理中..." : isLogin ? "登入" : "註冊"}
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
