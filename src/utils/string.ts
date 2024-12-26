export class String {
  static isEmptyString(str: string) {
    if (str.trim().length === 0) {
      return null
    } else {
      return str
    }
  }
}
