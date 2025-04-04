"use client";

import React from "react";
import { Typography as MuiTypography, TypographyProps } from "@mui/material";

interface CustomTypographyProps extends TypographyProps {
  children: React.ReactNode;
}

const Typography: React.FC<CustomTypographyProps> = ({
  children,
  variant = "body1",
  ...props
}) => {
  return (
    <MuiTypography variant={variant} {...props}>
      {children}
    </MuiTypography>
  );
};

export default Typography;
