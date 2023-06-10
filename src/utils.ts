export const compactNumberFormatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
    maximumSignificantDigits: 2,
});

export function makeStars(score: number): string {
    const left = Math.round(score)
    const right = 5 - left
    return ('★').repeat(left) + ('☆').repeat(right)
}
