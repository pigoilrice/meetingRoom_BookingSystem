// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";

// 1. 建立 Context (也就是我們的公佈欄)
const AuthContext = createContext();

// 2. 建立 Provider (負責管理並廣播狀態的組件)
export const AuthProvider = ({ children }) => {
  // state: 記錄目前登入的使用者資訊。null 代表未登入。
  const [user, setUser] = useState(null);

  // 網頁載入時，先去「瀏覽器」找找看有沒有之前的登入紀錄
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedUser !== "undefined" && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("解析 LocalStorage 發生錯誤，已清除壞掉的資料", err);
        localStorage.removeItem("user");
        localStorage.removeItem("token");
      }
    }
  }, []);

  // 實際註冊API
  const register = async (name, email, password) => {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);
    return data;
  };

  // 真實登入API
  const login = async (email, password) => {
    // 實務上這裡會打 API 給後端，拿到 token 和 user data
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    localStorage.setItem("token", data.token);
    if (data.user) {
      localStorage.setItem("user", JSON.stringify(data.user));
    } else {
      console.error("完蛋了，後端沒有傳 user 過來！");
    }

    // 更新 React 狀態，讓 Navbar 瞬間變化
    setUser(data.user);
    return data;
  };

  // 登出
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  // 3. 把 state 和 function 打包，提供給底下的 children (也就是整個 App)
  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. 自訂 Hook：讓其他元件能更方便地使用這個 Context (不用每次都 import AuthContext)
export const useAuth = () => {
  return useContext(AuthContext);
};
