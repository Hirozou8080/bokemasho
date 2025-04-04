"use client";

import React from "react";
import { Button as MuiButton, ButtonProps } from "@mui/material";

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode;
}

const Button: React.FC<CustomButtonProps> = ({
  children,
  variant = "contained",
  color = "primary",
  ...props
}) => {
  return (
    <MuiButton variant={variant} color={color} {...props}>
      {children}
    </MuiButton>
  );
};

export default Button;
