import { useState } from "react";

export function useUpdateShift(shiftUseCase) {
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(null);

    const updateShift = async (shiftId, shiftData) => {
        setLoading(true);
        setError(null);
        try {
            const result = await shiftUseCase.updateShift(shiftId, shiftData);
            return result;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { updateShift, loading, error };
}