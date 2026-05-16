export class IncidentRepositoryImpl {

    #base = "http://localhost:8081";

    #headers() {
        const token = localStorage.getItem("token");
        return {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        };
    }

    async getAllIncidents() {
        const response = await fetch(`${this.#base}/incidents/all`, {
            method: "GET",
            headers: this.#headers(),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Failed to fetch incidents");
        return json;
    }

    async getIncidentById(incidentId) {
        const response = await fetch(`${this.#base}/incidents/${incidentId}`, {
            method: "GET",
            headers: this.#headers(),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Failed to fetch incident");
        return json;
    }

    async getIncidentsByStatus() {
        const response = await fetch(`${this.#base}/incidents/status`, {
            method: "GET",
            headers: this.#headers(),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Failed to fetch incidents by status");
        return json;
    }

    async updateIncidentStatus(incidentId, status) {
        const response = await fetch(
            `${this.#base}/incidents/${incidentId}/status?status=${encodeURIComponent(status)}`,
            {
                method: "PATCH",
                headers: this.#headers(),
            }
        );

        if (!response.ok) {
            let errorMessage = "Failed to update incident status";

            try {
                const errorJson = await response.json();
                errorMessage = errorJson.message || errorMessage;
            } catch (_) {}

            throw new Error(errorMessage);
        }

        // If backend returns empty body, still consider it success
        try {
            return await response.json();
        } catch (_) {
            return true;
        }
    }

    async deleteIncident(incidentId) {
        const response = await fetch(`${this.#base}/incidents/${incidentId}`, {
            method: "DELETE",
            headers: this.#headers(),
        });
        if (!response.ok) throw new Error("Failed to delete incident");
        return true;
    }

    async createIncident(incidentDescription, userId, category) {
        const response = await fetch(`${this.#base}/incidents/create`, {
            method: "POST",
            headers: this.#headers(),
            body: JSON.stringify({ incidentDescription, userId, category }),
        });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Failed to create incident");
        return json;
    }

    async assignIncidentToStaff(incidentId, staffId) {
        const response = await fetch(`${this.#base}/incidents/${incidentId}/assign`, {
            method: "PATCH",
            headers: this.#headers(),
            body: JSON.stringify({
                staffId: staffId,
            }),
        });

        if (!response.ok) {
            let errorMessage = "Failed to assign incident to staff";

            try {
                const errorJson = await response.json();
                errorMessage = errorJson.message || errorMessage;
            } catch (_) {}

            throw new Error(errorMessage);
        }

        try {
            return await response.json();
        } catch (_) {
            return true;
        }
    }
}