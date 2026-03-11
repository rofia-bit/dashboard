export class RegisterUserRequest {

    constructor(fullname, email, password, role) {
        this.fullname = fullname;
        this.email = email;
        this.password = password;
        this.role = role;
    }

}