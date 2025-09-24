# Component Architecture

This directory contains all the React components organized by functionality for better maintainability.

## Structure

```
src/components/
├── common/           # Shared/reusable components
│   ├── PinButton.jsx        # Pin toggle button
│   ├── LockButton.jsx       # Lock functionality button
│   ├── SettingsButton.jsx   # Settings menu button
│   ├── TimerButton.jsx      # Timer mode toggle button
│   └── index.js            # Common components exports
├── clock/            # Clock-specific components
│   ├── ClockDisplay.jsx     # Main clock display
│   ├── DateHeader.jsx       # Date header component
│   ├── MiddleSection.jsx    # Clock mode middle section
│   ├── SecondsBox.jsx       # Seconds display
│   ├── Signature.jsx        # Brand signature
│   ├── TimeBox.jsx          # Individual time unit display
│   └── index.js            # Clock components exports
├── timer/            # Timer-specific components
│   ├── PomodoroTimer.jsx    # Pomodoro timer component
│   └── index.js            # Timer components exports
└── index.js          # Main components barrel export
```

## Usage

### Import specific components:

```jsx
import { PinButton, LockButton } from "./components/common";
import { MiddleSection } from "./components/clock";
import { PomodoroTimer } from "./components/timer";
```

### Import everything:

```jsx
import {
  PinButton,
  LockButton,
  MiddleSection,
  PomodoroTimer,
} from "./components";
```

## Component Categories

### Common Components

- **Purpose**: Reusable UI components used across the app
- **Examples**: Buttons, controls, shared UI elements

### Clock Components

- **Purpose**: Components specific to clock display functionality
- **Examples**: Time display, date header, clock face elements

### Timer Components

- **Purpose**: Components specific to timer/pomodoro functionality
- **Examples**: Timer display, progress indicators, timer controls

## Benefits

- ✅ **Better organization**: Components grouped by functionality
- ✅ **Easier maintenance**: Clear separation of concerns
- ✅ **Cleaner imports**: Barrel exports for simplified importing
- ✅ **Scalable structure**: Easy to add new components in appropriate categories
- ✅ **Better discoverability**: Developers can quickly find relevant components
