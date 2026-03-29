/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

export function useGetMyShifts(shiftUseCase) {
    const [shifts, setShifts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await shiftUseCase.getMyShifts();
                setShifts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);

    return { shifts, loading, error };
}