import Exception from "./exception";

export default class DatabaseException extends Exception {
  constructor() {
    super("Database Error", "Problem with Database", 500);
  }
}
