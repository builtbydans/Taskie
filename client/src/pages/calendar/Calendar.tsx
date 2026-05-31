import { useState, useEffect } from "react";
import { apiFetch } from "../../lib/api";

import { Scheduler } from "calendarkit-pro";
import type { ViewType } from "calendarkit-pro";

import { TaskEventCard } from "../../components/tasks/TaskEventCard";

import type { BackendCalendarEvent } from "../../types/calendar";

const customTheme = {
  colors: {
    primary: "#6366f1", // Primary accent color
    secondary: "#ec4899", // Secondary color
    background: "#ffffff", // Background color
    foreground: "#0f172a", // Text color
    border: "#e2e8f0", // Border color
    muted: "#f1f5f9", // Muted backgrounds
    accent: "#f1f5f9", // Accent backgrounds
  },
  fontFamily: "Inter, sans-serif",
  borderRadius: "0.75rem",
};

const calendars = [
  { id: "work", label: "Work", color: "#3b82f6", active: true },
  { id: "personal", label: "Personal", color: "#10b981", active: true },
  { id: "family", label: "Family", color: "#8b5cf6", active: false },
];

type SchedulerEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type?: string;
};

const Calendar = () => {
  const [events, setEvents] = useState<SchedulerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [view, setView] = useState<ViewType>("day");
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const eventsData: BackendCalendarEvent[] = await apiFetch("/calendar");

        // Transform backend shape → scheduler shape
        const formattedEvents: SchedulerEvent[] = eventsData.map((event) => ({
          id: event.id,
          title: event.title,
          start: new Date(event.start_time),
          end: new Date(event.end_time),
          type: event.type,
        }));

        setEvents(formattedEvents);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error has occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCreateEvent = async (event: any) => {
    try {
      // 1. Scheduler shape -> backend payload
      const payload = {
        title: event.title ?? "Untitled Event",

        start_time: event.start?.toISOString() ?? new Date().toISOString(),

        end_time: event.end?.toISOString() ?? new Date().toISOString(),

        type: event.type ?? "WORK",
      };

      // 2. Persist to backend
      const createdEvent: BackendCalendarEvent = await apiFetch("/calendar", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // 3. Backend shape -> scheduler shape
      const formattedEvent: SchedulerEvent = {
        id: createdEvent.id,
        title: createdEvent.title,

        start: new Date(createdEvent.start_time),

        end: new Date(createdEvent.end_time),

        type: createdEvent.type,
      };

      // 4. Update UI state
      setEvents((prev) => [...prev, formattedEvent]);
    } catch (err) {
      console.error("Failed to create event", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="dark">
      <div className="h-full">
        <Scheduler
          events={events}
          theme={customTheme}
          calendars={calendars}
          view={view}
          onViewChange={setView}
          date={date}
          onDateChange={setDate}
          onEventCreate={handleCreateEvent}
          onEventUpdate={(event) => {
            setEvents(events.map((e) => (e.id === event.id ? event : e)));
          }}
          onEventDelete={(id) => {
            setEvents(events.filter((e) => e.id !== id));
          }}
          onEventResize={(event, newStart, newEnd) => {
            setEvents((prev) =>
              prev.map((e) =>
                e.id === event.id ? { ...e, start: newStart, end: newEnd } : e
              )
            );
          }}
          onEventDrop={(event, newStart, newEnd) => {
            setEvents(
              events.map((e) =>
                e.id === event.id ? { ...e, start: newStart, end: newEnd } : e
              )
            );
          }}
        />
      </div>
    </div>
  );
};

export default Calendar;
