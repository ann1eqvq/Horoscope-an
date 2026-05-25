/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export class SeededRNG {
  private seed: number;

  constructor(seedStr: string) {
    this.seed = this.hashString(seedStr);
  }

  private hashString(str: string): number {
    let hash = 1779033703 ^ str.length;
    for (let i = 0; i < str.length; i++) {
        hash = Math.imul(hash ^ str.charCodeAt(i), 3432918353);
        hash = (hash << 13) | (hash >>> 19);
    }
    return (hash >>> 0) || 123456789;
  }

  /**
   * Returns a pseudo-random float between 0 and 1
   */
  public next(): number {
    // Standard high-quality hash iteration
    const x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }

  /**
   * Returns a pseudo-random integer in [min, max] (inclusive)
   */
  public nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  /**
   * Randomly picks an item from an array
   */
  public pick<T>(arr: T[]): T {
    if (arr.length === 0) throw new Error("Cannot pick from empty array");
    const index = this.nextInt(0, arr.length - 1);
    return arr[index];
  }

  /**
   * Randomly picks `count` unique items from an array
   */
  public pickMultiple<T>(arr: T[], count: number): T[] {
    const shuffled = [...arr];
    const n = shuffled.length;
    const actualCount = Math.min(count, n);
    for (let i = 0; i < actualCount; i++) {
      const j = this.nextInt(i, n - 1);
      const temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    return shuffled.slice(0, actualCount);
  }
}

/**
 * Gets a seed string based on a date in "YYYY-MM-DD" format
 */
export function getSeedForDate(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
