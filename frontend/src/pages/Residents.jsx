import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/Residents.css";

function Residents() {
    const emptyForm = {
        full_name: "",
        mobile_no: "",
        email: "",
        DOB: "",
        permenant_address: "",
        aadhar: "",
        status: "ACTIVE",
    };

    const [residents, setResidents] = useState([]);
    const [formData, setFormData] = useState(emptyForm);
    const [search, setSearch] = useState("");

    const loadResidents = async () => {
        try {
            const res = await api.get("/resident/all");
            setResidents(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        loadResidents();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const addResident = async (e) => {
        e.preventDefault();

        try {
            const res = await api.post("/resident/add", formData);

            alert(res.data.message || "Resident Added");

            setFormData(emptyForm);

            loadResidents();
        } catch (err) {
            console.log(err);
            alert("Failed to add resident");
        }
    };

    const deleteResident = async (id) => {
        try {
            await api.delete(`/resident/delete/${id}`);
            loadResidents();
        } catch (err) {
            console.log(err);
        }
    };

    const searchResident = async () => {
        try {
            if (!search.trim()) {
                loadResidents();
                return;
            }

            const res = await api.get(
                `/resident/search?keyword=${search}`
            );

            setResidents(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="res-page">
            {/* HEADER */}
            <div className="res-header">
                <div>
                    <h1>Residents</h1>
                    <p>
                        Manage resident profiles and occupancy
                        records
                    </p>
                </div>

                <div className="res-header-icon">
                    <i className="bi bi-people"></i>
                </div>
            </div>

            {/* ADD RESIDENT */}
            <div className="res-card">
                <div className="res-card-title">
                    <i className="bi bi-person-plus"></i>

                    <div>
                        <h3>Add Resident</h3>
                        <p>
                            Create a new resident profile
                        </p>
                    </div>
                </div>

                <form onSubmit={addResident}>
                    <div className="res-form">
                        <div className="res-input">
                            <i className="bi bi-person"></i>

                            <input
                                name="full_name"
                                placeholder="Full Name"
                                value={formData.full_name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="res-input">
                            <i className="bi bi-phone"></i>

                            <input
                                name="mobile_no"
                                placeholder="Mobile Number"
                                value={formData.mobile_no}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="res-input">
                            <i className="bi bi-envelope"></i>

                            <input
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="res-input">
                            <i className="bi bi-calendar"></i>

                            <input
                                type="date"
                                name="DOB"
                                value={formData.DOB}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="res-input res-full">
                            <i className="bi bi-geo-alt"></i>

                            <textarea
                                name="permenant_address"
                                placeholder="Permanent Address"
                                value={
                                    formData.permenant_address
                                }
                                onChange={handleChange}
                            />
                        </div>

                        <div className="res-input">
                            <i className="bi bi-card-text"></i>

                            <input
                                name="aadhar"
                                placeholder="Aadhar Number"
                                value={formData.aadhar}
                                onChange={handleChange}
                            />
                        </div>

                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >
                            <option value="ACTIVE">
                                ACTIVE
                            </option>

                            <option value="INACTIVE">
                                INACTIVE
                            </option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="res-btn"
                    >
                        <i className="bi bi-check-circle"></i>
                        Add Resident
                    </button>
                </form>
            </div>

            {/* SEARCH */}
            <div className="res-card">
                <h3 className="res-search-title">
                    Search Resident
                </h3>

                <div className="res-search">
                    <input
                        placeholder="Search resident name..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                    />

                    <button onClick={searchResident}>
                        <i className="bi bi-search"></i>
                        Search
                    </button>

                    <button
                        className="res-reset"
                        onClick={loadResidents}
                    >
                        Reset
                    </button>
                </div>
            </div>

            {/* RESIDENT LIST */}
            <h2 className="res-section-title">
                Resident List
            </h2>

            <div className="res-table-wrapper">
                <table className="res-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Resident</th>
                            <th>Mobile</th>
                            <th>Email</th>
                            <th>Aadhar</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {residents.length > 0 ? (
                            residents.map((r) => (
                                <tr key={r.id}>
                                    <td>#{r.id}</td>

                                    <td>
                                        <div className="res-user">
                                            <div className="res-user-avatar">
                                                {(
                                                    r.name ||
                                                    r.full_name
                                                )
                                                    ?.charAt(
                                                        0
                                                    )
                                                    .toUpperCase()}
                                            </div>

                                            <span>
                                                {r.name ||
                                                    r.full_name}
                                            </span>
                                        </div>
                                    </td>

                                    <td>
                                        {r.mobile ||
                                            r.mobile_no}
                                    </td>

                                    <td>{r.email}</td>

                                    <td>{r.aadhar}</td>

                                    <td>
                                        <span
                                            className={
                                                r.status ===
                                                "ACTIVE"
                                                    ? "res-active"
                                                    : "res-inactive"
                                            }
                                        >
                                            {r.status}
                                        </span>
                                    </td>

                                    <td>
                                        <button
                                            className="res-delete-btn"
                                            onClick={() =>
                                                deleteResident(
                                                    r.id
                                                )
                                            }
                                        >
                                            <i className="bi bi-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="7"
                                    className="res-empty"
                                >
                                    No residents found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Residents;