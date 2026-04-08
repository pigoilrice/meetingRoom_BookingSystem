// src/pages/BookingPage.jsx
import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const BookingPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const room = location.state?.room;

  // 1. 從 Context 拿出目前登入的使用者
  const { user } = useAuth();

  // 2. 準備 State 來裝表單輸入的資料
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isSubmiting, setIsSubmiting] = useState(false);

  if (!room) {
    return (
      <div className="container py-5 text-center">
        <h3 className="text-danger">找不到房間資訊</h3>
        <button className="btn btn-primary" onClick={() => navigate("/")}>
          回首頁
        </button>
      </div>
    );
  }

  // 3. 表單送出時執行的函式
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("請先登入後再預約！");
      navigate("/login");
      return;
    }

    setIsSubmiting(true);

    try {
      const token = localStorage.getItem("token");
      // 打包要傳給後端的資料
      const bookingData = {
        roomId: room._id,
        date: date,
        startTime: startTime,
        endTime: endTime,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookingData),
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("🎉 " + data.message);
        navigate("/my-bookings");
      } else {
        toast.error("預約失敗：" + data.message);
      }
    } catch (e) {
      console.error("預約請求錯誤:", e);
      toast.error("伺服器連線異常，請稍後再試...");
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow border-0 overflow-hidden">
            <div className="row g-0">
              {/* 左側：房間資訊 (保持不變) */}
              <div className="col-md-5 bg-light d-flex flex-column">
                <img
                  src={room.image}
                  alt={room.name}
                  className="img-fluid"
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <div className="p-4 flex-grow-1">
                  <h4 className="fw-bold text-primary">{room.name}</h4>
                  <p className="text-muted mb-2">
                    <i className="bi bi-people-fill me-2"></i>容納人數：
                    {room.capacity} 人
                  </p>
                </div>
              </div>

              {/* 右側：填寫表單 */}
              <div className="col-md-7 p-4 p-md-5">
                <h3 className="mb-4 fw-bold">填寫預約資料</h3>

                {/* 注意這裡：加上 onSubmit */}
                <form onSubmit={handleSubmit}>
                  <div className="row mb-3">
                    <div className="col-sm-12 mb-3">
                      <label className="form-label fw-bold">選擇日期</label>
                      <input
                        type="date"
                        className="form-control"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        required
                      />
                    </div>
                    <div className="col-sm-6">
                      <label className="form-label fw-bold">開始時間</label>
                      <input
                        type="time"
                        className="form-control"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        min={"08:00"}
                        max={"16:30"}
                        required
                      />
                    </div>
                    <div className="col-sm-6 mt-3 mt-sm-0">
                      <label className="form-label fw-bold">結束時間</label>
                      <input
                        type="time"
                        className="form-control"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        min={"08:30"}
                        max={"17:00"}
                        required
                      />
                    </div>
                  </div>

                  <div className="d-flex gap-2 mt-4">
                    <button
                      type="button"
                      className="btn btn-outline-secondary px-4"
                      onClick={() => navigate(-1)}
                    >
                      返回
                    </button>
                    {/* 把 type 改成 submit，並加上鎖定防呆 */}
                    <button
                      type="submit"
                      className="btn btn-success flex-grow-1"
                      disabled={isSubmiting}
                    >
                      {isSubmiting ? "處理中..." : "確認預約"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
