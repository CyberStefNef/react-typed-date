---
id: advanced-usage
title: Advanced Usage
sidebar_position: 5
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

## Advanced DateTime Examples

### Meeting Scheduler with Time

```jsx
import React, { useState } from 'react';
import { useTypedDate } from 'react-typed-date';

function MeetingScheduler() {
  const [meetingStart, setMeetingStart] = useState(new Date());
  const [meetingEnd, setMeetingEnd] = useState(new Date());
  
  const startProps = useTypedDate({
    value: meetingStart,
    onChange: setMeetingStart,
    format: "MM/DD/YYYY HH:mm"
  });

  const endProps = useTypedDate({
    value: meetingEnd,
    onChange: setMeetingEnd,
    format: "MM/DD/YYYY HH:mm"
  });

  return (
    <div className="meeting-scheduler">
      <label>
        Meeting Start:
        <input 
          {...startProps.inputProps} 
          className="datetime-input"
        />
      </label>
      
      <label>
        Meeting End:
        <input 
          {...endProps.inputProps} 
          className="datetime-input"
        />
      </label>
      
      <div className="meeting-summary">
        <p>Duration: {Math.round((meetingEnd - meetingStart) / 60000)} minutes</p>
      </div>
    </div>
  );
}
```

### European Format with Time

```jsx
import React, { useState } from 'react';
import { TypedDateInput } from 'react-typed-date';

function EuropeanDateTimeInput() {
  const [appointment, setAppointment] = useState(new Date());
  
  return (
    <div className="appointment-form">
      <label>
        Appointment Date & Time:
        <TypedDateInput
          format="DD/MM/YYYY HH:mm"
          value={appointment}
          onChange={setAppointment}
          className="european-datetime"
        />
      </label>
      
      <div className="formatted-output">
        <p>Selected: {appointment.toLocaleString('en-GB')}</p>
      </div>
    </div>
  );
}
```

### Time Zone Aware Component

```jsx
import React, { useState, useEffect } from 'react';
import { TypedDateInput } from 'react-typed-date';

function TimeZoneAwareDateInput() {
  const [localTime, setLocalTime] = useState(new Date());
  const [utcTime, setUtcTime] = useState(new Date());
  
  useEffect(() => {
    // Update UTC time when local time changes
    setUtcTime(new Date(localTime.getTime()));
  }, [localTime]);

  return (
    <div className="timezone-container">
      <div className="input-group">
        <label>
          Local Time:
          <TypedDateInput
            format="MM/DD/YYYY HH:mm"
            value={localTime}
            onChange={setLocalTime}
          />
        </label>
      </div>
      
      <div className="timezone-display">
        <p>Local: {localTime.toLocaleString()}</p>
        <p>UTC: {utcTime.toISOString().slice(0, 16).replace('T', ' ')}</p>
      </div>
    </div>
  );
}
```

### Custom Validation with Time

```jsx
import React, { useState } from 'react';
import { TypedDateInput } from 'react-typed-date';

function BusinessHoursInput() {
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [error, setError] = useState('');
  
  const handleTimeChange = (date) => {
    const hour = date.getHours();
    
    // Validate business hours (9 AM - 5 PM)
    if (hour < 9 || hour >= 17) {
      setError('Please select a time during business hours (9:00 - 17:00)');
    } else {
      setError('');
    }
    
    setSelectedTime(date);
  };
  
  return (
    <div className="business-hours-input">
      <label>
        Appointment Time:
        <TypedDateInput
          format="MM/DD/YYYY HH:mm"
          value={selectedTime}
          onChange={handleTimeChange}
          className={error ? 'input-error' : ''}
        />
      </label>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="help-text">
        Business hours: 9:00 AM - 5:00 PM
      </div>
    </div>
  );
}
```

## Performance Optimization

For forms with multiple datetime inputs, you can optimize re-renders:

```jsx
import React, { useState, useCallback } from 'react';
import { TypedDateInput } from 'react-typed-date';

function OptimizedForm() {
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  
  const handleStartChange = useCallback((date) => {
    setStartTime(date);
  }, []);
  
  const handleEndChange = useCallback((date) => {
    setEndTime(date);
  }, []);
  
  return (
    <form>
      <TypedDateInput
        format="MM/DD/YYYY HH:mm"
        value={startTime}
        onChange={handleStartChange}
      />
      <TypedDateInput
        format="MM/DD/YYYY HH:mm"
        value={endTime}
        onChange={handleEndChange}
      />
    </form>
  );
}
```
