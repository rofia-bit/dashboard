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

    async registerUser(request) {

        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:8081/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json" ,
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(request)
        });

        const json = await response.json();

        if (!response.ok) {
            throw new Error(json.message || "Failed to create user");
        }

        return json;
    }


    async deleteUser(userId) {

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:8081/users/${userId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json" ,
                "Authorization": "Bearer " + token
            }
        });

        if (!response.ok) {
            throw new Error("Failed to delete user");
        }

        return true;
    }

    async deactivateUser(userId) {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:8081/users/${userId}/deactivate`, {
            method: "PATCH",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const text = await response.text();

        console.log("Deactivate status:", response.status);
        console.log("Deactivate response:", text);

        if (!response.ok) {
            throw new Error(text || `Failed to deactivate user. Status: ${response.status}`);
        }

        return text ? JSON.parse(text) : true;
    }

    async activateUser(userId) {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:8081/users/${userId}/activate`, {
            method: "PATCH",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        const text = await response.text();

        console.log("Activate status:", response.status);
        console.log("Activate response:", text);

        if (!response.ok) {
            throw new Error(text || `Failed to activate user. Status: ${response.status}`);
        }

        return text ? JSON.parse(text) : true;
    }

}