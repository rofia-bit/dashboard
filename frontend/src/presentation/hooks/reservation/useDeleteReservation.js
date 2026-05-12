import { useState } from "react";

export function useDeleteReservation(reservationUseCase) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const deleteReservation = async (reservationId, userId) => {
        setLoading(true);
        setError(null);

        try {
            return await reservationUseCase.deleteReservation(reservationId, userId);
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { deleteReservation, loading, error };
}