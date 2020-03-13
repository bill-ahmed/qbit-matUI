/** Get string representation of a file size
 * e.g. 2,560 -> 2.56 KB
 * e.g. 1,572,864 -> 1.57 MB
 */
export function GetFileSizeString(size: number): string {
    const DP = 2;   // Number of fixed decimal places for rounding

    const B = 1;
    const KB = 1024;
    const MB = 1048576;
    const GB = 1073741824;

    const B_s = `${(size / B).toFixed(DP)} B`;
    const KB_s = `${(size / KB).toFixed(DP)} KB`;
    const MB_s = `${(size / MB).toFixed(DP)} MB`;
    const GB_s = `${(size / GB).toFixed(DP)} GB`;

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

    return "ERROR -- Could not too large";
}