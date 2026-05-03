export class FacilityRepositoryImpl {

    #base = "https://schnapps-statue-shallot.ngrok-free.dev";

    #headers() {
        const token = localStorage.getItem("token");
        return {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        };
    }

    async getAllFacilities() {
        const response = await fetch(`${this.#base}/facilities`, {
            method: "GET",
            headers: this.#headers(),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Failed to fetch facilities");
        return json;
    }

    async getFacilityById(facilityId) {
        const response = await fetch(`${this.#base}/facilities/${facilityId}`, {
            method: "GET",
            headers: this.#headers(),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Failed to fetch facility");
        return json;
    }

    async createFacility(facilityData) {
        const response = await fetch(`${this.#base}/facilities`, {
            method: "POST",
            headers: this.#headers(),
            body: JSON.stringify(facilityData),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Failed to create facility");
        return json;
    }

    async updateFacility(facilityId, facilityData) {
        const response = await fetch(`${this.#base}/facilities/${facilityId}`, {
            method: "PATCH",
            headers: this.#headers(),
            body: JSON.stringify(facilityData),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Failed to update facility");
        return json;
    }

    async updateFacilityStatus(facilityId, facilityStatus) {
        const response = await fetch(`${this.#base}/facilities/${facilityId}/status`, {
            method: "PATCH",
            headers: this.#headers(),
            body: JSON.stringify({ facilityStatus }),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Failed to update facility status");
        return json;
    }

    async deleteFacility(facilityId) {
        const response = await fetch(`${this.#base}/facilities/${facilityId}`, {
            method: "DELETE",
            headers: this.#headers(),
        });
        if (!response.ok) throw new Error("Failed to delete facility");
        return true;
    }
}