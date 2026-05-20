export const sliceString = (text: string, sliceLength: number) =>
  text.length > sliceLength ? text.slice(0, sliceLength) + "..." : text;
