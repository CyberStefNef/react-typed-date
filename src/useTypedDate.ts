import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  getMaxDaysInMonth,
  isValidDate,
  isValidTime,
  pad,
  validateTypedDate,
} from "./utils";
import {
  TypedDateProps,
  SegmentPosition,
  SegmentState,
  SegmentType,
  TypedDateValidation,
  ValidationCode,
} from "./types";

const isTimeSegment = (segment: SegmentType): boolean =>
  segment === "hour" ||
  segment === "minute" ||
  segment === "second" ||
  segment === "meridiem";

type NumericSegmentType = Exclude<SegmentType, "meridiem">;

interface ParsedFormatSegment {
  type: SegmentType;
  token: string;
  is12Hour?: boolean;
  meridiemLowercase?: boolean;
}

const to12Hour = (hour: number): number => {
  if (hour === 0) return 12;
  if (hour > 12) return hour - 12;
  return hour;
};

const hourFrom12AndMeridiem = (hour12: number, meridiem: "AM" | "PM") => {
  if (meridiem === "AM") {
    return hour12 === 12 ? 0 : hour12;
  }
  return hour12 === 12 ? 12 : hour12 + 12;
};

const getMeridiem = (hour: number | null): "AM" | "PM" | null => {
  if (hour === null) return null;
  return hour >= 12 ? "PM" : "AM";
};

export function useTypedDate({
  value,
  onChange,
  format = "MM/DD/YYYY",
  required = false,
  minDate,
  maxDate,
  onValidationChange,
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
  const lastValidationCodeRef = useRef<ValidationCode | null>(null);

  const formatData = useMemo(() => {
    const tokenRegex = /(YYYY|MM|DD|HH|hh|mm|ss|A|a)/g;
    const segments: ParsedFormatSegment[] = [];
    const separators: string[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = tokenRegex.exec(format)) !== null) {
      if (segments.length > 0) {
        separators.push(format.slice(lastIndex, match.index));
      }

      const token = match[0];
      if (token === "YYYY") {
        segments.push({ type: "year", token });
      } else if (token === "MM") {
        segments.push({ type: "month", token });
      } else if (token === "DD") {
        segments.push({ type: "day", token });
      } else if (token === "HH") {
        segments.push({ type: "hour", token, is12Hour: false });
      } else if (token === "hh") {
        segments.push({ type: "hour", token, is12Hour: true });
      } else if (token === "mm") {
        segments.push({ type: "minute", token });
      } else if (token === "ss") {
        segments.push({ type: "second", token });
      } else if (token === "A") {
        segments.push({ type: "meridiem", token, meridiemLowercase: false });
      } else if (token === "a") {
        segments.push({ type: "meridiem", token, meridiemLowercase: true });
      }

      lastIndex = match.index + token.length;
    }

    const parsedSegments =
      segments.length > 0
        ? segments
        : ([
            { type: "month", token: "MM" },
            { type: "day", token: "DD" },
            { type: "year", token: "YYYY" },
          ] as ParsedFormatSegment[]);
    const parsedSeparators =
      separators.length > 0 ? separators : ["/", "/"].slice(0, parsedSegments.length - 1);
    const segmentOrder = parsedSegments.map((segment) => segment.type);

    return {
      segments: parsedSegments,
      separators: parsedSeparators,
      segmentOrder,
      hasTime: segmentOrder.some((segment) => isTimeSegment(segment)),
    };
  }, [format]);

  const { segments, separators, segmentOrder, hasTime } = formatData;
  const uniqueSegments = useMemo(
    () => Array.from(new Set(segmentOrder)),
    [segmentOrder],
  );

  const segmentPositions = useMemo<SegmentPosition[]>(() => {
    const positions: SegmentPosition[] = [];
    let currentPosition = 0;

    segments.forEach((segment, index) => {
      const segmentLength = segment.type === "year" ? 4 : 2;
      positions.push({
        start: currentPosition,
        end: currentPosition + segmentLength,
      });

      if (index < segments.length - 1) {
        currentPosition += segmentLength + (separators[index]?.length ?? 0);
      } else {
        currentPosition += segmentLength;
      }
    });

    return positions;
  }, [segments, separators]);

  const maxLengths = useMemo(
    () => segments.map((segment) => (segment.type === "year" ? 4 : 2)),
    [segments],
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

          if (!hasTime || (isValidTime(hour, minute) && second <= 59)) {
            const nextDate = new Date(
              validYear,
              validMonth - 1,
              validDay,
              hour,
              minute,
              second,
            );

            if (
              (!minDate || nextDate >= minDate) &&
              (!maxDate || nextDate <= maxDate)
            ) {
              onChange?.(nextDate);
            }
          }
        }
      }
    },
    [onChange, hasTime, minDate, maxDate],
  );

  const updateDatePart = useCallback(
    (type: NumericSegmentType, value: number | null) => {
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

  const getSegmentValue = useCallback(
    (segmentType: NumericSegmentType) => {
      if (segmentType === "month") return state.month;
      if (segmentType === "day") return state.day;
      if (segmentType === "year") return state.year;
      if (segmentType === "hour") return state.hour;
      if (segmentType === "minute") return state.minute;
      return state.second;
    },
    [state],
  );

  const getSegmentDisplay = (segIndex: number) => {
    const segmentConfig = segments[segIndex];
    const segmentType = segmentConfig.type;
    const maxLen = segmentType === "year" ? 4 : 2;

    if (activeSegment === segIndex && buffer !== "") {
      return buffer.padEnd(maxLen, "_");
    }

    if (segmentType === "meridiem") {
      const meridiem = getMeridiem(state.hour);
      if (!meridiem) return "__";
      return segmentConfig.meridiemLowercase
        ? meridiem.toLowerCase()
        : meridiem;
    }

    if (segmentType === "hour" && segmentConfig.is12Hour) {
      const hour = getSegmentValue("hour");
      return pad(hour === null ? null : to12Hour(hour), maxLen);
    }

    return pad(getSegmentValue(segmentType), maxLen);
  };

  const formattedValue = useMemo(() => {
    let formatted = "";
    segments.forEach((_, index) => {
      if (index > 0) {
        formatted += separators[index - 1] ?? "";
      }
      formatted += getSegmentDisplay(index);
    });
    return formatted;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    segments,
    separators,
    state,
    activeSegment,
    buffer,
  ]);

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
    const activeSegmentConfig = segments[activeSegment];
    const segmentType = activeSegmentConfig.type;

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
      } else if (segmentType === "meridiem") {
        if (currentHour !== null) {
          const toggledHour =
            currentHour >= 12 ? currentHour - 12 : currentHour + 12;
          updateDatePart("hour", toggledHour);
        }
      }
      return;
    }

    if (/^[aApP]$/.test(key)) {
      if (segmentType !== "meridiem") return;

      e.preventDefault();
      setBuffer("");
      const { hour: currentHour } = internalStateRef.current;
      if (currentHour === null) return;

      const currentHour12 = to12Hour(currentHour);
      const targetMeridiem = key.toLowerCase() === "a" ? "AM" : "PM";
      updateDatePart(
        "hour",
        hourFrom12AndMeridiem(currentHour12, targetMeridiem),
      );
      return;
    }

    if (/^\d$/.test(key)) {
      e.preventDefault();
      if (segmentType === "meridiem") return;

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
          if (activeSegmentConfig.is12Hour) {
            const normalized12Hour = parsed <= 0 ? 12 : Math.min(parsed, 12);
            const currentMeridiem = getMeridiem(internalStateRef.current.hour);
            updateDatePart(
              "hour",
              hourFrom12AndMeridiem(
                normalized12Hour,
                currentMeridiem ?? "AM",
              ),
            );
          } else {
            updateDatePart("hour", Math.min(parsed, 23));
          }
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
      const activeSegmentConfig = segments[activeSegment];
      const segmentType = activeSegmentConfig.type;
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
        if (activeSegmentConfig.is12Hour) {
          const normalized12Hour = parsed <= 0 ? 12 : Math.min(parsed, 12);
          const currentMeridiem = getMeridiem(internalStateRef.current.hour);
          updateDatePart(
            "hour",
            hourFrom12AndMeridiem(normalized12Hour, currentMeridiem ?? "AM"),
          );
        } else {
          updateDatePart("hour", Math.min(parsed, 23));
        }
      } else if (segmentType === "minute") {
        updateDatePart("minute", Math.min(parsed, 59));
      } else if (segmentType === "second") {
        updateDatePart("second", Math.min(parsed, 59));
      }

      setBuffer("");
    }
  };

  const isSegmentFilled = useCallback(
    (segment: SegmentType) => {
      if (segment === "meridiem") {
        return state.hour !== null;
      }
      return getSegmentValue(segment) !== null;
    },
    [state.hour, getSegmentValue],
  );

  const validation = useMemo<TypedDateValidation>(() => {
    const isEmpty =
      buffer === "" && uniqueSegments.every((segment) => !isSegmentFilled(segment));
    const isComplete =
      buffer === "" && uniqueSegments.every((segment) => isSegmentFilled(segment));

    return validateTypedDate({
      year: state.year,
      month: state.month,
      day: state.day,
      hour: state.hour,
      minute: state.minute,
      second: state.second,
      hasTime,
      isEmpty,
      isComplete,
      required,
      minDate,
      maxDate,
    });
  }, [
    state,
    hasTime,
    buffer,
    uniqueSegments,
    required,
    minDate,
    maxDate,
    isSegmentFilled,
  ]);

  useEffect(() => {
    if (!onValidationChange) {
      lastValidationCodeRef.current = validation.code;
      return;
    }

    if (lastValidationCodeRef.current !== validation.code) {
      onValidationChange(validation);
      lastValidationCodeRef.current = validation.code;
    }
  }, [validation, onValidationChange]);

  return {
    validation,
    inputProps: {
      ref: inputRef,
      type: "text",
      value: formattedValue,
      "aria-invalid": validation.isValid ? undefined : true,
      onChange: handleChange,
      onKeyDown: handleKeyDown,
      onMouseUp: handleMouseUp,
      onBlur: handleBlur,
      onFocus: handleFocus,
    },
  };
}
