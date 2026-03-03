---
id: api
title: API Reference
sidebar_position: 6
---

## TypedDateInput Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date \| undefined` | `undefined` | Selected date/time value |
| `onChange` | `(date?: Date) => void` | `undefined` | Callback when date/time changes |
| `format` | `string` | `MM/DD/YYYY` | Format using MM, DD, YYYY, HH, mm with custom separators |
| `required` | `boolean` | `false` | Marks empty/incomplete values as invalid |
| `minDate` | `Date \| undefined` | `undefined` | Minimum allowed date/time |
| `maxDate` | `Date \| undefined` | `undefined` | Maximum allowed date/time |
| `onValidationChange` | `(validation: TypedDateValidation) => void` | `undefined` | Callback when validation status changes |
| `className` | `string` | `undefined` | CSS class for styling |
| `...props` | `InputHTMLAttributes<HTMLInputElement>` | | Any other valid input props except `type`, `onMouseUp`, `onKeyDown`, `ref`, `onBlur`, `onFocus` |

### Validation Types

```typescript
type ValidationCode =
  | "none"
  | "incomplete"
  | "invalid_date"
  | "out_of_range_min"
  | "out_of_range_max";

interface TypedDateValidation {
  isValid: boolean;
  code: ValidationCode;
  message?: string;
}
```

## Format String Reference

### Date Segments
- **MM**: Month (01-12)
- **DD**: Day (01-31, validated against month/year)
- **YYYY**: Year (1000-9999)

### Time Segments (New)
- **HH**: Hour in 24-hour format (00-23)
- **hh**: Hour in 12-hour format (01-12)
- **mm**: Minutes (00-59)
- **ss**: Seconds (00-59)
- **A / a**: Meridiem segment (`AM`/`PM` or `am`/`pm`)

### Format Examples
```
MM/DD/YYYY             // Date only: 12/25/2023
DD/MM/YYYY             // European date: 25/12/2023
MM/DD/YYYY HH:mm       // US date with time: 12/25/2023 14:30
DD/MM/YYYY HH:mm       // European date with time: 25/12/2023 14:30
MM/DD/YYYY HH:mm:ss    // With seconds: 12/25/2023 14:30:45
DD/MM/YYYY HH:mm:ss    // European with seconds: 25/12/2023 14:30:45
MM/DD/YYYY hh:mm A     // 12-hour format: 12/25/2023 02:30 PM
MM/DD/YYYY hh:mm a     // 12-hour lowercase: 12/25/2023 02:30 pm
```

### Separators
- **Date separators**: `/`, `-`, `.` or any non-letter character
- **Time separator**: `:` (automatically detected)
- **Date/Time separator**: Space character (automatically added)

### useTypedDate Hook

```typescript
function useTypedDate(options: {
  value?: Date;
  onChange?: (date?: Date) => void;
  format?: string;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  onValidationChange?: (validation: TypedDateValidation) => void;
}): {
  validation: TypedDateValidation;
  inputProps: {
    ref: React.RefObject<HTMLInputElement>;
    type: string;
    value: string;
    "aria-invalid"?: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onMouseUp: (e: React.MouseEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void,
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => void,
  };
}
```

### Validation Example

```tsx
const [value, setValue] = useState<Date | undefined>(undefined);
const [error, setError] = useState<string | null>(null);

<TypedDateInput
  value={value}
  onChange={setValue}
  format="MM/DD/YYYY HH:mm"
  required
  minDate={new Date(2026, 0, 1)}
  maxDate={new Date(2026, 11, 31, 23, 59)}
  onValidationChange={(validation) => {
    setError(validation.isValid ? null : validation.message ?? validation.code);
  }}
/>;
```
