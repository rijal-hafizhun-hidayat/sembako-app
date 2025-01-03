export class Format {
  static combinationArrToNum(value: (string | number)[]): number[] {
    // Combination of strings and numbers
    const numberArray = value
      .map((item) => (typeof item === 'string' ? Number(item) : item)) // Convert strings to numbers
      .filter((num) => typeof num === 'number' && !isNaN(num)) // Remove invalid entries

    return numberArray
  }
}
