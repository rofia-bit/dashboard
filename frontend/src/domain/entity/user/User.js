import js from "@eslint/js";

export class User {

    constructor(
        email ,
        fullName ,
        imageUrl ,
        role ,
        userId
    ) {
        this.email = email;
        this.fullName = fullName;
        this.imageUrl = imageUrl;
        this.role = role;
        this.userId = userId;
    }

    static fromJson(json) {
        return new User(
            json.email ,
            json.fullName ,
            json.imageUrl ,
            json.role ,
            json.userId ,
        );
    }


}
