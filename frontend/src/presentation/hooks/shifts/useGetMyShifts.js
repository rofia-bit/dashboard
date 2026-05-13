import { useEffect, useState } from "react";

export function useGetMyShifts(shiftUseCase, userId) {
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchShifts = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await shiftUseCase.getMyAssignedShifts(userId);
            setShifts(data || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchShifts();
        }
    }, [userId]);

    return {
        shifts,
        loading,
        error,
        refetch: fetchShifts,
    };
}