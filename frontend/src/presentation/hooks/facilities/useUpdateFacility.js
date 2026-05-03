import { useState } from "react";

export function useUpdateFacility(facilityUseCase) {
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(null);

    const updateFacility = async (facilityId, facilityData) => {
        setLoading(true);
        setError(null);
        try {
            const result = await facilityUseCase.updateFacility(facilityId, facilityData);
            return result;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { updateFacility, loading, error };
}

export function useUpdateFacilityStatus(facilityUseCase) {
    const [loading, setLoading] = useState(false);
    const [error, setError]     = useState(null);

    const updateFacilityStatus = async (facilityId, facilityStatus) => {
        setLoading(true);
        setError(null);
        try {
            const result = await facilityUseCase.updateFacilityStatus(facilityId, facilityStatus);
            return result;
        } catch (err) {
            setError(err.message);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { updateFacilityStatus, loading, error };
}