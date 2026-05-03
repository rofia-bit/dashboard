import { useState } from "react";

export function useCreateShift(shiftUseCase) {
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(null);

    const createShift = async (shiftData) => {
        setLoading(true);
        setError(null);
        try {
            const result = await shiftUseCase.createShift(shiftData);
            return result;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { createShift, loading, error };
}