import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();

  // 2. 使用 useEffect，在畫面剛載入時去打後端 API
  useEffect(() => {
    console.log("1. 當前登入的 User 物件是：", user);

    const url = user
      ? `http://localhost:5000/api/rooms?userId=${user.id}`
      : "http://localhost:5000/api/rooms";

    console.log("2. 準備打 API 的網址是：", url);

    fetch(url)
      .then(async (res) => {
        const data = await res.json();

        if (Array.isArray(data)) {
          setRooms(data);
        } else {
          console.error("後端傳來的不是陣列喔！", data);
          setRooms([]);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        console.log("抓取房間資料失敗：", e);
        setRooms([]);
        setIsLoading(false);
      });
  }, [user]); // 把 user 加進中括號裡。這樣只要「登入」或「登出」，首頁就會自動重新撈一次資料！

  return (
    <div
      className="container d-flex flex-column justify-content-center py-5"
      style={{ minHeight: "calc(100vh - 70px)" }}
    >
      <header className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary">會議室預約系統</h1>
        <p className="lead text-muted">請選擇您想預約的空間</p>
      </header>

      {/* 3. 根據載入狀態顯示不同畫面 */}
      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">載入中...</span>
          </div>
          <p className="mt-3 text-muted">正在尋找會議室...</p>
        </div>
      ) : (
        <div className="row g-4">
          {rooms.map((room) => (
            <div key={room._id} className="col-md-4">
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={room.image}
                  className="card-img-top"
                  alt={room.name}
                  style={{ height: "200px", objectFit: "cover" }}
                />
                <div className="card-body text-center">
                  <h5 className="card-title fw-bold">{room.name}</h5>
                  <p className="card-text text-secondary">
                    <i className="bi bi-people-fill me-2"></i>容納人數：
                    {room.capacity} 人
                  </p>

                  <button
                    className="btn btn-primary px-4"
                    onClick={() =>
                      navigate(`/book/${room._id}`, { state: { room } })
                    }
                  >
                    立即預約
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;
