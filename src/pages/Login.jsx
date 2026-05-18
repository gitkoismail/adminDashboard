import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiAlertOctagon, FiLock } from "react-icons/fi";

const Login = () => {
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });
    

    const findUser = async (e) => {
        e.preventDefault();

        try {
            const response = await api.get(`/staff`);

            const user = response.data.find(
            (u) =>
                u.email.toLowerCase() === loginData.email.toLowerCase()
            );

            if (!user || user.password !== loginData.password) {
            alert("Email or password is wrong");
            return;
            }

            await api.patch(`/staff/${user.id}`, {
            status: "Online",
            });

            const updatedUser = { ...user, status: "Online" };

            localStorage.setItem("currentUser", JSON.stringify(updatedUser));

            navigate("/dashboard");
        } catch (err) {
            console.log(err.message);
        }
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;

        setLoginData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    

  return (
    <main className="login-page">
        <section className="login-card">
            <h2 className="login-title">Login</h2>
            <form className="userAddForm" onSubmit={findUser}>
                <div className="login-border">
                    <label htmlFor="email">Email</label>
                    <div className="input-group">
                        <FiUsers className="input-icon" strokeWidth={1}/>
                        <input 
                            type="text"
                            id='email'
                            name='email'
                            required
                            placeholder='HaldirArcher@gmail.com'
                            value={loginData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <p className="helper-text">Someone@...</p>
                </div>
                <div className="login-border">
                    <label htmlFor="password">Password</label>
                    <div className="input-group">
                        <FiLock className="input-icon" strokeWidth={1}/>
                        <input 
                            type="password"
                            id='password'
                            name='password'
                            required
                            placeholder= '. . . . . . .'
                            value={loginData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <p className="helper-text">Sz27e@...</p>
                </div>
                <button type="submit">Sign In</button>  
            </form>
        </section>
    </main>
  )
}

export default Login