import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import api from "../api/axios";
import "react-calendar/dist/Calendar.css";
import "../styles/CalendarPopup.css";

export default function CalendarPopup() {

  const [selectedDate, setSelectedDate] = useState(new Date());

  const [memos, setMemos] = useState([]);

  const [memo, setMemo] = useState("");

  const [showEditor, setShowEditor] = useState(false);

  const [editId, setEditId] = useState(null);

  const formatDate = (date) => {
    return date.toISOString().split("T")[0];
  };

  const loadMemos = async (date) => {

    try {

      const res = await api.get(
        `/calendar/memo/${formatDate(date)}`
      );

      setMemos(res.data);

    }
    catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    loadMemos(selectedDate);

  }, []);

  const handleDateChange = (date) => {

    setSelectedDate(date);

    loadMemos(date);

  };

  const saveMemo = async () => {

    if (!memo.trim()) return;

    try {

      if (editId) {

        await api.put(
          `/calendar/memo/${editId}`,
          {
            memo_date: formatDate(selectedDate),
            description: memo
          }
        );

      }
      else {

        await api.post(
          "/calendar/memo",
          {
            memo_date: formatDate(selectedDate),
            description: memo
          }
        );

      }

      setMemo("");

      setEditId(null);

      setShowEditor(false);

      loadMemos(selectedDate);

    }
    catch (err) {

      console.log(err);

    }

  };

  const deleteMemo = async (id) => {

    try {

      await api.delete(
        `/calendar/memo/${id}`
      );

      loadMemos(selectedDate);

    }
    catch (err) {

      console.log(err);

    }

  };

  const editMemo = (item) => {

    setEditId(item.id);

    setMemo(item.description);

    setShowEditor(true);

  };

  return (

    <div className="calendar-container">

      <div className="calendar-top">

        <h2>Calendar</h2>

        <button
          className="add-memo-btn"
          onClick={() => {

            setEditId(null);

            setMemo("");

            setShowEditor(true);

          }}
        >
          +
        </button>

      </div>

      <Calendar
        value={selectedDate}
        onChange={handleDateChange}
      />

      <div className="selected-date">

        {selectedDate.toDateString()}

      </div>

      {showEditor && (

        <div className="memo-editor">

          <h3>

            {editId ? "Edit Memo" : "New Memo"}

          </h3>

          <textarea
            placeholder="Write reminder..."
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
          />

          <div className="memo-actions">

            <button
              className="save-btn"
              onClick={saveMemo}
            >
              Save
            </button>

            <button
              className="cancel-btn"
              onClick={() => setShowEditor(false)}
            >
              Cancel
            </button>

          </div>

        </div>

      )}

      <div className="memo-section">

        <h3>Memos</h3>

        {

          memos.length === 0

            ? (

              <p className="empty">

                No reminders

              </p>

            )

            : (

              memos.map(item => (

                <div
                  className="memo-card"
                  key={item.id}
                >

                  <p>

                    {item.description}

                  </p>

                  <div>

                    <button
                      className="edit-small"
                      onClick={() => editMemo(item)}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-small"
                      onClick={() => deleteMemo(item.id)}
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))

            )

        }

      </div>

    </div>

  );

}