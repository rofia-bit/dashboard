import { useEffect, useState } from "react";

export function useGetLogs(logUseCase, role) {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchLogs = async () => {
        setLoading(true);
        setError(null);

        try {

            let data = [];

            if (role === "ADMIN") {
                data = await logUseCase.getAllLogs();
            }

            else if (role === "SECURITY_GUARD") {
                data = await logUseCase.getMyLogs();
            }

            setLogs(data || []);

            return data || [];

        } catch (err) {

            setError(err.message);
            return [];

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [role]);

    return {
        logs,
        setLogs,
        loading,
        error,
        refetch: fetchLogs,
    };
}