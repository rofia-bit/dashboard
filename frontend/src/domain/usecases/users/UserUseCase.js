export class UserUseCase {

    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async getAllUsers() {
        return await this.userRepository.getAllUsers();
    }

}