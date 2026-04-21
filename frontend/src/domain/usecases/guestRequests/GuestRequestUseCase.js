export class GuestRequestUseCase {
    constructor(guestRequestRepository) {
        this.guestRequestRepository = guestRequestRepository;
    }

    async getAllGuestRequests() {
        return await this.guestRequestRepository.getAllGuestRequests();
    }

    async getGuestRequestById(requestId) {
        return await this.guestRequestRepository.getGuestRequestById(requestId);
    }

    async updateGuestRequestStatus(requestId, status) {
        return await this.guestRequestRepository.updateGuestRequestStatus(requestId, status);
    }

    async deleteGuestRequest(requestId) {
        return await this.guestRequestRepository.deleteGuestRequest(requestId);
    }
}