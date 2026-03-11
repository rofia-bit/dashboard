export class UserUseCase {

    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async getAllUsers() {
        return await this.userRepository.getAllUsers();
    }

    async registerUser(fullname, email, password, role) {

        const request = {
            fullname,
            email,
            password,
            role
        };

        return await this.userRepository.registerUser(request);
    }

    async deleteUser(userId) {
        return await this.userRepository.deleteUser(userId);
    }

}