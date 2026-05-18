import { useEffect, useRef, useState } from "react";
import api from "../services/api";

const ACTIVE_TIMEOUT = 10000;   // 5 dk 5 * 60 * 1000
const INACTIVE_TIMEOUT = 20000; // 15 dk 15 * 60 * 1000

const useUserPresence = () => {
  const [status, setStatus] = useState("Online");
  const lastActivityRef = useRef(Date.now());
  const lastSentStatusRef = useRef(null); // aynı statusu tekrar göndermemek için

  const getUser = () => {
    try {
      return JSON.parse(localStorage.getItem("currentUser") || "{}");
    } catch {
      return {};
    }
  };

  const updateStatus = async (newStatus) => {
    const user = getUser();
    if (!user?.id) return;

    if (lastSentStatusRef.current === newStatus) return;

    try {
      await api.patch(`/staff/${user.id}`, { status: newStatus });
      lastSentStatusRef.current = newStatus;
    } catch (err) {
      console.error("Status update failed:", err.message);
      console.log("USER OBJECT:", user);
      console.log("USER ID:", user.id);
      console.log("TYPE:", typeof user.id);
    }
  };

  useEffect(() => {
    const handleActivity = () => {
      lastActivityRef.current = Date.now();

      if (status !== "Active") {
        setStatus("Active");
        updateStatus("Active");
      }
    };

    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("click", handleActivity);

    return () => {
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("click", handleActivity);
    };
  }, [status]);

  useEffect(() => {
    const interval = setInterval(() => {
      const diff = Date.now() - lastActivityRef.current;

      if (diff > INACTIVE_TIMEOUT) {
        setStatus((prev) => {
          if (prev !== "Inactive") {
            updateStatus("Inactive");
            return "Inactive";
          }
          return prev;
        });
      } else if (diff > ACTIVE_TIMEOUT) {
        setStatus((prev) => {
          if (prev !== "Pending") {
            updateStatus("Pending");
            return "Pending";
          }
          return prev;
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    updateStatus("Online");
  }, []);

  return status; 
};

export default useUserPresence;