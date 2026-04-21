import { useState, useEffect, useCallback } from "react";

export function useGetAllGuestRequests(guestRequestUseCase) {
    const [guestRequests, setGuestRequests] = useState([]);
    const [loading,       setLoading]       = useState(true);
    const [error,         setError]         = useState(null);

    const fetchGuestRequests = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await guestRequestUseCase.getAllGuestRequests();
            setGuestRequests(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchGuestRequests(); }, []);

    return { guestRequests, loading, error, refetch: fetchGuestRequests };
}