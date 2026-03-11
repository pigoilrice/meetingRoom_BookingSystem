// src/components/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // 1. 引入 useAuth

const Navbar = () => {
  const { user, logout } = useAuth(); // 2. 拿出 user 狀態和 logout 函式
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // 登出後回首頁
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold text-primary" to="/">
          <i className="bi bi-calendar2-check-fill me-2"></i>
          RoomBook
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* 導覽列連結 */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto align-items-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                首頁
              </Link>
            </li>

            {/* 3. 條件渲染：如果已登入，才顯示「我的預約」 */}
            {user && (
              <li className="nav-item">
                <Link className="nav-link" to="/my-bookings">
                  我的預約
                </Link>
              </li>
            )}

            {/* 4. 判斷登入狀態，顯示不同按鈕 */}
            {user ? (
              // 已登入：顯示使用者名稱與登出按鈕
              <li className="nav-item dropdown ms-lg-3 mt-2 mt-lg-0">
                <span className="navbar-text text-dark me-3 fw-bold">
                  <i className="bi bi-person-circle me-1"></i> {user.name} 您好
                </span>
                <button
                  className="btn btn-outline-danger btn-sm px-3"
                  onClick={handleLogout}
                >
                  登出
                </button>
              </li>
            ) : (
              // 未登入：顯示登入按鈕
              <li className="nav-item ms-lg-3 mt-2 mt-lg-0">
                <Link className="btn btn-primary btn-sm px-4" to="/login">
                  登入 / 註冊
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
