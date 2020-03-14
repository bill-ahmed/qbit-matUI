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
  GetFileSizeString(size: number): string {
    const DP = 2;   // Number of fixed decimal places for rounding

    const B = 1;
    const KB = 1024;
    const MB = 1048576;
    const GB = 1073741824;
    const TB = 1099511627776;

    const B_s = `${(size / B).toFixed(DP)} B`;
    const KB_s = `${(size / KB).toFixed(DP)} KB`;
    const MB_s = `${(size / MB).toFixed(DP)} MB`;
    const GB_s = `${(size / GB).toFixed(DP)} GB`;
    const TB_s = `${(size / TB).toFixed(DP)} TB`;

    let result = `${size} B`;

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

    return "ERROR -- Could not too large";
  }

  /** Get string representation of a given number of seconds
  * @param seconds The time elapsed, in seconds.
  */
  GetSecondsString(seconds: number): string {
    interface TimeNotation{
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
}
