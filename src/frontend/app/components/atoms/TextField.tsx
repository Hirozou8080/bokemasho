"use client";

import React from "react";
import { TextField as MuiTextField, TextFieldProps } from "@mui/material";

type CustomTextFieldProps = TextFieldProps & {
  label: string;
};

const TextField: React.FC<CustomTextFieldProps> = ({
  label,
  variant = "outlined",
  fullWidth = true,
  ...props
}) => {
  return (
    <MuiTextField
      label={label}
      variant={variant}
      fullWidth={fullWidth}
      {...props}
    />
  );
};

export default TextField;
