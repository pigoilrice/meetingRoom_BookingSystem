// src/pages/BookingPage.jsx
import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const BookingPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm border-0 p-4">
            <h2 className="mb-4 text-primary">填寫預約資料</h2>

            {/* 這裡先印出 ID 證明我們成功把資料傳過來了 */}
            <div className="alert alert-info">
              您目前正在預約的房間 ID 是：<strong>{roomId}</strong>
            </div>

            <form>
              <div className="mb-3">
                <label className="form-label">會議名稱</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="例如：年度行銷會議"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">選擇日期</label>
                <input type="date" className="form-control" />
              </div>

              <div className="d-grid gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => navigate("/my-bookings")}
                >
                  確認預約 (模擬送出)
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => navigate(-1)}
                >
                  返回上一頁
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
