import {useState} from "react";

export function useGetUsers(userUseCase) {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const getUsers = async () => {

        try {
            setLoading(true);
            setError("");

            const result = await userUseCase.getAllUsers();

            setUsers(result);

        } catch (err) {

            setError(err.message || "Error loading users");

        } finally {

            setLoading(false);

        }

    };

    return {
        users,
        loading,
        error,
        getUsers
    };

}