import Exception from "./exception";

export default class UserNotFoundException extends Exception {
  constructor() {
    super("User not found", "No found user with this ID", 404);
  }
}
