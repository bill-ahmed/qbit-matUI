import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UnitsHelperService {

  constructor() { }

  /** Get string representation of a file size
   * e.g. 2,560 -> 2.56 KB
   * e.g. 1,572,864 -> 1.57 MB
   */
  public GetFileSizeString(size: number): string {
    if(size < 0) return '∞';
    if(size === undefined || size == null) return 'Unknown';

    const DP = 2;   // Number of fixed decimal places for rounding

    const B = 1;
    const KB = 1024;
    const MB = 1048576;
    const GB = 1073741824;
    const TB = 1099511627776;
    const PB = 1125899906842624;

    const B_s = `${(size / B).toFixed(DP)} B`;
    const KB_s = `${(size / KB).toFixed(DP)} KB`;
    const MB_s = `${(size / MB).toFixed(DP)} MB`;
    const GB_s = `${(size / GB).toFixed(DP)} GB`;
    const TB_s = `${(size / TB).toFixed(DP)} TB`;
    const PB_s = `${(size / PB).toFixed(DP)} PB`;

    if(size < B){
      return B_s;
    }
    if(size < KB){
      return B_s;
    }
    if(size < MB){
      return KB_s;
    }
    if(size < GB){
      return MB_s;
    }
    if(size < TB){
      return GB_s;
    }
    if(size < PB) {
      return TB_s;
    }

    console.error('File size too large to convert:', size);
    return "ERROR -- Too large";
  }

  /** Get string representation of a given number of seconds
  * @param seconds The time elapsed, in seconds.
  */
  public GetSecondsString(seconds: number): string {

    interface TimeNotation {
        seconds: number,
        type: string,
        exclude_plural: boolean,
        exclude_space: boolean,
    }

    const S = {seconds: 1, type: "s", exclude_plural: true, exclude_space: true};
    const M = {seconds: 60, type: "min", exclude_plural: true};
    const H = {seconds: 3600, type: "h", exclude_plural: true, exclude_space: true};
    const D = {seconds: 86400, type: "day"};
    const W = {seconds: 604800, type: "week"};

    let result = "";
    let time_intervals = [W, D, H, M, S];

    time_intervals.forEach((elem: TimeNotation) => {
        let count = 0;
        while(seconds > elem.seconds) {
          seconds -= elem.seconds;
          count += 1;
        }
        if(count > 0){
          result += ` ${count}`
          result += elem.exclude_space ? `` : ` ` // If we don't want space between number and unit, e.g. "5 min" vs. "5min"
          result += `${elem.type}`
          if(count > 1 && !elem.exclude_plural){
            result += `s,`
          } else {
            if(elem.type === "s") { } // Don't add comma at the end of something like "3 days, 4 h, 5 min, 5 s"
            else { result += `,` }

          }

        }
    })

    result = result === "" ? "∞" : result;

    return result;
  }

  /** Get the date representation of a timestamp
   * @param timestamp Number of seconds since epoch.
   */
  public GetDateString(timestamp: number): string {
    let date = new Date(timestamp * 1000);
    let am_pm = date.getHours() > 11 ? 'PM' : 'AM';
    let result =
    `${this.getDay(date)}/${this.getMonth(date)}/${date.getFullYear()},
    ${this.getHours(date)}:${this.getMinutes(date)}:${this.getSeconds(date)} ${am_pm}`;

    return result;
  }

  /** Given a number of kibibits, return the number of bits it represents. */
  public Kibibits_to_bits(kb: number): number {
    return kb * 1024;
  }

  private getDay(date: Date): string {
    return (date.getDate()) < 10 ? `0${date.getDate()}` : `${date.getDate()}`
  }

  private getMonth(date: Date): string {
    return (date.getMonth()+1) < 10 ? `0${date.getMonth()+1}` : `${date.getMonth()+1}`
  }

  private getSeconds(date: Date): string {
    return (date.getSeconds()) < 10 ? `0${date.getSeconds()}` : `${date.getSeconds()}`
  }

  private getMinutes(date: Date): string {
    return (date.getMinutes()) < 10 ? `0${date.getMinutes()}` : `${date.getMinutes()}`
  }

  private getHours(date: Date): string {
    return (date.getHours() % 12) < 10 ? `0${date.getHours() % 12}` : `${date.getHours() % 12}`
  }
}
