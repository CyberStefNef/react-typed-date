export const getMaxDaysInMonth = (month: number, year: number): number => {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  } else if ([4, 6, 9, 11].includes(month)) {
    return 30;
  } else {
    return 31;
  }
};

export const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

export const isValidDate = (
  year: number,
  month: number,
  day: number,
): boolean => {
  if (year < 100) {
    return false;
  }

  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

export const pad = (num: number | null, length: number): string => {
  if (num === null) return "_".repeat(length);
  return String(num).padStart(length, "0");
};

export const isValidTime = (hour: number, minute: number): boolean => {
  return hour >= 0 && hour <= 23 && minute >= 0 && minute <= 59;
};

interface ValidationInput {
  year: number | null;
  month: number | null;
  day: number | null;
  hour: number | null;
  minute: number | null;
  second: number | null;
  hasTime: boolean;
  isEmpty: boolean;
  isComplete: boolean;
  required: boolean;
  minDate?: Date;
  maxDate?: Date;
}

export const validateTypedDate = ({
  year,
  month,
  day,
  hour,
  minute,
  second,
  hasTime,
  isEmpty,
  isComplete,
  required,
  minDate,
  maxDate,
}: ValidationInput) => {
  if (isEmpty && !required) {
    return { isValid: true, code: "none" as const };
  }

  if (!isComplete || isEmpty) {
    return {
      isValid: false,
      code: "incomplete" as const,
      message: "Please complete all date segments.",
    };
  }

  if (year === null || month === null || day === null) {
    return {
      isValid: false,
      code: "incomplete" as const,
      message: "Please complete all date segments.",
    };
  }

  if (!isValidDate(year, month, day)) {
    return {
      isValid: false,
      code: "invalid_date" as const,
      message: "Please enter a valid date.",
    };
  }

  const safeHour = hasTime ? (hour ?? 0) : 0;
  const safeMinute = hasTime ? (minute ?? 0) : 0;
  const safeSecond = hasTime ? (second ?? 0) : 0;

  if (
    (hasTime && !isValidTime(safeHour, safeMinute)) ||
    safeSecond < 0 ||
    safeSecond > 59
  ) {
    return {
      isValid: false,
      code: "invalid_date" as const,
      message: "Please enter a valid time.",
    };
  }

  const candidate = new Date(
    year,
    month - 1,
    day,
    safeHour,
    safeMinute,
    safeSecond,
  );

  if (minDate && candidate < minDate) {
    return {
      isValid: false,
      code: "out_of_range_min" as const,
      message: "Date is before the minimum allowed value.",
    };
  }

  if (maxDate && candidate > maxDate) {
    return {
      isValid: false,
      code: "out_of_range_max" as const,
      message: "Date is after the maximum allowed value.",
    };
  }

  return { isValid: true, code: "none" as const };
};
