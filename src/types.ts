export interface TypedDateProps {
  value?: Date;
  onChange?: (date?: Date) => void;
  format?: string;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  onValidationChange?: (validation: TypedDateValidation) => void;
}

export type SegmentType =
  | "month"
  | "day"
  | "year"
  | "hour"
  | "minute"
  | "second"
  | "meridiem";

export type ValidationCode =
  | "none"
  | "incomplete"
  | "invalid_date"
  | "out_of_range_min"
  | "out_of_range_max";

export interface TypedDateValidation {
  isValid: boolean;
  code: ValidationCode;
  message?: string;
}

export interface SegmentState {
  year: number | null;
  month: number | null;
  day: number | null;
  hour: number | null;
  minute: number | null;
  second: number | null;
}

export interface SegmentPosition {
  start: number;
  end: number;
}
