import { useEffect, useState } from "react";
import axios from "axios";
import api from "../api/axiosClient.js";

export default function useProductSearch(params) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/products", {
          params,
          signal: controller.signal,
        });
        setData(res.data.data);
        setTotal(res.data.total);
      } catch (err) {
        if (axios.isCancel(err)) return;
        setError(err.response?.data?.message || err.message);
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => controller.abort();
  }, [params.q, params.category, params.status, params.page, params.limit, tick]);

  const reload = () => setTick((t) => t + 1);

  return { data, total, loading, error, reload };
}
