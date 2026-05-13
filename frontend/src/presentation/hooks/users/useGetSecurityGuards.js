import { useEffect, useState } from "react";

export function useGetSecurityGuards(userUseCase) {
    const [guards, setGuards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchGuards = async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await userUseCase.getSecurityGuards();
            setGuards(data || []);
            return data || [];
        } catch (err) {
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGuards();
    }, []);

    return { guards, loading, error, refetch: fetchGuards };
}