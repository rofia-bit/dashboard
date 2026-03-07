export class User {

    constructor(
        email ,
        fullname ,
        imageUrl ,
        role ,
        userId
    ) {
        this.email = email;
        this.fullname = fullname;
        this.imageUrl = imageUrl;
        this.role = role;
        this.userId = userId;
    }

    static fromJson(json) {
        return new User(
            json.email ,
            json.fullname ,
            json.imageUrl ,
            json.role ,
            json.userId ,
        );
    }


}
