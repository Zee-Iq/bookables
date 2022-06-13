import { FormGroup, FormGroupProps, Typography } from "@mui/material";
import { PropsWithChildren } from "react";

interface LabeledFormGroupProps {
  label: string;
}

export default function LabeledFormGroup({
  label,
  children,
  ...props
}: PropsWithChildren<LabeledFormGroupProps & FormGroupProps>) {
  return (
    <FormGroup
      {...props}
      sx={{
        ...props.sx,
        position: "relative",
        gap: 1,
        my: 2,
        p: 2,
        border: "1px solid",
        borderColor: "primary.main",
        borderRadius: 1,
      }}
    >
      <Typography
        sx={{
          position: "absolute",
          top: 0,
          left: "2ch",
          transform: "translateY(-50%)",
          background: "white",
          px: 2,
        }}
      >
        {label}
      </Typography>
      {children}
    </FormGroup>
  );
}
