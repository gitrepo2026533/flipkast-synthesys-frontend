import { intervalToDuration, formatDuration } from "date-fns";

export const formatNumberToDuration = (duration: number) => {
  const durationRight = intervalToDuration({ start: 0, end: duration * 1000 });

  const zeroPad = (num: number) => String(num).padStart(2, "0");

  const formatted = formatDuration(durationRight, {
    format: ["minutes", "seconds"],
    zero: true,
    delimiter: ":",
    locale: {
      formatDistance: (_token, count) => zeroPad(count),
    },
  });

  return formatted;
};
