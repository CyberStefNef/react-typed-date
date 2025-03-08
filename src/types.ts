export interface TypedDateProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

export interface SegmentPosition {
  start: number;
  end: number;
}
