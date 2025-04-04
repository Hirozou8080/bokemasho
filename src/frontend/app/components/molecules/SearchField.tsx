"use client";

import React from "react";
import TextField from "../atoms/TextField";
import { InputAdornment } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";

interface SearchFieldProps {
  placeholder?: string;
  onChange?: (value: string) => void;
}

const SearchField: React.FC<SearchFieldProps> = ({
  placeholder = "検索...",
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <TextField
      label=""
      placeholder={placeholder}
      onChange={handleChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  );
};

export default SearchField;
