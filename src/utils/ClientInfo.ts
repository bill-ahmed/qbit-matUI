interface CookieInfo {
  SIDKey: string
}

export function GetCookieInfo(): CookieInfo {
  return {SIDKey: "SID"}
}