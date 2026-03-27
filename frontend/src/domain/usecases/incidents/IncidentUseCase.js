export class IncidentUseCase {

    constructor(incidentRepository) {
        this.incidentRepository = incidentRepository;
    }

    async getAllIncidents() {
        return await this.incidentRepository.getAllIncidents();
    }

    async getIncidentById(incidentId) {
        return await this.incidentRepository.getIncidentById(incidentId);
    }

    async getIncidentsByStatus() {
        return await this.incidentRepository.getIncidentsByStatus();
    }

    async updateIncidentStatus(incidentId, status) {
        return await this.incidentRepository.updateIncidentStatus(incidentId, status);
    }

    async deleteIncident(incidentId) {
        return await this.incidentRepository.deleteIncident(incidentId);
    }

    async createIncident(incidentDescription, userId, category) {
        return await this.incidentRepository.createIncident(incidentDescription, userId, category);
    }
}