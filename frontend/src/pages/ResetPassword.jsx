import { useState } from "react";
import { Link } from "react-router-dom";

import api from "../api/axios";
import "../styles/Auth.css";


export default function ResetPassword() {


    const [form, setForm] = useState({

        username: "",
        security_answer: "",
        new_password: ""

    });



    const [question, setQuestion] = useState("");

    const [step, setStep] = useState(false);



    const change = (e) => {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    };




    const getQuestion = async () => {


        if (!form.username) {

            alert("Please enter username");

            return;

        }


        try {


            const res = await api.post(

                "/auth/security-question",

                {
                    username: form.username
                }

            );


            console.log(res.data);


            setQuestion(

                res.data.security_question

            );


            setStep(true);



        } catch (err) {


            console.log(err);


            alert(

                err.response?.data?.detail ||

                "Unable to get security question"

            );


        }

    };






    const reset = async (e) => {


        e.preventDefault();



        if (!form.security_answer || !form.new_password) {


            alert("Fill all fields");

            return;

        }



        try {


            console.log(form);



            const res = await api.post(

                "/auth/reset-password",

                {

                    username: form.username,

                    security_answer: form.security_answer,

                    new_password: form.new_password

                }

            );



            alert(

                res.data.message ||

                "Password reset successful"

            );



            setForm({

                username: "",

                security_answer: "",

                new_password: ""

            });


            setQuestion("");

            setStep(false);



        }


        catch (err) {


            console.log(err);


            alert(

                err.response?.data?.detail ||

                "Reset failed"

            );


        }


    };





    return (

        <div className="login-page">


            <div className="login-box">



                <div className="login-logo">

                    🔐

                </div>



                <h1>

                    StayOS

                </h1>



                <h2>

                    Reset Password

                </h2>



                <p>

                    Recover your admin account securely

                </p>





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

                    />


                </div>





                <button

                    type="button"

                    className="login-submit"

                    onClick={getQuestion}

                >

                    Get Security Question


                </button>







                {

                    question &&


                    <div className="security-box">


                        <h4>

                            Security Question

                        </h4>


                        <p>

                            {question}

                        </p>


                    </div>


                }









                {


                    step &&



                    <form onSubmit={reset}>


                        <div className="login-field">


                            <label>

                                Answer

                            </label>


                            <input


                                type="text"

                                name="security_answer"

                                placeholder="Enter answer"

                                value={form.security_answer}

                                onChange={change}

                            />


                        </div>







                        <div className="login-field">


                            <label>

                                New Password

                            </label>


                            <input


                                type="password"

                                name="new_password"

                                placeholder="Create new password"

                                value={form.new_password}

                                onChange={change}

                            />


                        </div>






                        <button

                            type="submit"

                            className="login-submit"

                        >

                            Reset Password


                        </button>



                    </form>


                }







                <div className="login-links">


                    <Link to="/login">

                        Back to Login

                    </Link>



                </div>




            </div>


        </div>

    );


}