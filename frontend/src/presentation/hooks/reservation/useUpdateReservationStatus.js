import { useState } from "react";

export function useUpdateReservationStatus(reservationUseCase) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const updateStatus = async (reservationId, status) => {
        setLoading(true);
        setError(null);

        try {
            return await reservationUseCase.updateReservationStatus(reservationId, status);
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { updateStatus, loading, error };
}