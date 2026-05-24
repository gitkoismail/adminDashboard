import { useState, useEffect } from "react";
import { getItems } from "../services/supabaseCrud";

const useFetch = (url) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getItems(url);

        if (!ignore) {
          setData(result);
        }
      } catch (err) {
        console.log(err.message);

        if (!ignore) {
          setError(err.message);
          setData([]);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [url]);

  return { data, isLoading, error };
};

export default useFetch;