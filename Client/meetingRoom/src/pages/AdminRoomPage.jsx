import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";

const AdminRoomPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [roomForm, setRoomForm] = useState({
    name: "",
    capacity: "",
    size: "中", // default
    description: "",
    image: "",
  });

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/rooms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roomForm),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error("❌ " + data.message);
      } else {
        toast.success(data.message);
        navigate("/");
      }
    } catch (err) {
      toast.error("伺服器連線異常");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow border-0 p-4">
            <h2 className="text-center text-primary fw-bold mb-4">
              <i className="bi bi-tools me-2"></i>新增自定義會議室
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">
                  會議室名稱 <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="例如：VIP 尊榮會議室"
                  value={roomForm.name}
                  onChange={(e) =>
                    setRoomForm({ ...roomForm, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="row mb-3">
                <div className="col-6">
                  <label className="form-label fw-bold">
                    容納人數 <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="例如：12"
                    min="1"
                    value={roomForm.capacity}
                    onChange={(e) =>
                      setRoomForm({ ...roomForm, capacity: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="col-6">
                  <label className="form-label fw-bold">
                    規模大小 <span className="text-danger">*</span>
                  </label>
                  <select
                    className="form-select"
                    value={roomForm.size}
                    onChange={(e) =>
                      setRoomForm({ ...roomForm, size: e.target.value })
                    }
                  >
                    <option value="小">小 (1-4人)</option>
                    <option value="中">中 (5-10人)</option>
                    <option value="大">大 (11人以上)</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">圖片網址 (選填)</label>
                <input
                  type="url"
                  className="form-control"
                  placeholder="https://example.com/image.jpg"
                  value={roomForm.image}
                  onChange={(e) =>
                    setRoomForm({ ...roomForm, image: e.target.value })
                  }
                />
                <div className="form-text">
                  若不填寫，系統將提供預設精美圖片。
                </div>
              </div>

              <div className="mb-4">
                <label className="form-label fw-bold">會議室描述 (選填)</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="請描述會議室的設備或特色..."
                  value={roomForm.description}
                  onChange={(e) =>
                    setRoomForm({ ...roomForm, description: e.target.value })
                  }
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-100 fw-bold py-2"
                disabled={isLoading}
              >
                {isLoading ? "建立中..." : "確認建立會議室"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRoomPage;
