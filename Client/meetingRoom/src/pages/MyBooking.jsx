import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const myBookingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 🌟 新增：用來控制 Modal 與編輯表單的 State
  const [editingBooking, setEditingBooking] = useState(null); // 記錄目前正在編輯哪一筆訂單 (null 代表沒打開)
  const [editForm, setEditForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
  }); // 記錄表單輸入的值
  const [isUpdating, setIsUpdating] = useState(false); // 防止重複點擊儲存

  useEffect(() => {
    // 1. 防呆：如果沒登入，踢回首頁
    if (!user) {
      navigate("/login");
      return;
    }

    const token = localStorage.getItem("token");

    // 2. 打 API 討資料 (把 email 帶在網址後面傳給後端)
    fetch(`${import.meta.env.VITE_API_URL}/api/bookings/my-bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        return data;
      })
      .then((data) => {
        setBookings(data);
        setIsLoading(false);
      })
      .catch((e) => {
        console.error("抓取預約紀錄失敗:", e);
        // 如果失敗了，把 bookings 設定成空陣列，避免 map 崩潰白畫面！
        setBookings([]);
        setIsLoading(false);
      });
  }, [user, navigate]);

  // 新增刪除函式 (handleCancel)
  const handleCancel = async (bookingId) => {
    const isConfirmed = window.confirm("您確定要取消這筆會議室預約嗎？");
    if (!isConfirmed) return;

    const token = localStorage.getItem("token");

    try {
      // 2. 呼叫後端的 DELETE API
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${bookingId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.ok) {
        toast.success("✅ 預約已成功取消！");

        // 3. React：過濾畫面上的資料
        // 把「被刪除的那個 ID」從 bookings 陣列中剔除，畫面就會瞬間更新！
        setBookings((prevBooking) =>
          prevBooking.filter((booking) => booking._id !== bookingId),
        );
      } else {
        const data = await response.json();
        toast.error("❌ 取消失敗：" + data.message);
      }
    } catch (e) {
      console.error("取消請求錯誤:", e);
      toast.error("伺服器連線異常，請稍後再試。。。");
    }
  };

  // 新增：編輯預約相關的 3 個核心函式
  // 1. 打開 Modal，並把舊資料填入輸入框
  const openEditModal = (booking) => {
    setEditingBooking(booking);
    setEditForm({
      date: booking.date,
      startTime: booking.startTime,
      endTime: booking.endTime,
    });
  };

  // 2. 關閉 Modal，清空狀態
  const closeEditModal = () => {
    setEditingBooking(null);
  };

  // 3. 送出修改資料 (PUT)
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true);

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/bookings/${editingBooking._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        },
      );

      if (response.ok) {
        const data = await response.json();
        // 不重新整理網頁，直接在map中替換掉那筆被更新的資料

        setBookings((prev) =>
          prev.map((b) => (b._id === editingBooking._id ? data.booking : b)),
        );

        toast.success("🎉 " + data.message);
        closeEditModal();
      } else {
        const data = await response.json();
        toast.error("❌ 修改失敗：" + data.message);
      }
    } catch (err) {
      console.error("修改請求錯誤:", err);
      toast.error("伺服器連線異常，請稍後再試。");
    } finally {
      setIsUpdating(false);
    }
  };

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

          {isLoading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status"></div>
            </div>
          ) : bookings.length === 0 ? (
            // 沒有預約時的畫面
            <div className="alert alert-light text-center py-5 shadow-sm border-0">
              <p className="text-muted mb-0">您目前沒有任何預約紀錄。</p>
            </div>
          ) : (
            // 有預約時，把陣列 map 出來
            <div className="list-group shadow-sm border-0">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="list-group-item list-group-item-action p-4 border-0 border-bottom"
                >
                  <div className="row align-items-center">
                    {/* 左側：會議室資訊 */}
                    <div className="col-sm-3 mb-3 mb-sm-0">
                      <img
                        src={booking.room?.image}
                        alt="room"
                        className="img-fluid rounded"
                        style={{
                          height: "80px",
                          width: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>

                    {/* 中間：預約資訊 */}
                    <div className="col-sm-6">
                      {/* 注意這裡：因為我們用了 populate，所以可以點出 room.name */}
                      <h5 className="mb-1 fw-bold">
                        {booking.room?.name || "已刪除的房間"}
                      </h5>
                      <p className="mb-1 text-muted">
                        <i className="bi bi-calendar-event me-2"></i>
                        {booking.date}
                      </p>
                      <small className="text-secondary fw-bold">
                        <i className="bi bi-clock me-2"></i>
                        {booking.startTime} - {booking.endTime}
                      </small>
                    </div>

                    {/* 🌟 修改：右側按鈕區加入「修改時間」按鈕 */}
                    <div className="col-sm-3 text-sm-end mt-3 mt-sm-0">
                      <span
                        className={`badge rounded-pill mb-2 ${booking.status === "upcoming" ? "bg-success" : "bg-secondary"}`}
                      >
                        {booking.status === "upcoming" ? "即將到來" : "已結束"}
                      </span>
                      <br />
                      {booking.status === "upcoming" && (
                        <div className="d-flex justify-content-sm-end gap-2 mt-2">
                          {/* 點擊時呼叫 openEditModal 並把這筆訂單資料傳進去 */}
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => openEditModal(booking)}
                          >
                            修改時間
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleCancel(booking._id)}
                          >
                            取消預約
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ========================================== */}
      {/* 🌟 新增：純 React 打造的 Bootstrap Modal 視窗 */}
      {/* ========================================== */}
      {editingBooking && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }} // 半透明黑色背景
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header bg-light">
                <h5 className="modal-title fw-bold text-primary">
                  修改預約時間
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeEditModal}
                ></button>
              </div>

              <form onSubmit={handleUpdateSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label fw-bold">預約房間</label>
                    <input
                      type="text"
                      className="form-control"
                      value={editingBooking.room?.name}
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">選擇日期</label>
                    <input
                      type="date"
                      className="form-control"
                      value={editForm.date}
                      onChange={(e) =>
                        setEditForm({ ...editForm, date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col-6">
                      <label className="form-label fw-bold">開始時間</label>
                      <input
                        type="time"
                        className="form-control"
                        value={editForm.startTime}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            startTime: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label fw-bold">結束時間</label>
                      <input
                        type="time"
                        className="form-control"
                        value={editForm.endTime}
                        onChange={(e) =>
                          setEditForm({ ...editForm, endTime: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={closeEditModal}
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4"
                    disabled={isUpdating}
                  >
                    {isUpdating ? "儲存中..." : "儲存修改"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default myBookingPage;
