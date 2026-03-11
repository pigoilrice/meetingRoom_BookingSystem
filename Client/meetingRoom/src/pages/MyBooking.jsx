import React from "react";
import { Link } from "react-router-dom";

const myBookingPage = () => {
  // 先做個假模型
  const myBookings = [
    {
      id: "B001",
      roomName: "會議室 A (大型)",
      date: "2026-02-25",
      time: "14:00 - 16:00",
      status: "即將到來", // upcoming
    },
    {
      id: "B002",
      roomName: "創意空間 (中型)",
      date: "2026-02-20",
      time: "10:00 - 12:00",
      status: "已結束", // completed
    },
  ];

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-primary fw-bold m-0">我的預約清單</h2>
            <Link to="/" className="btn btn-outline-primary btn-sm">
              <i className="bi bi-plus-lg me-1"></i> 新增預約
            </Link>
          </div>

          {/* 預約清單 */}
          {myBookings.length === 0 ? (
            <div className="alert alert-light text-center py-5 shadow-sm border-0">
              <p className="text-muted mb-0">您目前沒有任何預約紀錄。</p>
            </div>
          ) : (
            <div className="list-group shadow-sm border-0">
              {myBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="list-group-item list-group-item-action p-4 border-0 border-bottom"
                >
                  <div className="d-flex w-100 justify-content-between align-items-start">
                    {/* 左側：會議室資訊 */}
                    <div>
                      <h5 className="mb-1 fw-bold">{booking.roomName}</h5>
                      <p className="mb-1 text-muted">
                        <i className="bi bi-calendar-event me-2"></i>
                        {booking.date}
                      </p>
                      <small className="text-secondary">
                        <i className="bi bi-clock me-2"></i>
                        {booking.time}
                      </small>
                    </div>

                    {/* 右側：狀態標籤與操作 */}
                    <div className="text-end">
                      <span
                        className={`badge rounded-pill mb-2 ${booking.status === "即將到來" ? "bg-success" : "bg-secondary"}`}
                      >
                        {booking.status}
                      </span>
                      <br />
                      {booking.status === "即將到來" && (
                        <button className="btn btn-sm btn-outline-danger mt-2">
                          取消預約
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default myBookingPage;
