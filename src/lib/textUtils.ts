export const cutText = (text: string, n = 20): string => {
  if (text.length < n) return text;
  return `${text.substring(0, n)}...`;
};
