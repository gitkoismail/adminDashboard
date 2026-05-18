import { useState, useEffect } from "react";
import api from "../services/api";

const useFetch = (url) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect (() => {
        const fetchData = async () => {
            const response = await api.get(url);
            try {
                setData(response.data);
            } catch (err) {
                console.log(err.message);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }  
        };
        fetchData();
    },[url]);

    return { data, isLoading, error };
};

export default useFetch