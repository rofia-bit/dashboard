import { useState } from "react";

export function useUpdateGuestRequestStatus(guestRequestUseCase) {
    const [loading, setLoading] = useState(false);
    const [error,   setError]   = useState(null);

    const updateStatus = async (requestId, status) => {
        setLoading(true);
        setError(null);
        try {
            const result = await guestRequestUseCase.updateGuestRequestStatus(requestId, status);
            return result;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { updateStatus, loading, error };
}