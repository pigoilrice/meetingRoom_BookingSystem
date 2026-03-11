import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate(); //  啟用跳轉頁面

  // 假資料：之後會改成從 Server 抓取
  const rooms = [
    {
      id: 1,
      name: "會議室 A (大型)",
      capacity: 12,
      image:
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=500",
    },
    {
      id: 2,
      name: "創意空間 (中型)",
      capacity: 8,
      image:
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=500",
    },
    {
      id: 3,
      name: "面試間 (小型)",
      capacity: 4,
      image:
        "https://images.unsplash.com/photo-1505409859467-3a799c240121?auto=format&fit=crop&w=500",
    },
  ];

  return (
    <div
      className="container d-flex flex-column justify-content-center py-5"
      style={{ minHeight: "calc(100vh - 70px)" }}
    >
      <header className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary">會議室預約系統</h1>
        <p className="lead text-muted">請選擇您想預約的空間</p>
      </header>

      <div className="row g-4">
        {rooms.map((room) => (
          <div key={room.id} className="col-md-4">
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
                  onClick={() => navigate(`/book/${room.id}`)}
                >
                  立即預約
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
