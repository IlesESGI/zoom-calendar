import React, {useState} from 'react';
import './App.css';
import Container from '@material-ui/core/Container';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Calendar, View, DateLocalizer } from 'react-big-calendar'
import { momentLocalizer } from 'react-big-calendar';
import moment from 'moment'
import 'moment/locale/fr';

const localizer = momentLocalizer(moment);

const allViews: View[] = ['week'];

interface Props {
  localizer: DateLocalizer;
}

class CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  tooltip?: string;

  constructor(_title: string, _start: Date, _endDate: Date) {
    this.title = _title;
    this.start = _start;
    this.end = _endDate;
  }
}

const App: React.FC = () => {

  const [events, setEvents] = useState([] as CalendarEvent[]);



  const handleSelect = ({ start, end } : { start: any; end: any}) => {
    const title = window.prompt('New Event name')

    if (title) {
        let newEvent = {} as CalendarEvent;
        newEvent.start = moment(start).toDate();
        newEvent.end = moment(end).toDate();
        newEvent.title = title;
        setEvents([
          ...events,
          newEvent
        ])
    }
  }

  return (
    <div className="App">
      <Container maxWidth="md">
        <Calendar
          selectable
          localizer={localizer}
          events={events}
          defaultView={allViews[0]}
          scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={new Date(2015, 3, 12)}
          onSelectEvent={event => alert(event.title)}
          onSelectSlot={handleSelect}
          culture={'fr'}
          step={15}
        />
      </Container>
    </div>
  );
}

export default App;
