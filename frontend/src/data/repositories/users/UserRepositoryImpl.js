export class UserRepositoryImpl {

    async getAllUsers() {

        const token = localStorage.getItem("token");
        console.log(token);

        const response = await fetch("http://localhost:8081/users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });

        const json = await response.json();

        if (!response.ok) {
            throw new Error(json.message || "Failed to fetch users");
        }

        return json;
    }

}