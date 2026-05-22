import { Scheduler, CalendarEvent, ViewType, Resource } from 'calendarkit-pro';
import { useState } from 'react';

export default function MyCalendar( {}) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<ViewType>('week');
  const [date, setDate] = useState(new Date());
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <Scheduler
      events={events}
      view={view}
      onViewChange={setView}
      date={date}
      onDateChange={setDate}
      isDarkMode={isDarkMode}
      onThemeToggle={() => setIsDarkMode(!isDarkMode)}
      onEventCreate={(event) => {
        setEvents([...events, { ...event, id: Date.now().toString() }]);
      }}
    />
  );
}
