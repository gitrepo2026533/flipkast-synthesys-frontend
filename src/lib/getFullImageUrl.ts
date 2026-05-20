export const getFullImageUrl = (relativeUrl?: string) => `${process.env.REACT_APP_IMAGES_DOMAIN || ""}${relativeUrl}`;
