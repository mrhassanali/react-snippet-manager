export function countWords(text: string): number {
  const matches = text.match(/\S+/g);
  return matches ? matches.length : 0;
}

export function truncateToMaxWords(text: string, max: number): string {
  if (!text || max <= 0) return text || "";

  const wordRegex = /\S+/g;
  let match: RegExpExecArray | null;
  let count = 0;
  let endIndex = text.length;

  while ((match = wordRegex.exec(text)) !== null) {
    count++;
    if (count > max) {
      endIndex = match.index;
      break;
    }
  }

  if (count <= max) return text;

  return text.slice(0, endIndex).replace(/\s+$/, "");
}

export function enforceWordLimit(previous: string, next: string, max: number): string {
  const previousCount = countWords(previous);
  const nextCount = countWords(next);

  // Already at limit: reject edits that add words (keep middle typo fixes)
  if (previousCount >= max && nextCount > previousCount) {
    return previous;
  }

  // Already at limit: reject appending at the very end
  if (previousCount >= max && next.length > previous.length && next.startsWith(previous)) {
    return previous;
  }

  // Below limit: cap bulk input (e.g. paste)
  if (nextCount > max) {
    return truncateToMaxWords(next, max);
  }

  return next;
}
