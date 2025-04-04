"use client";

import React from "react";
import { Grid as MuiGrid, GridProps } from "@mui/material";

interface CustomGridProps extends GridProps {
  children: React.ReactNode;
}

const Grid: React.FC<CustomGridProps> = ({ children, ...props }) => {
  return <MuiGrid {...props}>{children}</MuiGrid>;
};

export default Grid;
