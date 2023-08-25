import Exception from "./exception";

export default class InvalidValueException extends Exception {
  constructor() {
    super("Invalid Value Error", "Invalid Value Error", 422);
  }
}
