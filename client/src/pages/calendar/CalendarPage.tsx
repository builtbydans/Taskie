import { useState, useEffect } from "react";
import { apiFetch } from "../../lib/api";

import { Scheduler } from "calendarkit-pro";
import type { ViewType } from "calendarkit-pro";

import { CalendarEventCard } from "../../components/calendar/CalendarEventCard";

import type { BackendCalendarEvent } from "../../types/calendar";

type SchedulerEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type?: string;
};

const CalendarPage = () => {
  const [events, setEvents] = useState<SchedulerEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [view, setView] = useState<ViewType>("week");
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const eventsData: BackendCalendarEvent[] =
          await apiFetch("/calendar");

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

      start_time:
        event.start?.toISOString() ??
        new Date().toISOString(),

      end_time:
        event.end?.toISOString() ??
        new Date().toISOString(),

      type: event.type ?? "WORK",
    };

    // 2. Persist to backend
    const createdEvent: BackendCalendarEvent =
      await apiFetch("/calendar", {
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
    setEvents((prev) => [
      ...prev,
      formattedEvent,
    ]);

    } catch (err) {

      console.error("Failed to create event", err);

    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <h1 className="text-red-500">Calendar</h1>

      <div className="flex w-full">
        <div className="w-[80%]">
        <Scheduler
          events={events}
          view={view}
          onViewChange={setView}
          date={date}
          onDateChange={setDate}
          onEventCreate={handleCreateEvent}

          onEventUpdate={(event) => {
            setEvents(
              events.map((e) =>
                e.id === event.id ? event : e
              )
            );
          }}

          onEventDelete={(id) => {
            setEvents(
              events.filter((e) => e.id !== id)
            );
          }}
        />
        </div>
        <div>
         {events.map((event) => (
          <CalendarEventCard
            key={event.id}
            eventId={event.id}
            title={event.title}
            startTime={event.start.toISOString()}
            endTime={event.end.toISOString()}
            type={event.type || ""}
          />
        ))}
        </div>
      </div>
    </>
  );
};

export default CalendarPage;
