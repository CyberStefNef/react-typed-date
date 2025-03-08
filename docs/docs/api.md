---
id: api
title: API Reference
sidebar_position: 5
---

## TypedDateInput Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date \| undefined` | `undefined` | Selected date value |
| `onChange` | `(date: Date) => void` | `undefined` | Callback when date changes |
| `format` | `string` | `MM/DD/YYYY` | Format using MM, DD, YYYY with custom seperator |
| `className` | `string` | `undefined` | CSS class for styling |
| `...props` | `InputHTMLAttributes<HTMLInputElement>` | | Any other valid input props except `type`, `onMouseUp`, `onKeyDown`, `ref`, `onBlur`, `onFocus` |

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
