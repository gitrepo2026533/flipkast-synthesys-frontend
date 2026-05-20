import React from "react";

export const addPropsToReactElement = (element: React.ReactNode, props: any) => {
  if (React.isValidElement(element)) {
    return React.cloneElement(element, props);
  }
  return element;
};
