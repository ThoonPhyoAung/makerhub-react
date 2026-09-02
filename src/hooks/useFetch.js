// useFetch.js is using for fetching data from the API and handling loading and error states. 
// can help to reduce the code duplication and make the code more readable and maintainable at every component that needs to fetch data from the API.

import { useState, useEffect } from "react";

export const useFetch = (apiFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await apiFunction();
        setData(result);
      } catch (err) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiFunction]);

  return { data, loading, error };
};
