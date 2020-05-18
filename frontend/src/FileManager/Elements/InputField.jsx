import React from "react";
import {TextField } from '@material-ui/core';


export default function InputField(props) {
    const { onChange, ...rest} = props;
    const handleChange = event => {
      props.onChange(event.target.value);
    };
      return (
        <TextField
            fullWidth
            margin="none"
            onChange={handleChange}
            {...rest}
        />
      );
}