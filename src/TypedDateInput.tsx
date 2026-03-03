import React from "react";
import { useTypedDate } from "./useTypedDate";
import { TypedDateProps } from "./types";

export function TypedDateInput({
  value,
  onChange,
  format,
  required,
  minDate,
  maxDate,
  onValidationChange,
  className,
  ...props
}: Omit<
  React.ComponentProps<"input">,
  | "value"
  | "onChange"
  | "onKeyDown"
  | "ref"
  | "type"
  | "onMouseUp"
  | "onBlur"
  | "onFocus"
> &
  TypedDateProps) {
  const { inputProps } = useTypedDate({
    value,
    onChange,
    format,
    required,
    minDate,
    maxDate,
    onValidationChange,
  });

  return <input className={className} {...inputProps} {...props} />;
}
