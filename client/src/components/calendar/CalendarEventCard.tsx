import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "../ui/alert"

type eventProps = {
  eventId: string,
  title: string,
  startTime: string,
  endTime: string,
  type: string
}

export function CalendarEventCard({ eventId, title, startTime, endTime, type }: eventProps) {
  return (
    <div className="grid w-full max-w-md items-start gap-4">
      <Alert>
        <AlertTitle>{title} : {eventId}</AlertTitle>
        <AlertDescription>
          <ul>
            <li>Start Time: {startTime}</li>
            <li>End Time: {endTime}</li>
            <li>   Type: {type}</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  )
}
