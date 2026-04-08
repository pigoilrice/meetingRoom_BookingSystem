import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const HomePage = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const { user } = useAuth();

  // 2. 使用 useEffect，在畫面剛載入時去打後端 API
  useEffect(() => {
    const url = user
      ? `${import.meta.env.VITE_API_URL}/api/rooms?userId=${user.id}`
      : `${import.meta.env.VITE_API_URL}/api/rooms`;

    fetch(url)
      .then(async (res) => {
        const data = await res.json();

        if (Array.isArray(data)) {
          setRooms(data);
        } else {
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

  const handleDeleteRoom = async (roomId) => {
    const isConfirmed = window.confirm(
      "確定要拆除這間會議室嗎？此動作無法復原喔！",
    );
    if (!isConfirmed) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/rooms/${roomId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message);
        setRooms((prev) => prev.filter((room) => room._id !== roomId));
      } else {
        toast.error("❌ " + data.message);
      }
    } catch (e) {
      toast.error("伺服器連線異常，刪除失敗");
    }
  };

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

                  {user && room.createdBy === user._id && (
                    <button
                      className="btn btn-sm btn-outline-danger ms-2"
                      onClick={() => handleDeleteRoom(room._id)}
                    >
                      <i className="bi bi-trash"></i> 刪除
                    </button>
                  )}
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
