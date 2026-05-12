import { useEffect, useState } from "react";

export function useGetAllReservations(reservationUseCase) {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchReservations = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await reservationUseCase.getAllReservations();
            setReservations(data || []);
            return data || [];
        } catch (err) {
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    return { reservations, loading, error, refetch: fetchReservations };
}