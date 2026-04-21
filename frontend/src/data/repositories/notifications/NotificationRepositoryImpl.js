export class NotificationRepositoryImpl {

    #base = "http://localhost:8081";

    #headers() {
        const token = localStorage.getItem("token");
        return {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        };
    }

    async getNotifications(userId) {
        const response = await fetch(`${this.#base}/notifications/${userId}`, {
            method: "GET",
            headers: this.#headers(),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Failed to get notifications");
        return json;
    }

    async markAsRead(notificationId) {
        const response = await fetch(`${this.#base}/notifications/${notificationId}/read`, {
            method: "PATCH",
            headers: this.#headers(),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Failed to mark as read");
        return json;
    }
}