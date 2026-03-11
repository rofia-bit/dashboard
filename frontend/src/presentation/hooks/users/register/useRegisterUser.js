import { useState } from "react";

export function useRegisterUser(userUseCase) {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const registerUser = async (fullname, email, password, role) => {

        try {

            setLoading(true);
            setError("");

            const result = await userUseCase.registerUser(
                fullname,
                email,
                password,
                role
            );

            console.log(result);
            return result;

        } catch (err) {

            setError(err.message || "Failed to register user");
            return null;

        } finally {

            setLoading(false);

        }
    };

    return {
        registerUser,
        loading,
        error
    };
}