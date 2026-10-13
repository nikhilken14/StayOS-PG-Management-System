import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/axios";
import "../styles/Auth.css";


export default function Auth() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: ""
    });
    const [submitting, setSubmitting] = useState(false);


    const change = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };


    const login = async (e) => {
        e.preventDefault();
        if (submitting) return;
        setSubmitting(true);

        try {

            const res = await api.post(
                "/auth/login",
                form
            );


            localStorage.setItem(
                "access_token",
                res.data.access_token
            );


            localStorage.setItem("stayos_user", JSON.stringify(res.data.user));
            navigate("/home");

        } catch (err) {

            alert(
                err.response?.data?.detail ||
                "Login failed"
            );
        } finally {
            setSubmitting(false);

        }
    };


    return (

        <div className="login-page">

            <div className="login-box">


                <div className="login-logo">
                    🏠
                </div>


                <h1>
                    StayOS
                </h1>


                <h2>
                    Welcome back
                </h2>


                <p>
                    Sign in to your owner or administrator workspace
                </p>



                <form onSubmit={login}>


                    <div className="login-field">

                        <label>
                            Username
                        </label>

                        <input
                            type="text"
                            name="username"
                            placeholder="Enter username"
                            value={form.username}
                            onChange={change}
                            required
                        />

                    </div>




                    <div className="login-field">

                        <label>
                            Password
                        </label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            value={form.password}
                            onChange={change}
                            required
                        />

                    </div>




                    <button
                        type="submit"
                        className="login-submit"
                    >
                        {submitting ? "Signing in…" : "Login"}
                    </button>


                </form>




                <div className="login-links">

                    <Link to="/reset">
                        Forgot Password?
                    </Link>


                    <span>
                        |
                    </span>


                    <Link to="/signup">
                        Create owner workspace
                    </Link>


                </div>



            </div>


        </div>

    );

}
