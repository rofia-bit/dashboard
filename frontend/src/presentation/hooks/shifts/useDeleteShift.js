import { useState } from "react";

export function useDeleteShift(shiftUseCase) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteShift = async (shiftId) => {
        setLoading(true);
        setError(null);

        try {
            return await shiftUseCase.deleteShift(shiftId);
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { deleteShift, loading, error };
}