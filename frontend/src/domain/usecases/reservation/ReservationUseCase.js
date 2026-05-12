export class ReservationUseCase {
    constructor(reservationRepository) {
        this.reservationRepository = reservationRepository;
    }

    async getAllReservations() {
        return await this.reservationRepository.getAllReservations();
    }

    async getReservationById(reservationId) {
        return await this.reservationRepository.getReservationById(reservationId);
    }

    async updateReservationStatus(reservationId, status) {
        return await this.reservationRepository.updateReservationStatus(reservationId, status);
    }

    async deleteReservation(reservationId, userId) {
        return await this.reservationRepository.deleteReservation(reservationId, userId);
    }
}