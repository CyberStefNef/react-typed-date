import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { getMaxDaysInMonth, isValidDate, pad } from "./utils";
import { TypedDateProps, SegmentPosition } from "./types";

export function useTypedDate({ value, onChange }: TypedDateProps) {
  const [month, setMonth] = useState<number | null>(
    value ? value.getMonth() + 1 : null,
  );
  const [day, setDay] = useState<number | null>(value ? value.getDate() : null);
  const [year, setYear] = useState<number | null>(
    value ? value.getFullYear() : null,
  );

  const [activeSegment, setActiveSegment] = useState(0);
  const [buffer, setBuffer] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const internalStateRef = useRef({
    month: value ? value.getMonth() + 1 : null,
    day: value ? value.getDate() : null,
    year: value ? value.getFullYear() : null,
  });

  const yearBufferRef = useRef<string>("");
  const isUpdatingFromExternal = useRef(false);

  const segmentOrder = ["month", "day", "year"] as const;

  const segmentPositions = useMemo<SegmentPosition[]>(
    () => [
      { start: 0, end: 2 },
      { start: 3, end: 5 },
      { start: 6, end: 10 },
    ],
    [],
  );

  const maxLengths = [2, 2, 4];

  useEffect(() => {
    if (isUpdatingFromExternal.current) return;

    isUpdatingFromExternal.current = true;

    const newMonth = value ? value.getMonth() + 1 : null;
    const newDay = value ? value.getDate() : null;
    const newYear = value ? value.getFullYear() : null;

    internalStateRef.current = {
      month: newMonth,
      day: newDay,
      year: newYear,
    };

    setMonth(newMonth);
    setDay(newDay);
    setYear(newYear);

    isUpdatingFromExternal.current = false;
  }, [value]);

  const commitDateChanges = useCallback(
    (
      newMonth: number | null,
      newDay: number | null,
      newYear: number | null,
    ) => {
      if (isUpdatingFromExternal.current) return;

      const validMonth = newMonth;
      let validDay = newDay;
      const validYear = newYear;

      if (validMonth !== null && validYear !== null && validDay !== null) {
        const maxDays = getMaxDaysInMonth(validMonth, validYear);
        validDay = Math.min(validDay, maxDays);
      }

      internalStateRef.current = {
        month: validMonth,
        day: validDay,
        year: validYear,
      };

      setMonth(validMonth);
      setDay(validDay);
      setYear(validYear);

      if (validMonth !== null && validDay !== null && validYear !== null) {
        if (validYear >= 1000 && isValidDate(validYear, validMonth, validDay)) {
          onChange?.(new Date(validYear, validMonth - 1, validDay));
        }
      } else {
        onChange?.(undefined);
      }
    },
    [onChange],
  );

  const updateDatePart = useCallback(
    (type: "month" | "day" | "year", value: number | null) => {
      if (isUpdatingFromExternal.current) return;

      const {
        month: currentMonth,
        day: currentDay,
        year: currentYear,
      } = internalStateRef.current;

      let newMonth = currentMonth;
      let newDay = currentDay;
      let newYear = currentYear;

      if (type === "month") {
        newMonth = value;
      } else if (type === "day") {
        newDay = value;
      } else {
        newYear = value;
      }

      commitDateChanges(newMonth, newDay, newYear);
    },
    [commitDateChanges],
  );

  const getSegmentValue = (segmentType: "month" | "day" | "year") => {
    if (segmentType === "month") return month;
    if (segmentType === "day") return day;
    return year;
  };

  const getSegmentDisplay = (segIndex: number) => {
    const segmentType = segmentOrder[segIndex];
    const maxLen = segmentType === "year" ? 4 : 2;

    if (activeSegment === segIndex && buffer !== "") {
      return buffer.padEnd(maxLen, "_");
    }

    return pad(getSegmentValue(segmentType), maxLen);
  };

  const formattedValue = `${getSegmentDisplay(0)}/${getSegmentDisplay(1)}/${getSegmentDisplay(2)}`;

  useEffect(() => {
    if (inputRef.current) {
      const pos = segmentPositions[activeSegment];
      if (buffer !== "") {
        inputRef.current.setSelectionRange(
          pos.start,
          pos.start + buffer.length,
        );
      } else {
        inputRef.current.setSelectionRange(pos.start, pos.end);
      }
    }
  }, [activeSegment, formattedValue, buffer, segmentPositions]);

  const handleMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    if (inputRef.current) {
      const caretPos = inputRef.current.selectionStart;
      if (caretPos !== null) {
        for (let i = 0; i < segmentPositions.length; i++) {
          const { start, end } = segmentPositions[i];
          if (caretPos >= start && caretPos <= end) {
            e.preventDefault();
            if (activeSegment === i) {
              inputRef.current.setSelectionRange(start, end);
            } else {
              setActiveSegment(i);
              setBuffer("");
              inputRef.current.setSelectionRange(start, end);
            }
            break;
          }
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;

    if (key === "ArrowLeft") {
      e.preventDefault();
      setBuffer("");
      setActiveSegment((prev) => (prev > 0 ? prev - 1 : 0));
      return;
    }
    if (key === "ArrowRight" || key === "/") {
      e.preventDefault();
      setBuffer("");
      setActiveSegment((prev) =>
        prev < segmentPositions.length - 1
          ? prev + 1
          : segmentPositions.length - 1,
      );
      return;
    }
    if (key === "ArrowUp" || key === "ArrowDown") {
      e.preventDefault();
      setBuffer("");
      const {
        month: currentMonth,
        day: currentDay,
        year: currentYear,
      } = internalStateRef.current;

      const segmentType = segmentOrder[activeSegment];

      if (segmentType === "month") {
        const monthVal = currentMonth ?? 0;
        const newMonth =
          key === "ArrowUp"
            ? Math.min(monthVal + 1, 12)
            : Math.max(monthVal - 1, 1);
        updateDatePart("month", newMonth);
      } else if (segmentType === "day") {
        const dayVal = currentDay ?? 0;
        const maxDay =
          currentMonth !== null && currentYear !== null
            ? getMaxDaysInMonth(currentMonth, currentYear)
            : 31;
        const newDay =
          key === "ArrowUp"
            ? Math.min(dayVal + 1, maxDay)
            : Math.max(dayVal - 1, 1);
        updateDatePart("day", newDay);
      } else if (segmentType === "year") {
        const yearVal = currentYear ?? 0;
        const newYear =
          key === "ArrowUp"
            ? Math.min(yearVal + 1, 9999)
            : Math.max(yearVal - 1, 1000);
        updateDatePart("year", newYear);
      }
      return;
    }

    if (/^\d$/.test(key)) {
      e.preventDefault();
      const segmentType = segmentOrder[activeSegment];
      const maxLen = maxLengths[activeSegment];
      const newBuffer = buffer + key;

      if (newBuffer.length <= maxLen) {
        setBuffer(newBuffer);
        const parsed = parseInt(newBuffer, 10);
        const { month: currentMonth, year: currentYear } =
          internalStateRef.current;

        if (segmentType === "month") {
          updateDatePart("month", Math.min(parsed, 12));
        } else if (segmentType === "day") {
          const maxDay =
            currentMonth !== null && currentYear !== null
              ? getMaxDaysInMonth(currentMonth, currentYear)
              : 31;
          updateDatePart("day", Math.min(parsed, maxDay));
        } else if (segmentType === "year") {
          if (newBuffer.length < 4) {
            yearBufferRef.current = newBuffer;
            updateDatePart("year", parsed);
          } else {
            yearBufferRef.current = "";
            updateDatePart("year", Math.min(Math.max(parsed, 1000), 9999));
          }
        }

        if (newBuffer.length === maxLen) {
          setBuffer("");
          if (activeSegment < segmentPositions.length - 1) {
            setActiveSegment(activeSegment + 1);
          }
        }
      }
      return;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
  };

  return {
    inputProps: {
      ref: inputRef,
      type: "text",
      value: formattedValue,
      onChange: handleChange,
      onKeyDown: handleKeyDown,
      onMouseUp: handleMouseUp,
    },
  };
}
