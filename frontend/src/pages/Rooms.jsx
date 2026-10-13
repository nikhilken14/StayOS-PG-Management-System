import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/Rooms.css";

export default function Rooms() {
    const [rooms, setRooms] = useState([]);
    const [availability, setAvailability] = useState([]);
    const [showEdit, setShowEdit] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        pg_id: "",
        room_number: "",
        capacity: "",
        rent_amount: "",
    });

    const [editData, setEditData] = useState({
        room_number: "",
        capacity: "",
        rent_amount: "",
    });

    const loadRooms = async () => {
        try {
            const res = await api.get("/room/list");
            setRooms(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        loadRooms();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const addRoom = async (e) => {
        e.preventDefault();

        try {
            await api.post("/room/add", {
                pg_id: Number(formData.pg_id),
                room_number: Number(formData.room_number),
                capacity: Number(formData.capacity),
                rent_amount: Number(formData.rent_amount),
            });

            alert("Room Added");

            setFormData({
                pg_id: "",
                room_number: "",
                capacity: "",
                rent_amount: "",
            });

            loadRooms();
        } catch (err) {
            console.log(err);
            alert("Room creation failed");
        }
    };

    const deleteRoom = async (id) => {
        try {
            await api.delete(`/room/delete/${id}`);
            loadRooms();
        } catch (err) {
            console.log(err);
        }
    };

    const openEdit = (room) => {
        setEditId(room.room_id);

        setEditData({
            room_number: room.room_number,
            capacity: room.capacity,
            rent_amount: room.rent_amount,
        });

        setShowEdit(true);
    };

    const updateRoom = async () => {
        try {
            await api.put(`/room/edit/${editId}`, {
                room_number: Number(editData.room_number),
                capacity: Number(editData.capacity),
                rent_amount: Number(editData.rent_amount),
            });

            setShowEdit(false);
            loadRooms();
        } catch (err) {
            console.log(err);
        }
    };

    const getAvailability = async () => {
        try {
            const res = await api.get("/room/availability");
            setAvailability(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="room-page">
            {/* HEADER */}

            <div className="room-header">
                <div>
                    <h1>Room Management</h1>

                    <p>
                        Manage rooms, capacity and
                        availability
                    </p>
                </div>

                <div className="room-icon">
                    <i className="bi bi-door-open"></i>
                </div>
            </div>

            {/* ADD ROOM */}

            <div className="room-card">
                <div className="card-title">
                    <i className="bi bi-plus-circle"></i>

                    <div>
                        <h3>Add New Room</h3>

                        <p>
                            Create room under a PG
                            property
                        </p>
                    </div>
                </div>

                <form onSubmit={addRoom}>
                    <div className="room-form">
                        <input
                            name="pg_id"
                            placeholder="PG ID"
                            value={formData.pg_id}
                            onChange={handleChange}
                        />

                        <input
                            name="room_number"
                            placeholder="Room Number"
                            value={
                                formData.room_number
                            }
                            onChange={handleChange}
                        />

                        <input
                            name="capacity"
                            placeholder="Capacity"
                            value={formData.capacity}
                            onChange={handleChange}
                        />

                        <input
                            name="rent_amount"
                            placeholder="Monthly Rent"
                            value={
                                formData.rent_amount
                            }
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="room-btn"
                    >
                        <i className="bi bi-check"></i>
                        Save Room
                    </button>
                </form>
            </div>

            {/* ALL ROOMS */}

            <h2 className="section-title">
                All Rooms
            </h2>

            <div className="room-table-wrapper">
                <table className="room-table">
                    <thead>
                        <tr>
                            <th>Room ID</th>
                            <th>PG ID</th>
                            <th>Room Number</th>
                            <th>Capacity</th>
                            <th>Monthly Rent</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rooms.length > 0 ? (
                            rooms.map((room) => (
                                <tr
                                    key={room.room_id}
                                >
                                    <td>
                                        #
                                        {
                                            room.room_id
                                        }
                                    </td>

                                    <td>
                                        #{room.pg_id}
                                    </td>

                                    <td>
                                        <div className="room-name">
                                            <i className="bi bi-door-open"></i>
                                            Room{" "}
                                            {
                                                room.room_number
                                            }
                                        </div>
                                    </td>

                                    <td>
                                        {
                                            room.capacity
                                        }
                                    </td>

                                    <td>
                                        ₹{" "}
                                        {
                                            room.rent_amount
                                        }
                                    </td>

                                    <td>
                                        <div className="table-actions">
                                            <button
                                                type="button"
                                                className="edit"
                                                onClick={() =>
                                                    openEdit(
                                                        room
                                                    )
                                                }
                                            >
                                                <i className="bi bi-pencil"></i>
                                            </button>

                                            <button
                                                type="button"
                                                className="delete"
                                                onClick={() =>
                                                    deleteRoom(
                                                        room.room_id
                                                    )
                                                }
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="room-empty"
                                >
                                    No rooms found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* AVAILABILITY */}

            {/* <div className="availability-card"> */}
                <div className="availability-header">
                    <h2>
                        Room Availability
                    </h2>

                    <button
                        type="button"
                        onClick={
                            getAvailability
                        }
                    >
                        Check Availability
                    </button>
                </div>

                <div className="room-table-wrapper">
                    <table className="room-table">
                        <thead>
                            <tr>
                                <th>Room</th>
                                <th>Capacity</th>
                                <th>Occupied</th>
                                <th>Available</th>
                                <th>Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {availability.length >
                            0 ? (
                                availability.map(
                                    (room) => (
                                        <tr
                                            key={
                                                room.room_id
                                            }
                                        >
                                            <td>
                                                <div className="room-name">
                                                    <i className="bi bi-door-open"></i>
                                                    Room{" "}
                                                    {
                                                        room.room_number
                                                    }
                                                </div>
                                            </td>

                                            <td>
                                                {
                                                    room.capacity
                                                }
                                            </td>

                                            <td>
                                                {
                                                    room.occupied
                                                }
                                            </td>

                                            <td>
                                                {
                                                    room.available
                                                }
                                            </td>

                                            <td>
                                                <span
                                                    className={
                                                        room.status ===
                                                        "Available"
                                                            ? "available"
                                                            : "full"
                                                    }
                                                >
                                                    {
                                                        room.status
                                                    }
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                )
                            ) : (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="room-empty"
                                    >
                                        Click
                                        "Check
                                        Availability"
                                        to load
                                        room
                                        availability
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {showEdit && (
                <div className="overlay">
                    <div className="edit-modal">
                        <h2>Edit Room</h2>

                        <input
                            placeholder="Room Number"
                            value={
                                editData.room_number
                            }
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    room_number:
                                        e.target
                                            .value,
                                })
                            }
                        />

                        <input
                            placeholder="Capacity"
                            value={
                                editData.capacity
                            }
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    capacity:
                                        e.target
                                            .value,
                                })
                            }
                        />

                        <input
                            placeholder="Rent Amount"
                            value={
                                editData.rent_amount
                            }
                            onChange={(e) =>
                                setEditData({
                                    ...editData,
                                    rent_amount:
                                        e.target
                                            .value,
                                })
                            }
                        />

                        <div className="modal-actions">
                            <button
                                type="button"
                                onClick={() =>
                                    setShowEdit(
                                        false
                                    )
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                onClick={
                                    updateRoom
                                }
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
            </div>

         
        // </div>
    );
}