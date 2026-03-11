// src/context/AuthContext.jsx
import React, { createContext, useState, useContext } from "react";

// 1. 建立 Context (也就是我們的公佈欄)
const AuthContext = createContext();

// 2. 建立 Provider (負責管理並廣播狀態的組件)
export const AuthProvider = ({ children }) => {
  // state: 記錄目前登入的使用者資訊。null 代表未登入。
  const [user, setUser] = useState(null);

  // 模擬登入功能
  const login = (email) => {
    // 實務上這裡會打 API 給後端，拿到 token 和 user data
    // 我們先模擬登入成功，把 email 的前半段當作使用者名稱
    const username = email.split("@")[0];
    setUser({ name: username, email });
  };

  // 登出
  const logout = () => {
    setUser(null);
  };

  // 3. 把 state 和 function 打包，提供給底下的 children (也就是整個 App)
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 4. 自訂 Hook：讓其他元件能更方便地使用這個 Context (不用每次都 import AuthContext)
export const useAuth = () => {
  return useContext(AuthContext);
};
