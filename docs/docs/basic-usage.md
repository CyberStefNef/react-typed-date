---
id: basic-usage
title: Basic Usage
sidebar_position: 3
---

## Basic Date Input

```jsx
import { useState } from 'react';
import { TypedDateInput } from 'react-typed-date';

function App() {
  const [date, setDate] = useState(new Date());

  return (
    <div className="App">
      <TypedDateInput
        value={date} 
        onChange={setDate}
      />
    </div>
  );
}
```

## Date with Time Support

The component now supports 24-hour time format alongside date input:

```jsx
import { useState } from 'react';
import { TypedDateInput } from 'react-typed-date';

function DateTimeApp() {
  const [dateTime, setDateTime] = useState(new Date());

  return (
    <div className="App">
      <TypedDateInput
        format="MM/DD/YYYY HH:mm"
        value={dateTime} 
        onChange={setDateTime}
      />
    </div>
  );
}
```

## Different Date and Time Formats

You can customize both date and time formats:

```jsx
// US format with time
<TypedDateInput format="MM/DD/YYYY HH:mm" value={date} onChange={setDate} />

// European format with time
<TypedDateInput format="DD/MM/YYYY HH:mm" value={date} onChange={setDate} />

// Date only (original functionality)
<TypedDateInput format="MM/DD/YYYY" value={date} onChange={setDate} />

// European date only
<TypedDateInput format="DD/MM/YYYY" value={date} onChange={setDate} />
```

## User Experience with Time

When using time formats, the component provides intuitive interaction:

1. **Segment Navigation**: Click or use arrow keys to move between date and time segments
2. **Time Input**: Type numbers for hours (0-23) and minutes (0-59)
3. **Validation**: Automatic clamping of invalid time values
4. **Arrow Key Adjustment**: Use ↑/↓ to increment/decrement time values

The time segments work seamlessly with the existing date functionality, maintaining the same keyboard-friendly experience.
