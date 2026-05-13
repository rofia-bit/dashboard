import { useState } from "react";

export function useUpdateShift(shiftUseCase) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateShift = async (shiftId, data) => {
        setLoading(true);
        setError(null);

        try {
            return await shiftUseCase.updateShift(shiftId, data);
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { updateShift, loading, error };
}