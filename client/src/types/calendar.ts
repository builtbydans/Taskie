export type BackendCalendarEvent = {
  id: string;
  user_id: string;
  title: string;
  start_time: string;
  end_time: string;
  type: string;
};

export type CreateCalendarEventPayload = {
  title: string;
  start_time: string;
  end_time: string;
  type: string;
};
