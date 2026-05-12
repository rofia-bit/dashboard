/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

export function useGetAllIncidents(incidentUseCase) {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchIncidents = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await incidentUseCase.getAllIncidents();
            setIncidents(data || []);
            return data || [];
        } catch (err) {
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncidents();
    }, []);

    return { incidents, loading, error, refetch: fetchIncidents };
}