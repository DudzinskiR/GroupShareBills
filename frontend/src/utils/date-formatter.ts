class DateFormatter {
  private date;
  private dateSeparator = "-";
  private hourSeparator = ":";

  constructor(date: Date) {
    this.date = date;
  }

  public setDate(date: Date) {
    this.date = date;
  }

  public setDateSeparator(dateSeparator: string) {
    this.dateSeparator = dateSeparator;
  }

  public setHourSeparator(hourSeparator: string) {
    this.hourSeparator = hourSeparator;
  }

  public ddMMyyy() {
    const day = this.date.getDate();
    const month = this.date.getMonth() + 1;
    const year = this.date.getFullYear();

    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    return `${formattedDay}${this.dateSeparator}${formattedMonth}${this.dateSeparator}${year}`;
  }

  public ddMMyyyHHmm() {
    const formattedDate = this.ddMMyyy();

    const hours = this.date.getHours();
    const minutes = this.date.getMinutes();

    const formattedHour = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedDate} ${formattedHour}${this.hourSeparator}${formattedMinutes}`;
  }
}

export default DateFormatter;
