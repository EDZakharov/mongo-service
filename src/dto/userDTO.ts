export default class UserDTO {
    id;
    email;
    password;
    username;
    role;
    name;
    updateAt;
    createAt;

    constructor(model: any) {
        this.id = model._id;
        this.email = model.email;
        this.password = model.password;
        this.username = model.username;
        this.role = model.role;
        this.name = model.name;
        this.updateAt = model.updateAt;
        this.createAt = model.createAt;
    }
}
