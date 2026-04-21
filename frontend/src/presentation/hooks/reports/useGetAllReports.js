import { useState, useEffect, useCallback } from "react";

export function useGetAllReports(reportUseCase) {
    const [reports, setReports]   = useState([]);
    const [loading, setLoading]   = useState(true);
    const [error,   setError]     = useState(null);

    const fetchReports = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await reportUseCase.getAllReports();
            setReports(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchReports(); }, []);

    return { reports, loading, error, refetch: fetchReports };
}