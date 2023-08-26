import Exception from "./exception";

export default class PaymentNotFoundException extends Exception {
  constructor() {
    super("Payment not found", "No found payment with this ID", 404);
  }
}
