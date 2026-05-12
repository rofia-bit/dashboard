export class FacilityRepositoryImpl {

    #base = "http://localhost:8081";

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
        const formData = new FormData();

        if (facilityData.image) {
            formData.append("image", facilityData.image);
        }

        const response = await fetch(
            `${this.#base}/facilities?name=${encodeURIComponent(facilityData.name)}&capacity=${facilityData.capacity}`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: formData,
            }
        );

        if (!response.ok) {
            let message = "Failed to create facility";

            try {
                const json = await response.json();
                message = json.message || message;
            } catch (_) {}

            throw new Error(message);
        }

        return await response.json();
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

        const response = await fetch(
            `${this.#base}/facilities/${facilityId}/status?status=${encodeURIComponent(facilityStatus)}`,
            {
                method: "PATCH",
                headers: this.#headers(),
            }
        );

        if (!response.ok) {

            let message = "Failed to update facility status";

            try {
                const json = await response.json();
                message = json.message || message;
            } catch (_) {}

            throw new Error(message);
        }

        try {
            return await response.json();
        } catch (_) {
            return true;
        }
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