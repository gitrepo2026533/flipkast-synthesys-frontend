import { IHuman, ProfileHumanSidebarType } from "../types/human";

export const humans: IHuman[] = [
  {
    id: 0,
    imageSrc: "/images/human.png",
    flagSrc: "/images/flag.png",
    name: "Steave M.",
  },
  {
    id: 1,
    imageSrc: "/images/human.png",
    flagSrc: "/images/flag.png",
    name: "Steave M.",
  },
  {
    id: 2,
    imageSrc: "/images/human.png",
    flagSrc: "/images/flag.png",
    name: "Steave M.",
  },
  {
    id: 3,
    imageSrc: "/images/human.png",
    flagSrc: "/images/flag.png",
    name: "Steave M.",
  },
  {
    id: 4,
    imageSrc: "/images/human.png",
    flagSrc: "/images/flag.png",
    name: "Steave M.",
  },
  {
    id: 5,
    imageSrc: "/images/human.png",
    flagSrc: "/images/flag.png",
    name: "Steave M.",
  },
  {
    id: 6,
    imageSrc: "/images/human.png",
    flagSrc: "/images/flag.png",
    name: "Steave M.",
  },
  {
    id: 7,
    imageSrc: "/images/human.png",
    flagSrc: "/images/flag.png",
    name: "Steave M.",
  },
  {
    id: 8,
    imageSrc: "/images/human.png",
    flagSrc: "/images/flag.png",
    name: "Steave M.",
  },
];

export enum BackgroundProps {
  IMAGE = "Image",
  VIDEO = "Video",
  UPLOAD = "Upload",
}

// export const sidebar = [
//   {
//     type: BackgroundProps.IMAGE,
//     data: [
//       { id: 1, image: "/images/mock.png" },
//       { id: 2, image: "/images/mock.png" },
//       { id: 3, image: "/images/mock.png" },
//       { id: 4, image: "/images/mock.png" },
//       { id: 5, image: "/images/mock.png" },
//       { id: 6, image: "/images/mock.png" },
//       { id: 7, image: "/images/mock.png" },
//       { id: 8, image: "/images/mock.png" },
//       { id: 9, image: "/images/mock.png" },
//       { id: 10, image: "/images/mock.png" },
//       { id: 11, image: "/images/mock.png" },
//       { id: 12, image: "/images/mock.png" },
//     ],
//   },
//   {
//     type: BackgroundProps.VIDEO,
//     data: [
//       { id: 1, video: "/images/mock.png" },
//       { id: 2, video: "/images/mock.png" },
//       { id: 3, video: "/images/mock.png" },
//       { id: 4, video: "/images/mock.png" },
//       { id: 5, video: "/images/mock.png" },
//       { id: 6, video: "/images/mock.png" },
//       { id: 7, video: "/images/mock.png" },
//       { id: 8, video: "/images/mock.png" },
//       { id: 9, video: "/images/mock.png" },
//       { id: 10, video: "/images/mock.png" },
//       { id: 11, video: "/images/mock.png" },
//       { id: 12, video: "/images/mock.png" },
//     ],
//   },
//   {
//     type: BackgroundProps.COLOR,
//     data: [
//       { id: 1, background: "green" },
//       { id: 2, background: "red" },
//       { id: 3, background: "yellow" },
//       { id: 4, background: "blue" },
//       { id: 5, background: "black" },
//       { id: 6, background: "pink" },
//       { id: 7, background: "orange" },
//       { id: 8, background: "brown" },
//       { id: 9, background: "azure" },
//       { id: 10, background: "cyan" },
//       { id: 11, background: "khaki" },
//       { id: 12, background: "navy" },
//     ],
//   },
// ];

export const sidebar = [
  {
    type: ProfileHumanSidebarType.Background,
    data: [
      {
        type: BackgroundProps.IMAGE,
        data: [
          { id: 1, image: "/images/mock.png" },
          { id: 2, image: "/images/mock.png" },
          { id: 3, image: "/images/mock.png" },
          { id: 4, image: "/images/mock.png" },
          { id: 5, image: "/images/mock.png" },
          { id: 6, image: "/images/mock.png" },
          { id: 7, image: "/images/mock.png" },
          { id: 8, image: "/images/mock.png" },
          { id: 9, image: "/images/mock.png" },
          { id: 10, image: "/images/mock.png" },
          { id: 11, image: "/images/mock.png" },
          { id: 12, image: "/images/mock.png" },
        ],
      },
      {
        type: BackgroundProps.VIDEO,
        data: [
          { id: 1, video: "/images/mock.png" },
          { id: 2, video: "/images/mock.png" },
          { id: 3, video: "/images/mock.png" },
          { id: 4, video: "/images/mock.png" },
          { id: 5, video: "/images/mock.png" },
          { id: 6, video: "/images/mock.png" },
          { id: 7, video: "/images/mock.png" },
          { id: 8, video: "/images/mock.png" },
          { id: 9, video: "/images/mock.png" },
          { id: 10, video: "/images/mock.png" },
          { id: 11, video: "/images/mock.png" },
          { id: 12, video: "/images/mock.png" },
        ],
      },
      {
        type: BackgroundProps.UPLOAD,
      },
    ],
  },
  // {
  //   type: ProfileHumanSidebarType.Templates,
  //   data: [
  //     {
  //       title: "Office",
  //       images: ["/images/office-1.png", "/images/office-2.png", "/images/office-1.png"],
  //     },
  //     {
  //       title: "Adversting",
  //       images: ["/images/adversting-1.png", "/images/adversting-2.png", "/images/adversting-1.png"],
  //     },
  //     {
  //       title: "News",
  //       images: ["/images/news-1.png", "/images/news-2.png", "/images/news-1.png"],
  //     },
  //     {
  //       title: "ECommerce",
  //       images: ["/images/office-1.png", "/images/office-2.png", "/images/office-1.png"],
  //     },
  //   ],
  // },
  {
    type: ProfileHumanSidebarType.Text,
  },
  {
    type: ProfileHumanSidebarType.Humatar,
    data: [
      {
        id: 1,
        image: "/images/humatar-1.png",
      },
      {
        id: 2,
        image: "/images/ai-human-pic.png",
      },
      {
        id: 3,
        image: "/images/humatar-2.png",
      },
      {
        id: 4,
        image: "/images/humatar-3.png",
      },
      {
        id: 5,
        image: "/images/humatar-4.png",
      },
      {
        id: 6,
        image: "/images/humatar-5.png",
      },
      {
        id: 7,
        image: "/images/humatar-1.png",
      },
      {
        id: 8,
        image: "/images/ai-human-pic.png",
      },
      {
        id: 9,
        image: "/images/humatar-2.png",
      },
      {
        id: 10,
        image: "/images/humatar-3.png",
      },
      {
        id: 11,
        image: "/images/humatar-4.png",
      },
      {
        id: 12,
        image: "/images/humatar-5.png",
      },
      {
        id: 13,
        image: "/images/humatar-1.png",
      },
      {
        id: 14,
        image: "/images/ai-human-pic.png",
      },
      {
        id: 15,
        image: "/images/humatar-2.png",
      },
      {
        id: 16,
        image: "/images/humatar-3.png",
      },
      {
        id: 17,
        image: "/images/humatar-4.png",
      },
    ],
  },
  {
    type: ProfileHumanSidebarType.Soundtrack,
    data: [
      {
        id: 1,
        title: "Corporate",
        soundtrack: "/audio/audio-1.mp3",
      },
      {
        id: 2,
        title: "Inspiring",
        soundtrack: "/audio/audio-2.mp3",
      },
      {
        id: 3,
        title: "Relaxing",
        soundtrack: "/audio/audio-1.mp3",
      },
      {
        id: 4,
        title: "Inspiring",
        soundtrack: "/audio/audio-1.mp3",
      },
      {
        id: 5,
        title: "Motivation",
        soundtrack: "/audio/audio-1.mp3",
      },
      {
        id: 6,
        title: "Modern",
        soundtrack: "/audio/audio-1.mp3",
      },
      {
        id: 7,
        title: "Happy",
        soundtrack: "/audio/audio-1.mp3",
      },
      {
        id: 8,
        title: "Melanholic",
        soundtrack: "/audio/audio-1.mp3",
      },
      {
        id: 9,
        title: "Relaxing",
        soundtrack: "/audio/audio-1.mp3",
      },
      {
        id: 10,
        title: "Inspiring",
        soundtrack: "/audio/audio-1.mp3",
      },
    ],
  },
  // {
  //   type: ProfileHumanSidebarType.Subtitle,
  //   data: [
  //     {
  //       id: 1,
  //       flag: "/images/flag.png",
  //       country: "English",
  //     },
  //     {
  //       id: 2,
  //       flag: "/images/flag.png",
  //       country: "English",
  //     },
  //     {
  //       id: 3,
  //       flag: "/images/flag.png",
  //       country: "English",
  //     },
  //     {
  //       id: 4,
  //       flag: "/images/flag.png",
  //       country: "English",
  //     },
  //     {
  //       id: 5,
  //       flag: "/images/flag.png",
  //       country: "English",
  //     },
  //     {
  //       id: 6,
  //       flag: "/images/flag.png",
  //       country: "English",
  //     },
  //     {
  //       id: 7,
  //       flag: "/images/flag.png",
  //       country: "English",
  //     },
  //     {
  //       id: 8,
  //       flag: "/images/flag.png",
  //       country: "English",
  //     },
  //     {
  //       id: 9,
  //       flag: "/images/flag.png",
  //       country: "English",
  //     },
  //     {
  //       id: 10,
  //       flag: "/images/flag.png",
  //       country: "English",
  //     },
  //   ],
  // },
  {
    type: ProfileHumanSidebarType.Transitions,
    data: [
      {
        id: 1,
        transitionName: "Fade",
      },
      {
        id: 2,
        transitionName: "Close",
      },
      {
        id: 3,
        transitionName: "Crop",
      },
      {
        id: 4,
        transitionName: "Blur",
      },
      {
        id: 5,
        transitionName: "Open",
      },
      {
        id: 6,
        transitionName: "Slide",
      },
      {
        id: 7,
        transitionName: "Wipe",
      },
      {
        id: 8,
        transitionName: "Smooth",
      },
    ],
  },
  {
    type: ProfileHumanSidebarType.Shapes,
    data: [
      {
        id: 1,
        shapeName: "Circle",
      },
      {
        id: 2,
        shapeName: "Rectangle",
      },
      {
        id: 3,
        shapeName: "Triangle",
      },
      {
        id: 4,
        shapeName: "Polygon",
      },
      {
        id: 5,
        shapeName: "Star",
      },
      {
        id: 6,
        shapeName: "Square",
      },
      {
        id: 7,
        shapeName: "Heart",
      },
      {
        id: 8,
        shapeName: "Arrow",
      },
    ],
  },
];

export const featuresSettings = {
  id: 1,
  image: "/images/ai-human-pic.png",
  name: "Steave B.",
  flag: "/images/flag.png",
  features: [
    {
      id: 1,
      title: "Speed",
      values: [
        {
          id: 1,
          title: "-2px",
        },
        {
          id: 2,
          title: "-1px",
        },
        {
          id: 3,
          title: "0px",
        },
        {
          id: 4,
          title: "1px",
        },
        {
          id: 5,
          title: "2px",
        },
      ],
    },
    {
      id: 2,
      title: "Pitch",
      values: [
        {
          id: 1,
          title: "0%",
        },
        {
          id: 2,
          title: "25%",
        },
        {
          id: 3,
          title: "50%",
        },
        {
          id: 4,
          title: "75%",
        },
        {
          id: 5,
          title: "100%",
        },
      ],
    },
  ],
};
