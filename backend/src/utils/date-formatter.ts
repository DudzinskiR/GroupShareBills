import { Timestamp } from "interfaces/Timestamp";

class DateFormatter {
  static ddMMyy(date: Date | Timestamp): string {
    if (!(date instanceof Date)) {
      date = new Date(date.seconds * 1000);
    }

    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}-${formattedMonth}-${year}`;
  }

  static toDate(date: string): Date {
    const [day, month, year] = date.split("-");
    return new Date(`${year}-${month}-${day}T00:00:00.000Z`);
  }
}

export default DateFormatter;
