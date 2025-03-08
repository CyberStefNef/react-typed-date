# react-typed-date

![npm version](https://img.shields.io/npm/v/react-typed-date)
![license](https://img.shields.io/badge/license-MIT-green)
![bundle size](https://img.shields.io/bundlephobia/minzip/react-typed-date)

A React library for creating an intuitive, keyboard-friendly date input field with segment navigation.

## Motivation

While there are several approaches to date input in React, each with their own strengths:

- Libraries like [React ARIA](https://react-spectrum.adobe.com/react-aria/DateField.html) from Adobe offer excellent accessibility and keyboard interaction patterns for date fields
- UI component libraries like [Material-UI](https://mui.com/x/react-date-pickers/date-field/) provide comprehensive date pickers with their design systems
- Native HTML `<input type="date">` offers basic functionality but lacks consistent styling across browsers

`react-typed-date` aims to provide a lightweight alternative that focuses specifically on the date input experience. Inspired by the [React ARIA DateField](https://react-spectrum.adobe.com/react-aria/DateField.html), this library offers the same intuitive keyboard navigation and segment editing in a zero-dependency package that's easy to integrate into any project.

The goal is to provide developers with a simple, flexible date input solution that maintains excellent user experience while giving complete freedom over styling and presentation.

## Features

- 🎯 Intuitive keyboard navigation between date segments (month/day/year)
- 🚦 Smart date validation with awareness of month lengths and leap years
- ⌨️ Proper keyboard interaction with arrow keys for quick date adjustments
- 🎨 Easily stylable with your preferred CSS solution
- 📦 TypeScript support with full type definitions
- 🧩 Zero dependencies

## Alternatives

Note that `react-typed-date` is specifically designed as a date input field with segment navigation, not a date picker with a popup calendar. If you need a full calendar picker component, consider libraries like [react-day-picker](https://react-day-picker.js.org/) alongside this library.

Before choosing this library, consider exploring these alternatives. As `react-typed-date` is a hobby project, these alternatives might offer more extensive feature sets:

- [React Aria DateField](https://react-spectrum.adobe.com/react-aria/DateField.html) - Adobe's accessible implementation with comprehensive keyboard support and robust accessibility features, though it requires additional dependencies
- [MUI X Date Field](https://mui.com/x/react-date-pickers/date-field) - Material UI's polished implementation offering strong validation and formatting capabilities, but closely integrated with MUI's design system
- [RSuite DateInput](https://rsuitejs.com/components/date-input/) - Clean, well-documented implementation within the RSuite component ecosystem
- [Hero UI](https://www.heroui.com/docs/components/date-input) - Newer component library built on React Aria's foundation with consistent design patterns
- [React Date Picker](https://projects.wojtekmaj.pl/react-date-picker/) - Established library offering both segmented input and calendar functionality in one package
- [Native Date Input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date) - Browser's built-in implementation requiring no dependencies, but with limited styling options and inconsistent cross-browser behavior

Each alternative presents different tradeoffs regarding bundle size, styling flexibility, and dependencies. What sets `react-typed-date` apart is its focus on providing core functionality with zero dependencies while offering complete styling freedom.

## Installation

```bash
npm install react-typed-date
# or
yarn add react-typed-date
# or
pnpm add react-typed-date
```

## Basic Usage

```jsx
import React, { useState } from 'react';
import { TypedDateInput } from 'react-typed-date';

function App() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="App">
      <label htmlFor="birthday">Date of Birth:</label>
      <TypedDateInput
        id="birthday"
        value={date} 
        onChange={setDate}
        className="date-input" 
      />
    </div>
  );
}
```

## Advanced Usage with Hook

Use the hook directly for more control and custom UI:

```jsx
import React, { useState } from 'react';
import { useTypedDate } from 'react-typed-date';

function CustomDateInput() {
  const [date, setDate] = useState(new Date());
  
  const { inputProps } = useTypedDate({
    value: date,
    onChange: setDate
  });

  return (
    <div className="custom-date-container">
      <input 
        {...inputProps} 
        className="date-input"
        aria-label="Date input"
      />
    </div>
  );
}
```

## User Experience

`react-typed-date` provides a seamless user experience:

1. Click anywhere in the date field to focus a segment (month, day, or year)
2. Type numbers to replace the segment value
3. Use arrow keys to navigate between segments (← →) 
4. Use up/down arrows (↑ ↓) to increment/decrement values
5. Press "/" to jump to the next segment

## API Reference

### TypedDateInput Component

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `Date \| undefined` | `undefined` | Selected date value |
| `onChange` | `(date: Date \| undefined) => void` | `undefined` | Callback when date changes |
| `className` | `string` | `undefined` | CSS class for styling |
| `...props` | `InputHTMLAttributes<HTMLInputElement>` | | Any other valid input props except `type`, `onMouseUp`, `onKeyDown`, `ref` |

### useTypedDate Hook

```typescript
function useDateField(options: {
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

## Styling

The component accepts a `className` prop for styling. You can use any CSS-in-JS library, utility classes like Tailwind, or plain CSS.

Basic CSS example:

```css
.date-input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: monospace;
  font-size: 16px;
  width: 140px;
  text-align: center;
}

.date-input:focus {
  outline: none;
  border-color: #0066ff;
  box-shadow: 0 0 0 2px rgba(0, 102, 255, 0.2);
}
```

## Roadmap

The following features are planned for future releases:

- **Custom date formats**: Support for different date formats beyond MM/DD/YYYY
- **Date library integration**: Support for popular date libraries like date-fns, Day.js, and Moment.js
- **Localization**: International date formats and localized month/day names
- **Time picker**: Add support for time input alongside date
- **Range selection**: Allow selecting date ranges
- **Validation**: Add date validation feedback

## License

MIT
