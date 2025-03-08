---
id: api
title: API Reference
sidebar_position: 5
---

## TypedDateInput Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date \| undefined` | `undefined` | Selected date value |
| `onChange` | `(date: Date \| undefined) => void` | `undefined` | Callback when date changes |
| `className` | `string` | `undefined` | CSS class for styling |

## useTypedDate Hook

```typescript
function useTypedDate(options: {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}): {
  inputProps: {
    ref: React.RefObject<HTMLInputElement>;
    type: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onMouseUp: (e: React.MouseEvent<HTMLInputElement>) => void;
  };
}
```
