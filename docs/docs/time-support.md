---
id: time-support
title: Time Support
sidebar_position: 4
---

# Flexible Time Support

React Typed Date supports flexible time input with different precision levels: hours with minutes, or full seconds support alongside date selection.

## Quick Start

```jsx
import { TypedDateInput } from 'react-typed-date';

function App() {
  const [dateTime, setDateTime] = useState(new Date());
  
  return (
    <TypedDateInput
      format="MM/DD/YYYY HH:mm"
      value={dateTime}
      onChange={setDateTime}
    />
  );
}
```

## Time Format Patterns

### Available Time Segments
- **HH**: Hour in 24-hour format (00-23)  
- **mm**: Minutes (00-59)
- **ss**: Seconds (00-59)

### Common Formats
```jsx
// US format with time
<TypedDateInput format="MM/DD/YYYY HH:mm" />

// European format with time  
<TypedDateInput format="DD/MM/YYYY HH:mm" />

// With seconds support
<TypedDateInput format="MM/DD/YYYY HH:mm:ss" />

// European with seconds
<TypedDateInput format="DD/MM/YYYY HH:mm:ss" />

// ISO-like format with seconds
<TypedDateInput format="YYYY-MM-DD HH:mm:ss" />
```

## User Interaction

### Keyboard Navigation
- **Tab/Shift+Tab**: Move between segments
- **Arrow Left/Right**: Navigate between segments
- **Arrow Up/Down**: Increment/decrement values
- **Number keys**: Direct input with auto-advance

### Time Validation
- Hours automatically clamp to 0-23 range
- Minutes automatically clamp to 0-59 range
- Invalid entries are corrected on blur or segment completion

## Examples

### Meeting Scheduler
```jsx
function MeetingScheduler() {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(() => {
    const end = new Date();
    end.setHours(end.getHours() + 1);
    return end;
  });

  return (
    <div>
      <label>
        Start: 
        <TypedDateInput
          format="MM/DD/YYYY HH:mm"
          value={startTime}
          onChange={setStartTime}
        />
      </label>
      
      <label>
        End:
        <TypedDateInput  
          format="MM/DD/YYYY HH:mm"
          value={endTime}
          onChange={setEndTime}
        />
      </label>
    </div>
  );
}
```

### Business Hours Validation
```jsx
function AppointmentBooking() {
  const [appointment, setAppointment] = useState(new Date());
  
  const handleTimeChange = (date) => {
    const hour = date.getHours();
    
    if (hour < 9 || hour >= 17) {
      // Handle business hours validation
      console.warn('Outside business hours');
    }
    
    setAppointment(date);
  };
  
  return (
    <TypedDateInput
      format="MM/DD/YYYY HH:mm"
      value={appointment}
      onChange={handleTimeChange}
    />
  );
}
```

### Time Zone Display
```jsx
function TimeZoneConverter() {
  const [localTime, setLocalTime] = useState(new Date());
  
  return (
    <div>
      <TypedDateInput
        format="MM/DD/YYYY HH:mm"
        value={localTime}
        onChange={setLocalTime}
      />
      
      <div>
        <p>Local: {localTime.toLocaleString()}</p>
        <p>UTC: {localTime.toISOString().slice(0, 16).replace('T', ' ')}</p>
      </div>
    </div>
  );
}
```

## Technical Details

### Date Object Integration
When using time formats, the component creates complete Date objects with both date and time components:

```jsx
const handleChange = (date) => {
  console.log(date.getFullYear()); // Year
  console.log(date.getMonth());    // Month (0-11)
  console.log(date.getDate());     // Day
  console.log(date.getHours());    // Hours (0-23)
  console.log(date.getMinutes());  // Minutes (0-59)
};
```

### Default Time Values
- When creating a new date, time defaults to current time
- When only date segments are filled, time defaults to 00:00
- Partial time input is preserved during editing

### Validation Behavior
- **Real-time**: Values are clamped as you type
- **On blur**: Incomplete entries are validated
- **Arrow keys**: Respect min/max boundaries (no overflow)

## Migration from Date-Only

Existing date-only implementations are fully compatible:

```jsx
// This continues to work unchanged
<TypedDateInput format="MM/DD/YYYY" />

// Simply add time segments to enable time support
<TypedDateInput format="MM/DD/YYYY HH:mm" />
```

No breaking changes to existing functionality.