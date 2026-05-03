/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";

export function useGetAllFacilities(facilityUseCase) {
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading]       = useState(true);
    const [error, setError]           = useState(null);

    const fetchFacilities = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await facilityUseCase.getAllFacilities();
            setFacilities(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchFacilities(); }, []);

    return { facilities, loading, error, refetch: fetchFacilities };
}