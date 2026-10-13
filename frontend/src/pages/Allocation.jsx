import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/Allocation.css";

export default function Allocation() {

  const [allocations, setAllocations] = useState([]);

  const [form, setForm] = useState({
    resident_id: "",
    room_id: "",
    deposit: "",
    monthly_rent: "",
    joining_date: ""
  });

  const [roomId, setRoomId] = useState("");
  const [occupancy, setOccupancy] = useState(null);

  const loadAllocations = async () => {
    try {
      const res = await api.get("/allocation/list");
      setAllocations(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    loadAllocations();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const allocateRoom = async (e) => {
    e.preventDefault();

    try {

      const res = await api.post("/allocation/upload", {
        resident_id: Number(form.resident_id),
        room_id: Number(form.room_id),
        deposit: Number(form.deposit),
        monthly_rent: Number(form.monthly_rent),
        joining_date: form.joining_date
      });

      alert(res.data.message);

      setForm({
        resident_id: "",
        room_id: "",
        deposit: "",
        monthly_rent: "",
        joining_date: ""
      });

      loadAllocations();

    } catch (err) {
      alert(err.response?.data?.detail || "Allocation failed");
    }
  };

  const vacate = async (id) => {
    try {
      const res = await api.put(`/allocation/vacate/${id}`);
      alert(res.data.message);
      loadAllocations();
    } catch (err) {
      console.log(err);
    }
  };

  const checkOccupancy = async () => {
    try {

      const res = await api.get(
        `/allocation/occupancy/${roomId}`
      );

      setOccupancy(res.data);

    } catch (err) {

      alert(
        err.response?.data?.detail ||
        "Room not found"
      );
    }
  };

  return (
    <div className="allocation-management-page">

      <div className="allocation-management-header">

        <div>
          <h1>Allocation Management</h1>
          <p>Assign residents, manage rooms and track occupancy</p>
        </div>

        <div className="allocation-management-icon">
          <i className="bi bi-diagram-3"></i>
        </div>

      </div>

      {/* Allocate Room */}

      <div className="allocation-management-card">

        <div className="allocation-management-title">

          <i className="bi bi-person-plus"></i>

          <div>
            <h3>Allocate Room</h3>
            <p>Create a new room allocation</p>
          </div>

        </div>

        <form onSubmit={allocateRoom}>

          <div className="allocation-management-form">

            <input
              name="resident_id"
              placeholder="Resident ID"
              value={form.resident_id}
              onChange={handleChange}
            />

            <input
              name="room_id"
              placeholder="Room ID"
              value={form.room_id}
              onChange={handleChange}
            />

            <input
              name="deposit"
              placeholder="Deposit Amount"
              value={form.deposit}
              onChange={handleChange}
            />

            <input
              name="monthly_rent"
              placeholder="Monthly Rent"
              value={form.monthly_rent}
              onChange={handleChange}
            />

            <input
              type="date"
              name="joining_date"
              value={form.joining_date}
              onChange={handleChange}
            />

          </div>

          <button className="allocation-management-btn">
            Allocate Room
          </button>

        </form>

      </div>

      {/* Occupancy */}

      <div className="allocation-management-card">

        <div className="allocation-management-title">

          <i className="bi bi-door-open"></i>

          <div>
            <h3>Room Occupancy</h3>
            <p>Check room availability</p>
          </div>

        </div>

        <div className="allocation-management-search">

          <input
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />

          <button
            className="allocation-management-btn"
            onClick={checkOccupancy}
          >
            Check
          </button>

        </div>

        {occupancy && (

          <div className="allocation-management-occupancy">

            <div>
              <span>Room</span>
              <strong>{occupancy.room_number}</strong>
            </div>

            <div>
              <span>Capacity</span>
              <strong>{occupancy.capacity}</strong>
            </div>

            <div>
              <span>Occupied</span>
              <strong>{occupancy.occupied}</strong>
            </div>

            <div>
              <span>Available</span>
              <strong className="success">
                {occupancy.available}
              </strong>
            </div>

          </div>

        )}

      </div>

      {/* ACTIVE ALLOCATIONS */}
<div className="allocation-management-card">
<div className="allocation-management-section">

    <h2>Active Allocations</h2>

    <div className="allocation-table-wrapper">

        <table className="allocation-table">

            <thead>

                <tr>
                    <th>Resident ID</th>
                    <th>Room ID</th>
                    <th>Deposit</th>
                    <th>Monthly Rent</th>
                    <th>Joining Date</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>

            </thead>

            <tbody>

                {allocations.length > 0 ? (

                    allocations.map((item) => (

                        <tr key={item.id}>

                            <td>#{item.resident_id}</td>

                            <td>
                                <div className="allocation-room">
                                    <i className="bi bi-door-open"></i>
                                    Room {item.room_id}
                                </div>
                            </td>

                            <td>₹ {item.deposit}</td>

                            <td>₹ {item.monthly_rent}</td>

                            <td>{item.joining_date}</td>

                            <td>
                                <span className="allocation-active">
                                    Active
                                </span>
                            </td>

                            <td>

                                <button
                                    className="allocation-danger-btn"
                                    onClick={() =>
                                        vacate(item.resident_id)
                                    }
                                >
                                    <i className="bi bi-box-arrow-right"></i>
                                    Vacate
                                </button>

                            </td>

                        </tr>

                    ))

                ) : (

                    <tr>

                        <td
                            colSpan="7"
                            className="allocation-empty"
                        >
                            No active allocations found
                        </td>

                    </tr>

                )}

            </tbody>

        </table>

    </div>

</div>
</div>
    </div>
  );
}