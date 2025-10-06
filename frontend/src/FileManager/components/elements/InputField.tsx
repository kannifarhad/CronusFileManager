import { type ChangeEvent } from "react";
import { TextField, type TextFieldProps } from "@mui/material";

interface InputFieldProps extends Omit<TextFieldProps, "onChange"> {
  onChange: (value: string) => void;
}

export default function InputField(props: InputFieldProps) {
  const { onChange, ...rest } = props;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return <TextField fullWidth margin="none" onChange={handleChange} {...rest} />;
}
