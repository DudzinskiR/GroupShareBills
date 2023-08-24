import Exception from "./exception";

export default class BillNotFoundException extends Exception {
  constructor() {
    super("Bill not found", "No found bill with this ID", 404);
  }
}
