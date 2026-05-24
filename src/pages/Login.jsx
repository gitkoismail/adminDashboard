import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiLock } from "react-icons/fi";
import { getItems, updateItem } from "../services/supabaseCrud";

const Login = () => {
  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const findUser = async (e) => {
    e.preventDefault();

    try {
      const staff = await getItems("/staff");

      const user = staff.find(
        (u) => u.email.toLowerCase() === loginData.email.toLowerCase()
      );

      if (!user || user.password !== loginData.password) {
        throw new Error("Fallback");
      }

      const updatedUser = await updateItem("/staff", user.id, {
        status: "Online",
      });

      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      navigate("/dashboard");
    } catch (err) {
      const dummyUser = {
        id: "2",
        email: "admin@mail.com",
        password: "1234",
        name: "Admin",
        department: "Boss",
        role: "Admin",
        status: "Online",
      };

      if (
        loginData.email !== dummyUser.email ||
        loginData.password !== dummyUser.password
      ) {
        alert("Email or password is wrong");
        return;
      }

      try {
        await updateItem("/staff", dummyUser.id, {
          status: "Online",
        });
      } catch (err) {
        console.log("Fallback admin status update failed:", err.message);
      }

      localStorage.setItem("currentUser", JSON.stringify(dummyUser));
      navigate("/dashboard");
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
              <FiUsers className="input-icon" strokeWidth={1} />
              <input
                type="text"
                id="email"
                name="email"
                required
                placeholder="admin@mail.com"
                value={loginData.email}
                onChange={handleChange}
              />
            </div>

            <p className="helper-text">admin@mail.com</p>
          </div>

          <div className="login-border">
            <label htmlFor="password">Password</label>

            <div className="input-group">
              <FiLock className="input-icon" strokeWidth={1} />
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder="1234"
                value={loginData.password}
                onChange={handleChange}
              />
            </div>

            <p className="helper-text">1234</p>
          </div>

          <button type="submit">Sign In</button>
        </form>
      </section>
    </main>
  );
};

export default Login;