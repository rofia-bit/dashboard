import { useState } from "react";

export function useDeleteShift(shiftUseCase) {
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(null);

    const deleteShift = async (shiftId) => {
        setLoading(true);
        setError(null);
        try {
            await shiftUseCase.deleteShift(shiftId);
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { deleteShift, loading, error };
}