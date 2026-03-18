import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate(); //  啟用跳轉頁面

  // 1. 準備一個空陣列的 State 來裝 API 回傳的房間資料
  const [rooms, setRooms] = useState([]);
  // 準備一個 State 來顯示「載入中」的狀態
  const [isLoading, setIsLoading] = useState(true);

  // 2. 使用 useEffect，在畫面剛載入時去打後端 API
  useEffect(() => {
    fetch("http://localhost:5000/api/rooms")
      .then((res) => res.json())
      .then((data) => {
        setRooms(data); // 把後端給的資料存進 State
        setIsLoading(false);
      })
      .catch((e) => {
        console.log("抓取房間資料失敗：", e);
        setIsLoading(false);
      });
  }, []); // 結尾的空陣列 [] 非常重要！代表「只在畫面第一次載入時執行一次」

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
