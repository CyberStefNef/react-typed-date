---
id: api
title: API Reference
sidebar_position: 6
---

## TypedDateInput Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date \| undefined` | `undefined` | Selected date/time value |
| `onChange` | `(date: Date) => void` | `undefined` | Callback when date/time changes |
| `format` | `string` | `MM/DD/YYYY` | Format using MM, DD, YYYY, HH, mm with custom separators |
| `className` | `string` | `undefined` | CSS class for styling |
| `...props` | `InputHTMLAttributes<HTMLInputElement>` | | Any other valid input props except `type`, `onMouseUp`, `onKeyDown`, `ref`, `onBlur`, `onFocus` |

## Format String Reference

### Date Segments
- **MM**: Month (01-12)
- **DD**: Day (01-31, validated against month/year)
- **YYYY**: Year (1000-9999)

### Time Segments (New)
- **HH**: Hour in 24-hour format (00-23)
- **mm**: Minutes (00-59)
- **ss**: Seconds (00-59)

### Format Examples
```
MM/DD/YYYY             // Date only: 12/25/2023
DD/MM/YYYY             // European date: 25/12/2023
MM/DD/YYYY HH:mm       // US date with time: 12/25/2023 14:30
DD/MM/YYYY HH:mm       // European date with time: 25/12/2023 14:30
MM/DD/YYYY HH:mm:ss    // With seconds: 12/25/2023 14:30:45
DD/MM/YYYY HH:mm:ss    // European with seconds: 25/12/2023 14:30:45
```

### Separators
- **Date separators**: `/`, `-`, `.` or any non-letter character
- **Time separator**: `:` (automatically detected)
- **Date/Time separator**: Space character (automatically added)

### useTypedDate Hook

```typescript
function useDateField(options: {
  value?: Date;
  onChange?: (date: Date) => void;
  format?: string;
}): {
  inputProps: {
    ref: React.RefObject<HTMLInputElement>;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onMouseUp: (e: React.MouseEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void,
    onFocus: (e: React.FocusEvent<HTMLInputElement>) => void,
  };
}
```
