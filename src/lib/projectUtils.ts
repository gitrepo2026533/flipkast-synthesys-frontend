import { convertFromRaw, EditorState } from "draft-js";
import { Block } from "../components/Editor/Editor";

export const dataToState = (data: any) => {
  const blocks = data.reduce((acc: any, block: any, index: number, inital: any) => {
    let timer = null;
    const key = Math.random().toString(16).slice(2).slice(0, 5);

    acc.push(
      new Block({
        key,
        text: block.text,
        inlineStyles: block.features.reduce((featureAcc: any, feature: any) => {
          if (feature.key === "pause") {
            timer = feature.value;
            return featureAcc;
          }

          featureAcc.push({
            offset: 0,
            length: block.text.length,
            style: feature.key + "_" + feature.value,
          });

          return featureAcc;
        }, []),
      }),
    );

    const timerKey = Math.random().toString(16).slice(2).slice(0, 5);
    let timerText = "0.1s";

    if (timer) {
      timerText = timer + "s";

      acc.push(
        new Block({
          key: timerKey,
          text: timerText,
          inlineStyles: [{ offset: 0, length: timerText.length, style: "pause" }],
        }),
      );
    } else if (index < inital.length - 1) {
      acc.push(
        new Block({
          key: timerKey,
          text: timerText,
          inlineStyles: [{ offset: 0, length: timerText.length, style: "pause" }],
        }),
      );
    }

    return acc;
  }, []);

  const isLastBlockPause = blocks[blocks.length - 1]?.inlineStyleRanges.find((inline: any) => inline.style === "pause");

  if (isLastBlockPause) {
    blocks.push(
      new Block({
        key: Math.random().toString(16).slice(2).slice(0, 5),
        text: "",
        inlineStyles: [],
      }),
    );
  }

  return EditorState.createWithContent(
    convertFromRaw({
      blocks,
      entityMap: {},
    }),
  );
};
