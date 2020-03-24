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

    return "ERROR -- Too large";
  }

  /** Get string representation of a given number of seconds
  * @param seconds The time elapsed, in seconds.
  */
  public GetSecondsString(seconds: number): string {

    interface TimeNotation {
        seconds: number,
        type: string
    }

    const S = {seconds: 1, type: "Second"};
    const M = {seconds: 60, type: "Minute"};
    const H = {seconds: 3600, type: "Hour"};
    const D = {seconds: 86400, type: "Day"};
    const W = {seconds: 604800, type: "Week"};

    let result = "";
    let time_intervals = [W, D, H, M, S];

    time_intervals.forEach((elem: TimeNotation) => {
        let count = 0;
        while(seconds > elem.seconds) {
          seconds -= elem.seconds;
          count += 1;
        }
        if(count > 0){
          result += ` ${count} ${elem.type}`
          if(count > 1){
            result += `s,`
          } else {
            result += `,`
          }
            
        }
    })

    result = result === "" ? "∞" : result;

    return result;
  }

  /** Get the date representation of a timestamp
   * @param timestamp Number of seconds since epoch.
   */
  GetDateString(timestamp: number): string {
    let date = new Date(timestamp * 1000);
    let result = 
    `${this.getDay(date)}/${this.getMonth(date)}/${date.getFullYear()}, 
    ${this.getHours(date)}:${this.getMinutes(date)}:${this.getSeconds(date)}`;

    return result;
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
    return (date.getHours()) < 10 ? `0${date.getHours()}` : `${date.getHours()}`
  }
}
