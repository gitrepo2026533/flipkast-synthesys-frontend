export const diffDays = (date?: string) => {
  const time: any = new Date(date + "Z");
  const today: any = new Date();
  const diffTime = Math.abs(today - time);

  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
