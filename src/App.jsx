import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import Staff from "./pages/Staff";
import { Routes, Route, data } from "react-router-dom";
import Customers from "./pages/Customers";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
import useUserPresence from "./hooks/useUserPresence";

function App() {
  useUserPresence();
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="App">
              <Sidebar />
              <div className="Main">
                {<Header title="Admin Dashboard" />}
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/staff" element={<Staff />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;