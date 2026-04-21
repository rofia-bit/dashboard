import { useState } from "react";

export function useDeleteGuestRequest(guestRequestUseCase) {
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState(null);

    const deleteGuestRequest = async (requestId) => {
        setLoading(true);
        setError(null);
        try {
            await guestRequestUseCase.deleteGuestRequest(requestId);
            return true;
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { deleteGuestRequest, loading, error };
}