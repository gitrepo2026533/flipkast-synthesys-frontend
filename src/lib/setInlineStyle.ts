import { RawDraftContentState } from "draft-js";

export const setInlineStyle = (
  convertedObject: { blocks: any[] },
  keyIndex: any,
  newStyles: { [s: string]: unknown } | ArrayLike<unknown>,
): RawDraftContentState => {
  const element = convertedObject.blocks.find((element) => element.key === keyIndex);
  const [key, value]: any = Object.entries(newStyles)[0];

  element.inlineStyleRanges = element.inlineStyleRanges.filter(
    (inline: { style: string }) => inline.style.split("_")[0] !== key,
  );

  element.inlineStyleRanges.push({
    offset: 0,
    length: element.text.length,
    style: key + "_" + value,
  });

  element.inlineStyleRanges = element.inlineStyleRanges.reduce((acc: any[], inline: { style: string | string[] }) => {
    if (!inline.style.includes("pause") && !!inline.style && !acc.find((el) => el.style === inline.style))
      acc.push(inline);
    return acc;
  }, []);

  return convertedObject as RawDraftContentState;
};
