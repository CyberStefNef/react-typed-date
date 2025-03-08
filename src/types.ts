export interface TypedDateProps {
  value?: Date;
  onChange?: (date?: Date) => void;
  format?: string;
}

export interface SegmentPosition {
  start: number;
  end: number;
}
