export class ShiftUseCase {
    constructor(shiftRepository) {
        this.shiftRepository = shiftRepository;
    }

    async getMyShifts() {
        return await this.shiftRepository.getMyShifts();
    }
}