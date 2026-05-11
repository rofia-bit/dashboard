export class GuestRequestRepositoryImpl {

    #base = "http://localhost:8081";

    #headers() {
        const token = localStorage.getItem("token");
        return {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        };
    }

    async getAllGuestRequests() {
        const response = await fetch(`${this.#base}/guest-requests/pending`, {
            method: "GET",
            headers: this.#headers(),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Failed to fetch guest requests");
        return json;
    }

    async getGuestRequestById(requestId) {
        const response = await fetch(`${this.#base}/guest-requests/${requestId}`, {
            method: "GET",
            headers: this.#headers(),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Failed to fetch guest request");
        return json;
    }

    async updateGuestRequestStatus(requestId, status) {
        const response = await fetch(`${this.#base}/guest-requests/${requestId}/status`, {
            method: "PATCH",
            headers: this.#headers(),
            body: JSON.stringify({ status }),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Failed to update guest request status");
        return json;
    }

    async deleteGuestRequest(requestId) {
        const response = await fetch(`${this.#base}/guest-requests/${requestId}`, {
            method: "DELETE",
            headers: this.#headers(),
        });
        if (!response.ok) {
            const json = await response.json().catch(() => ({}));
            throw new Error(json.message || "Failed to delete guest request");
        }
        return true;
    }
}