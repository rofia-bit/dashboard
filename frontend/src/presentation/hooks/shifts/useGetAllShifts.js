/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

export function useGetAllShifts(shiftUseCase) {
    const [shifts, setShifts]   = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState(null);

    const fetchShifts = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await shiftUseCase.getAllShifts();
            setShifts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchShifts(); }, []);

    return { shifts, loading, error, refetch: fetchShifts };
}