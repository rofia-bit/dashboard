export class FacilityUseCase {

    constructor(facilityRepository) {
        this.facilityRepository = facilityRepository;
    }

    async getAllFacilities() {
        return await this.facilityRepository.getAllFacilities();
    }

    async getFacilityById(facilityId) {
        return await this.facilityRepository.getFacilityById(facilityId);
    }

    async createFacility(facilityData) {
        return await this.facilityRepository.createFacility(facilityData);
    }

    async updateFacility(facilityId, facilityData) {
        return await this.facilityRepository.updateFacility(facilityId, facilityData);
    }

    async updateFacilityStatus(facilityId, facilityStatus) {
        return await this.facilityRepository.updateFacilityStatus(facilityId, facilityStatus);
    }

    async deleteFacility(facilityId) {
        return await this.facilityRepository.deleteFacility(facilityId);
    }
}