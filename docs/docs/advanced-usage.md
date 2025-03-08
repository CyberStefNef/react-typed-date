---
id: advanced-usage
title: Advanced Usage
sidebar_position: 4
---

## Using the Hook Directly

```jsx
import React, { useState } from 'react';
import { useTypedDate } from 'react-typed-date';

function CustomDateInput() {
  const [date, setDate] = useState(new Date());
  
  const { inputProps } = useTypedDate({
    value: date,
    onChange: setDate,
    format: "MM/DD/YYYY"
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
