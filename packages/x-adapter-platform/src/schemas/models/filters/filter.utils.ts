/**
 * Maps a `min-max` string to a range.
 *
 * @param value - The range as a string, like `10-20` or `*-20`.
 * @returns The range with `null` in its open boundaries.
 * @internal
 */
export function mapRange(value: string | undefined): { min: number | null; max: number | null } {
  const boundaries = (value as string).split('-')
  const min = Number(boundaries[0])
  const max = Number(boundaries[1])
  return {
    min: Number.isNaN(min) ? null : min,
    max: Number.isNaN(max) ? null : max,
  }
}
