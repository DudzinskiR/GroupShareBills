export default class Exception extends Error {
  public name: string = "";
  public code: number = 0;

  constructor(name: string, message: string, code: number) {
    super(message);
    this.name = name;
    this.code = code;
  }

  public toString = (): string => {
    return `[${this.name}] ${this.message} (Code: ${this.code})`;
  };
}
