---
id: basic-usage
title: Basic Usage
sidebar_position: 3
---

## Basic Usage

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
