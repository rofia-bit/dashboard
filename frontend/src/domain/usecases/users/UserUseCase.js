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

    async getSecurityGuards() {
        const users = await this.userRepository.getAllUsers();

        console.log("ALL USERS =", users);

        const guards = users.filter(user => {
            const role = user.role?.toUpperCase();

            return (
                role === "SECURITY_GUARD" ||
                role === "ROLE_SECURITY_GUARD"
            );
        });

        console.log("SECURITY GUARDS =", guards);

        return guards;
    }

}