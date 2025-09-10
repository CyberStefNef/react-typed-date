import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { getMaxDaysInMonth, isValidDate, isValidTime, pad } from "./utils";
import { TypedDateProps, SegmentPosition, SegmentState } from "./types";

export function useTypedDate({
  value,
  onChange,
  format = "MM/DD/YYYY",
}: TypedDateProps) {
  const [state, setState] = useState<SegmentState>(
    value
      ? {
          year: value.getFullYear(),
          month: value.getMonth() + 1,
          day: value.getDate(),
          hour: value.getHours(),
          minute: value.getMinutes(),
          second: value.getSeconds(),
        }
      : {
          year: null,
          month: null,
          day: null,
          hour: null,
          minute: null,
          second: null,
        },
  );

  const [activeSegment, setActiveSegment] = useState(0);
  const [buffer, setBuffer] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const internalStateRef = useRef({
    month: value ? value.getMonth() + 1 : null,
    day: value ? value.getDate() : null,
    year: value ? value.getFullYear() : null,
    hour: value ? value.getHours() : null,
    minute: value ? value.getMinutes() : null,
    second: value ? value.getSeconds() : null,
  });

  const yearBufferRef = useRef<string>("");
  const isUpdatingFromExternal = useRef(false);

  const formatData = useMemo(() => {
    const parts = format.split(/[\s]+/);
    const datePart = parts[0] || format;
    const timePart = parts[1];

    const dateSeparator = datePart.match(/[^A-Za-z]/)?.[0] || "/";
    const timeSeparator = timePart?.match(/[^A-Za-z]/)?.[0] || ":";

    const dateSegments = datePart.split(/[^A-Za-z]/);
    const timeSegments = timePart ? timePart.split(/[^A-Za-z]/) : [];

    const segmentOrder = [
      ...dateSegments.map((seg) => {
        if (seg.startsWith("M")) return "month";
        if (seg.startsWith("D")) return "day";
        if (seg.startsWith("Y")) return "year";
        return "month";
      }),
      ...timeSegments.map((seg) => {
        if (seg.startsWith("H") || seg.startsWith("h")) return "hour";
        if (seg.startsWith("m")) return "minute";
        if (seg.startsWith("s")) return "second";
        return "hour";
      }),
    ] as Array<"month" | "day" | "year" | "hour" | "minute">;

    return {
      dateSeparator,
      timeSeparator,
      segmentOrder,
      hasTime: timeSegments.length > 0,
    };
  }, [format]);

  const { dateSeparator, timeSeparator, segmentOrder, hasTime } = formatData;

  const segmentPositions = useMemo<SegmentPosition[]>(() => {
    const positions: SegmentPosition[] = [];
    let currentPosition = 0;

    segmentOrder.forEach((segment, index) => {
      const segmentLength = segment === "year" ? 4 : 2;
      positions.push({
        start: currentPosition,
        end: currentPosition + segmentLength,
      });

      if (index < segmentOrder.length - 1) {
        const nextSegment = segmentOrder[index + 1];
        const currentIsTime = segment === "hour" || segment === "minute";
        const nextIsTime = nextSegment === "hour" || nextSegment === "minute";

        if (!currentIsTime && nextIsTime) {
          currentPosition += segmentLength + 1;
        } else if (currentIsTime && nextIsTime) {
          currentPosition += segmentLength + timeSeparator.length;
        } else {
          currentPosition += segmentLength + dateSeparator.length;
        }
      } else {
        currentPosition += segmentLength;
      }
    });

    return positions;
  }, [segmentOrder, dateSeparator, timeSeparator]);

  const maxLengths = useMemo(
    () => segmentOrder.map((type: string) => (type === "year" ? 4 : 2)),
    [segmentOrder],
  );

  useEffect(() => {
    if (isUpdatingFromExternal.current) return;

    isUpdatingFromExternal.current = true;

    const newMonth = value ? value.getMonth() + 1 : null;
    const newDay = value ? value.getDate() : null;
    const newYear = value ? value.getFullYear() : null;
    const newHour = value ? value.getHours() : null;
    const newMinute = value ? value.getMinutes() : null;
    const newSecond = value ? value.getSeconds() : null;

    internalStateRef.current = {
      month: newMonth,
      day: newDay,
      year: newYear,
      hour: newHour,
      minute: newMinute,
      second: newSecond,
    };

    setState({
      year: newYear,
      month: newMonth,
      day: newDay,
      hour: newHour,
      minute: newMinute,
      second: newSecond,
    });

    isUpdatingFromExternal.current = false;
  }, [value]);

  const commitDateChanges = useCallback(
    (
      newMonth: number | null,
      newDay: number | null,
      newYear: number | null,
      newHour: number | null = null,
      newMinute: number | null = null,
      newSecond: number | null = null,
    ) => {
      if (isUpdatingFromExternal.current) return;

      const validMonth = newMonth;
      let validDay = newDay;
      const validYear = newYear;
      const validHour = newHour;
      const validMinute = newMinute;
      const validSecond = newSecond;

      if (validMonth !== null && validYear !== null && validDay !== null) {
        const maxDays = getMaxDaysInMonth(validMonth, validYear);
        validDay = Math.min(validDay, maxDays);
      }

      internalStateRef.current = {
        month: validMonth,
        day: validDay,
        year: validYear,
        hour: validHour,
        minute: validMinute,
        second: validSecond,
      };

      setState({
        year: validYear,
        month: validMonth,
        day: validDay,
        hour: validHour,
        minute: validMinute,
        second: validSecond,
      });

      if (validMonth !== null && validDay !== null && validYear !== null) {
        if (validYear >= 1000 && isValidDate(validYear, validMonth, validDay)) {
          const hour = hasTime ? (validHour ?? 0) : 0;
          const minute = hasTime ? (validMinute ?? 0) : 0;
          const second = hasTime ? (validSecond ?? 0) : 0;

          if (!hasTime || isValidTime(hour, minute)) {
            onChange?.(
              new Date(
                validYear,
                validMonth - 1,
                validDay,
                hour,
                minute,
                second,
              ),
            );
          }
        }
      }
    },
    [onChange, hasTime],
  );

  const updateDatePart = useCallback(
    (
      type: "month" | "day" | "year" | "hour" | "minute" | "second",
      value: number | null,
    ) => {
      if (isUpdatingFromExternal.current) return;

      const {
        month: currentMonth,
        day: currentDay,
        year: currentYear,
        hour: currentHour,
        minute: currentMinute,
        second: currentSecond,
      } = internalStateRef.current;

      let newMonth = currentMonth;
      let newDay = currentDay;
      let newYear = currentYear;
      let newHour = currentHour;
      let newMinute = currentMinute;
      let newSecond = currentSecond;

      if (type === "month") {
        newMonth = value;
      } else if (type === "day") {
        newDay = value;
      } else if (type === "year") {
        newYear = value;
      } else if (type === "hour") {
        newHour = value;
      } else if (type === "minute") {
        newMinute = value;
      } else if (type === "second") {
        newSecond = value;
      }

      commitDateChanges(
        newMonth,
        newDay,
        newYear,
        newHour,
        newMinute,
        newSecond,
      );
    },
    [commitDateChanges],
  );

  const getSegmentValue = (
    segmentType: "month" | "day" | "year" | "hour" | "minute" | "second",
  ) => {
    if (segmentType === "month") return state.month;
    if (segmentType === "day") return state.day;
    if (segmentType === "year") return state.year;
    if (segmentType === "hour") return state.hour;
    if (segmentType === "minute") return state.minute;
    return state.second;
  };

  const getSegmentDisplay = (segIndex: number) => {
    const segmentType = segmentOrder[segIndex];
    const maxLen = segmentType === "year" ? 4 : 2;

    if (activeSegment === segIndex && buffer !== "") {
      return buffer.padEnd(maxLen, "_");
    }

    return pad(getSegmentValue(segmentType), maxLen);
  };

  const formattedValue = useMemo(() => {
    const dateSegments: string[] = [];
    const timeSegments: string[] = [];

    segmentOrder.forEach((segment: string, index: number) => {
      const display = getSegmentDisplay(index);
      if (segment === "hour" || segment === "minute" || segment === "second") {
        timeSegments.push(display);
      } else {
        dateSegments.push(display);
      }
    });

    const dateString = dateSegments.join(dateSeparator);
    const timeString = timeSegments.join(timeSeparator);

    return hasTime ? `${dateString} ${timeString}` : dateString;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segmentOrder, dateSeparator, timeSeparator, hasTime, state]);

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

  const tabKeyPressedRef = useRef(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;

    if (key === "Tab") {
      tabKeyPressedRef.current = true;

      if (e.shiftKey && activeSegment > 0) {
        e.preventDefault();
        setBuffer("");
        setActiveSegment((prev: number) => prev - 1);
        return;
      } else if (!e.shiftKey && activeSegment < segmentPositions.length - 1) {
        e.preventDefault();
        setBuffer("");
        setActiveSegment((prev: number) => prev + 1);
        return;
      }
      setBuffer("");
      return;
    }

    if (key === "ArrowLeft") {
      e.preventDefault();
      setBuffer("");
      setActiveSegment((prev: number) => (prev > 0 ? prev - 1 : 0));
      return;
    }

    if (key === "ArrowRight") {
      e.preventDefault();
      setBuffer("");
      setActiveSegment((prev: number) =>
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
        hour: currentHour,
        minute: currentMinute,
        second: currentSecond,
      } = internalStateRef.current;

      const segmentType = segmentOrder[activeSegment];

      if (segmentType === "month") {
        const monthVal = currentMonth ?? 0;
        const newMonth =
          key === "ArrowUp"
            ? Math.min(monthVal + 1, 12)
            : Math.max(monthVal - 1, 1);
        if (newMonth !== monthVal) {
          updateDatePart("month", newMonth);
        }
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
        if (newDay !== dayVal) {
          updateDatePart("day", newDay);
        }
      } else if (segmentType === "year") {
        const yearVal = currentYear ?? 0;
        const newYear =
          key === "ArrowUp"
            ? Math.min(yearVal + 1, 9999)
            : Math.max(yearVal - 1, 1000);
        if (newYear !== yearVal) {
          updateDatePart("year", newYear);
        }
      } else if (segmentType === "hour") {
        const hourVal = currentHour ?? 0;
        const newHour =
          key === "ArrowUp"
            ? Math.min(hourVal + 1, 23)
            : Math.max(hourVal - 1, 0);
        if (newHour !== hourVal) {
          updateDatePart("hour", newHour);
        }
      } else if (segmentType === "minute") {
        const minuteVal = currentMinute ?? 0;
        const newMinute =
          key === "ArrowUp"
            ? Math.min(minuteVal + 1, 59)
            : Math.max(minuteVal - 1, 0);
        if (newMinute !== minuteVal) {
          updateDatePart("minute", newMinute);
        }
      } else if (segmentType === "second") {
        const secondVal = currentSecond ?? 0;
        const newSecond =
          key === "ArrowUp"
            ? Math.min(secondVal + 1, 59)
            : Math.max(secondVal - 1, 0);
        if (newSecond !== secondVal) {
          updateDatePart("second", newSecond);
        }
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
        } else if (segmentType === "hour") {
          updateDatePart("hour", Math.min(parsed, 23));
        } else if (segmentType === "minute") {
          updateDatePart("minute", Math.min(parsed, 59));
        } else if (segmentType === "second") {
          updateDatePart("second", Math.min(parsed, 59));
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

  const handleFocus = () => {
    if (tabKeyPressedRef.current) {
      tabKeyPressedRef.current = false;

      setActiveSegment(0);
      setBuffer("");

      const { start, end } = segmentPositions[0];
      setTimeout(() => {
        inputRef.current?.setSelectionRange(start, end);
      }, 0);
    }
  };

  useEffect(() => {
    const handleDocumentKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        tabKeyPressedRef.current = true;

        setTimeout(() => {
          tabKeyPressedRef.current = false;
        }, 100);
      }
    };

    document.addEventListener("keydown", handleDocumentKeyDown);
    return () => {
      document.removeEventListener("keydown", handleDocumentKeyDown);
    };
  }, []);

  const handleBlur = () => {
    if (buffer) {
      const segmentType = segmentOrder[activeSegment];
      const parsed = parseInt(buffer, 10);

      if (segmentType === "month") {
        updateDatePart("month", Math.min(parsed, 12));
      } else if (segmentType === "day") {
        const { month: currentMonth, year: currentYear } =
          internalStateRef.current;
        const maxDay =
          currentMonth !== null && currentYear !== null
            ? getMaxDaysInMonth(currentMonth, currentYear)
            : 31;
        updateDatePart("day", Math.min(parsed, maxDay));
      } else if (segmentType === "year") {
        updateDatePart("year", parsed);
      } else if (segmentType === "hour") {
        updateDatePart("hour", Math.min(parsed, 23));
      } else if (segmentType === "minute") {
        updateDatePart("minute", Math.min(parsed, 59));
      } else if (segmentType === "second") {
        updateDatePart("second", Math.min(parsed, 59));
      }

      setBuffer("");
    }
  };

  return {
    inputProps: {
      ref: inputRef,
      type: "text",
      value: formattedValue,
      onChange: handleChange,
      onKeyDown: handleKeyDown,
      onMouseUp: handleMouseUp,
      onBlur: handleBlur,
      onFocus: handleFocus,
    },
  };
}
