import "draft-js/dist/Draft.css";
import "./Editor.css";

import React, { useCallback, useEffect, useRef } from "react";
import { convertFromRaw, convertToRaw, DraftInlineStyleType, Editor, EditorState, SelectionState } from "draft-js";
import { setInlineStyle } from "../../lib/setInlineStyle";
import { toast } from "react-toastify";
import { throttle } from "lodash";

import styled from "styled-components";

export class Block {
  data: any;
  depth: number;
  entityRanges: any;
  inlineStyleRanges: any;
  key: any;
  text: any;
  type: any;

  constructor({ key, text, inlineStyles }: any) {
    this.data = {};
    this.depth = 0;
    this.entityRanges = [];
    this.inlineStyleRanges = inlineStyles;
    this.key = key;
    this.text = text;
    this.type = "unstyled";
  }
}

export const styleGenerator: any = {
  TONE_TONEA: {
    styles: {
      backgroundImage: "url('https://app.typecast.ai/icons/style-mark-tonedown-1.svg')",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingLeft: "55px",
      backgroundSize: "auto 90%",
      backgroundPosition: "0% 1px, 45px 1px",
      lineHeight: "28px",
    },
  },
  TONE_TONEB: {
    styles: {
      backgroundImage: "url('https://app.typecast.ai/icons/style-mark-tonedown-2.svg')",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingLeft: "55px",
      backgroundSize: "auto 90%",
      backgroundPosition: "0% 1px, 45px 1px",
      lineHeight: "28px",
    },
  },
  "speed_0.5": {
    styles: {
      backgroundColor: "#FFE4C4",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/plus0.5.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "40px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 1px, 0 1px",
    },
  },
  "speed_0.75": {
    styles: {
      backgroundColor: "#FFE4C4",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/plus0.75.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "45px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 1px, 0 1px",
    },
  },
  speed_1: {
    styles: {
      backgroundColor: "#FFE4C4",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/plus1.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "27px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 1px, 0 1px",
    },
  },
  "speed_1.25": {
    styles: {
      backgroundColor: "#FFE4C4",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/plus1.25.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "42px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 1px, 0 1px",
    },
  },
  "speed_1.5": {
    styles: {
      backgroundColor: "#FFE4C4",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/plus1.5.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "35px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 1px, 0 1px",
    },
  },
  "pitch_0.5": {
    styles: {
      backgroundColor: "#A9F4EB",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/pitch0.5.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "30px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 1px, 0 1px",
    },
  },
  "pitch_0.6": {
    styles: {
      backgroundColor: "#A9F4EB",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/pitch0.6.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "30px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 1px, 0 1px",
    },
  },
  "pitch_0.7": {
    styles: {
      backgroundColor: "#A9F4EB",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/pitch0.7.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "30px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 1px, 0 1px",
    },
  },
  "pitch_0.8": {
    styles: {
      backgroundColor: "#A9F4EB",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/pitch0.8.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "30px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 1px, 0 1px",
    },
  },
  "pitch_0.9": {
    styles: {
      backgroundColor: "#A9F4EB",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/pitch0.9.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "30px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 1px, 0 1px",
    },
  },
  pitch_1: {
    styles: {
      backgroundColor: "#A9F4EB",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/pitch1.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "17px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 1px, 0 1px",
    },
  },
  "pitch_1.1": {
    styles: {
      backgroundColor: "#A9F4EB",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/pitch1.1.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "25px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 1px, 0 1px",
    },
  },
  "pitch_1.2": {
    styles: {
      backgroundColor: "#A9F4EB",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/pitch1.2.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "25px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 1px, 0 1px",
    },
  },
  "pitch_1.3": {
    styles: {
      backgroundColor: "#A9F4EB",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/pitch1.3.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "25px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 1px, 0 1px",
    },
  },
  "pitch_1.4": {
    styles: {
      backgroundColor: "#A9F4EB",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/pitch1.4.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "25px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 1px, 0 1px",
    },
  },
  "pitch_1.5": {
    styles: {
      backgroundColor: "#A9F4EB",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/pitch1.5.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "25px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 1px, 0 1px",
    },
  },
  "pitch_1.6": {
    styles: {
      backgroundColor: "#A9F4EB",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/pitch1.6.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "25px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 1px, 0 1px",
    },
  },
  "pitch_1.7": {
    styles: {
      backgroundColor: "#A9F4EB",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/pitch1.7.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "25px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 1px, 0 1px",
    },
  },
  "pitch_1.8": {
    styles: {
      backgroundColor: "#A9F4EB",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/pitch1.8.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "25px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 1px, 0 1px",
    },
  },
  "pitch_1.9": {
    styles: {
      backgroundColor: "#A9F4EB",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/pitch1.9.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "25px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 1px, 0 1px",
    },
  },
  pitch_2: {
    styles: {
      backgroundColor: "#A9F4EB",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/pitch2.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "22px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 1px, 0 1px",
    },
  },
  style_General: {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/general.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "55px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  style_Assistant: {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/assistant.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "60px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  style_Chat: {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/chat.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "37px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  style_Customerservice: {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/customerService.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "105px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  style_Newscast: {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/newscast.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "65px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  style_Angry: {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/angry.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "45px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  style_Cheerful: {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/cheerful.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "60px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  style_Sad: {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/sad.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "35px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  style_Excited: {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/excited.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "51px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  style_Friendly: {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/friendly.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "55px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  style_Terrified: {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/terrified.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "55px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  style_Shouting: {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/shouting.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "61px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  style_Unfriendly: {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/unfriendly.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "67px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  style_Whispering: {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/whispering.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "73px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  style_Hopeful: {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/hopeful.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "55px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  "style_Narration-professional": {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/narration-professional.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "125px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  "style_Newscast-casual": {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/newscast-casual.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "100px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  "style_Newscast-formal": {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/newscast-formal.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "100px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  style_Empathetic: {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/empathetic.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "70px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  "style_Documentary-narration": {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/documentarynarration.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "130px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  "style_Sports-commentary-excited": {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/sportscommentaryexcited.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "155px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  "style_Sports-commentary": {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/sportscommentary.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "115px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  "style_Advertisement-upbeat": {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/advertisementupbeat.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "125px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  "style_Narration-relaxed": {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/narration-relaxed.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "100px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  style_Envious: {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/envious.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "50px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  style_Depressed: {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/depressed.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "65px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  style_Embarrassed: {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/embarrassed.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "80px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  style_Serious: {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/serious.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "50px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  style_Calm: {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/calm.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "40px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  style_Affectionate: {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/affectionate.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "75px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  style_Disgruntled: {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/disgruntled.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "75px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  style_Fearful: {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/fearful.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "50px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  style_Gentle: {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/gentle.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "45px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
  style_Lyrical: {
    styles: {
      backgroundColor: "#B3D866",
      borderRadius: "8px",
      backgroundImage: "url('/images/editor/lyrical.png')",
      color: "#191B1F",
      backgroundRepeat: "no-repeat, no-repeat",
      paddingRight: "45px",
      backgroundSize: "auto 90%",
      backgroundPosition: "100% 2px, 0 2px",
    },
  },
};

function RichEditorExample({
  index,
  data,
  projectId,
  route,
  setFeatureActive,
  editorContent,
  setEditorContent,
  handleTextParagraph,
  lastSel,
  setLastSel,
  addParagraph,
  paragraphs,
  styleMap,
}: any) {
  const editorRef = useRef<Editor | null>(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (editorContent.getSelection().getHasFocus()) {
      setLastSel(editorContent.getSelection());
    }
  }, [editorContent.getSelection().getHasFocus()]);

  const debouncedToast = useCallback(
    throttle(() => {
      toast.error("For optimal results sentence can’t be more than 200 characters.");
    }, 1000),
    [],
  );

  const splitByTimer = (blocks: any[], key: any): any[] => {
    const index = blocks.findIndex((block) => block.key === key);
    const joinedBlock = {
      data: {},
      depth: 0,
      entityRanges: [],
      inlineStyleRanges: [] as any[],
      key: "",
      text: "",
      type: "unstyled",
    };

    joinedBlock.text = blocks[index - 1].text + blocks[index + 1].text;
    joinedBlock.key = blocks[index + 1].key;

    const finalStyles: Record<string, string> = {};
    blocks[index + 1].inlineStyleRanges.forEach((inline: any) => {
      const [key, value]: [string, string] = inline.style.split("_");

      finalStyles[key] = value;
    });

    blocks[index - 1].inlineStyleRanges.forEach((inline: any) => {
      const [key, value]: [string, string] = inline.style.split("_");

      finalStyles[key] = value;
    });

    joinedBlock.inlineStyleRanges = Object.entries(finalStyles).map((style) => ({
      offset: 0,
      length: joinedBlock.text.length,
      style: `${style[0]}_${style[1]}`,
    }));

    const result = [...blocks.slice(0, index - 1), joinedBlock, ...blocks.slice(index + 2, blocks.length)];
    const emptySel = SelectionState.createEmpty(joinedBlock.key);
    const generatedSel = emptySel.merge({
      focusOffset: blocks[index - 1].text.length,
      anchorOffset: blocks[index - 1].text.length,
    });

    return [result, generatedSel];
  };

  const handleEditorChange = (state: any) => {
    let content: any = convertToRaw(state.getCurrentContent());
    let blocks = content.blocks;
    let selection: any = state.getSelection();
    const selectionKey = state.getSelection().getAnchorKey();
    const element = content.blocks.find((element: { key: any }) => element.key === selectionKey);

    const activeFeatures = blocks.findIndex((block: any) => block.key === selectionKey);
    setFeatureActive(activeFeatures);

    content.blocks = blocks.map((block: { inlineStyleRanges: any[] }) => ({
      ...block,
      inlineStyleRanges: block.inlineStyleRanges.filter((inline) => inline.style !== "isActive_active"),
    }));

    const prev = editorContent.getCurrentContent();
    const next = state.getCurrentContent();
    let notActive = false;
    const prevHigher = JSON.stringify(prev).length > JSON.stringify(next).length;
    const nextHigher = JSON.stringify(prev).length < JSON.stringify(next).length;

    if (nextHigher && element.text.length > 200) {
      setEditorContent(EditorState.forceSelection(editorContent, editorContent.getSelection()));
      setLastSel(editorContent.getSelection());
      debouncedToast();
      return;
    }

    if (
      nextHigher &&
      !blocks[blocks.length - 1].text &&
      !blocks[blocks.length - 2].text &&
      index === paragraphs?.length - 1
    ) {
      setEditorContent(editorContent);
      addParagraph((paragraphs?.length as number) + 1);
      return;
    }

    if (
      (prevHigher && element.inlineStyleRanges.length && element.inlineStyleRanges[0].style === "pause") ||
      (JSON.stringify(prev) === JSON.stringify(next) &&
        element.inlineStyleRanges.length &&
        element.inlineStyleRanges[0].style === "pause") ||
      (!editorContent.getSelection()?.getHasFocus() && state.getSelection()?.getHasFocus())
    ) {
      notActive = true;
    }
    let content2 = convertToRaw(editorContent.getCurrentContent());

    if (prevHigher && element.inlineStyleRanges.length && element.inlineStyleRanges[0].style === "pause") {
      const [newBlocks, newSel] = splitByTimer(content2.blocks, selectionKey);
      content.blocks = newBlocks;
      selection = newSel;
    }

    if (!notActive) {
      content = setInlineStyle(content, selectionKey, { isActive: "active" });
      content.blocks = content.blocks.reduce((acc: any, item: any, index: any, inital: any) => {
        acc.push(item);
        const next = inital[index + 1];
        if (
          !next ||
          (next && next.inlineStyleRanges.find((inline: { style: string }) => inline.style === "pause")) ||
          item.inlineStyleRanges.find((inline: { style: string }) => inline.style === "pause")
        ) {
          return acc;
        }

        acc.push({
          key: Math.random().toFixed(3),
          text: "0.1s",
          type: "unstyled",
          depth: 0,
          inlineStyleRanges: [{ offset: 0, length: 4, style: "pause" }],
          data: {},
          entityRanges: [],
        });
        return acc;
      }, []);
    }

    let newEditorState;

    if (state.getSelection().getHasFocus()) {
      setLastSel(selection);
      newEditorState = EditorState.forceSelection(EditorState.createWithContent(convertFromRaw(content)), selection);
    } else {
      content.blocks = blocks.map((block: { inlineStyleRanges: any[] }) => ({
        ...block,
        inlineStyleRanges: block.inlineStyleRanges.filter((inline) => inline.style !== "isActive_active"),
      }));

      newEditorState = EditorState.createWithContent(convertFromRaw(content));
    }
    setEditorContent(newEditorState);
  };

  const stateToData = (state: any) => {
    let content = convertToRaw(state.getCurrentContent());
    let blocks = content.blocks;
    const resultData = [];

    for (let i = 0; i < blocks.length; i += 2) {
      blocks[i].inlineStyleRanges = blocks[i].inlineStyleRanges.filter(
        (inline: { style: string | string[] }) => !inline.style.includes("ACTIVE"),
      );

      resultData.push({
        text: blocks[i].text,
        features: [
          {
            key: "pause",
            value: i >= blocks.length - 1 ? "" : blocks[i + 1].text.replace("s", ""),
          },
          ...blocks[i].inlineStyleRanges
            .filter(
              (inline) =>
                inline.style !== ("isLoading_loading" as DraftInlineStyleType) &&
                inline.style !== ("isGenerated_generated" as DraftInlineStyleType),
            )
            .map((inline: any) => {
              let [key, value] = inline.style.split("_");
              if (key === "speed") value = value.replace("X", "");
              return { key, value };
            }),
        ],
      });
    }
    const filteredData = resultData.map((result) => ({
      ...result,
      features: result.features.filter(({ key, value }) => value !== ""),
    }));
    return filteredData;
  };

  useEffect(() => {
    handleTextParagraph(stateToData(editorContent));
  }, [editorContent]);

  return (
    <>
      <RichEditor className={"RichEditorContainer"}>
        <div ref={wrapperRef} className={"RichEditor-editor"}>
          <Editor
            ref={editorRef}
            customStyleMap={styleMap}
            editorState={editorContent}
            onChange={handleEditorChange}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            formatPastedText={(text: string) => {
              const signs = text
                .split("")
                .filter((letter, index, textInital) => letter.match(/[.!?:;]/) && textInital[index - 1] !== letter);
              console.log(123213, text, signs);
              const createdBlocks = text
                .split(/[.!?:;]/)
                .filter((word) => !!word && word !== "\n")
                .reduce((acc: any, text, index, inital) => {
                  acc.push(
                    new Block({
                      key: Math.random().toString(16).slice(2).slice(0, 5),
                      text: text.trim() + (signs[index] ? signs[index] : ""),
                      inlineStyles: [],
                    }),
                  );

                  if (inital[index + 1]) {
                    const timerText = "0.1s";
                    acc.push(
                      new Block({
                        key: Math.random().toString(16).slice(2).slice(0, 5),
                        text: timerText,
                        inlineStyles: [{ offset: 0, length: timerText.length, style: "pause" }],
                      }),
                    );
                  }

                  return acc;
                }, []);

              let { blocks } = convertToRaw(editorContent.getCurrentContent());
              const selectedKey = editorContent.getSelection().getAnchorKey();
              const index = blocks.findIndex((element) => element.key === selectedKey);
              const timerText = "0.1s";
              let prevBlocks = blocks.slice(0, index + 1);

              if (prevBlocks.length > 1 || (prevBlocks[0] && prevBlocks[0].text.trim())) {
                prevBlocks.push(
                  new Block({
                    key: Math.random().toString(16).slice(2).slice(0, 5),
                    text: timerText,
                    inlineStyles: [{ offset: 0, length: timerText.length, style: "pause" }],
                  }),
                );
              } else {
                prevBlocks = [];
              }
              const nextBlocks = blocks.slice(index + 1, blocks.length);

              const finalBlocks = [...prevBlocks, ...createdBlocks, ...nextBlocks];
              const finalSel = lastSel
                .set("anchorKey", createdBlocks[createdBlocks.length - 1].key)
                .set("anchorOffset", createdBlocks[createdBlocks.length - 1].text.length);

              setEditorContent(
                EditorState.forceSelection(
                  EditorState.createWithContent(convertFromRaw({ blocks: finalBlocks, entityMap: {} })),
                  finalSel,
                ),
              );

              return undefined;
            }}
            onCut={(_, e) => {
              e.preventDefault();
              return false;
            }}
          />
        </div>
      </RichEditor>
    </>
  );
}

const RichEditor = styled.div`
  .RichEditor-editor
    .DraftEditor-root
    .DraftEditor-editorContainer
    .public-DraftEditor-content
    div
    div:nth-child(odd)
    div
    > span {
    color: ${({ theme }) => theme.primaryText};
  }
`;

export default RichEditorExample;
