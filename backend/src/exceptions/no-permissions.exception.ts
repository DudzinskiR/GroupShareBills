import Exception from "./exception";

export default class NoPermissionException extends Exception {
  constructor() {
    super("No Permission", "Unauthorized access", 403);
  }
}
