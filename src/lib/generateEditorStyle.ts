export const generateEditorStyle = (text: string, color: string) => {
  const DEFAULT_PADDING = 40;
  const WIDTH_PER_LETTER = 35;
  const BACKGROUND_PADDING_PER_LETTER = 10;
  const DISTANCE_TO_WORD = 5;

  const width = Math.max(text.length, 2) * WIDTH_PER_LETTER + DEFAULT_PADDING;
  const backgroundPadding = Math.max(text.length, 2) * BACKGROUND_PADDING_PER_LETTER;

  return {
    // backgroundImage: "url('/images/editor/loading.gif')",
    backgroundImage: `url("data:image/svg+xml,%3Csvg preserveAspectRatio='none' height='100%25' viewBox='0 0 ${width} 103' fill='none' xmlns='http://www.w3.org/2000/svg' %3E%3Crect width='${width}' height='103' rx='30' fill='${color.replace(
      "#",
      "%23",
    )}' /%3E%3Ctext id='textid' textAnchor='middle' textLength='${
      width - DEFAULT_PADDING
    }' font-size='60' font-weight='500' font-family='Monospace' x='${
      text.length < 2 ? 36 : 20
    }' y='70' fill='white'%3E ${text} %3C/text%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat, no-repeat",
    paddingRight: backgroundPadding + DISTANCE_TO_WORD + "px",
    backgroundSize: backgroundPadding + "px 90%",
    backgroundPosition: "100% 2px, 0 2px",
  };
};
