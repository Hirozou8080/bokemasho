"use client";

import React from "react";
import { Box as MuiBox, BoxProps } from "@mui/material";

interface CustomBoxProps extends BoxProps {
  children: React.ReactNode;
}

const Box: React.FC<CustomBoxProps> = ({ children, ...props }) => {
  return <MuiBox {...props}>{children}</MuiBox>;
};

export default Box;
