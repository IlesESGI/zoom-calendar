import React, { useState } from 'react';
import './App.css';
import Container from '@material-ui/core/Container';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Calendar, View, DateLocalizer } from 'react-big-calendar'
import { momentLocalizer } from 'react-big-calendar';
import moment from 'moment'
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
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
  const [step, setStep] = useState(30);

  const handleChangeStep = (event: any) => {
      setStep(Number(event.target.value));
  };

  const handleSelect = ({ start, end }: { start: any; end: any }) => {
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
      <FormControl >
        <InputLabel >
          Step
        </InputLabel>
        <Select
          labelId="simple-select-placeholder-label"
          id="simple-select"
          value={step}
          onChange={handleChangeStep}
          displayEmpty
        >
          <MenuItem value={15}>15 mn</MenuItem>
          <MenuItem value={30}>30 mn</MenuItem>
          <MenuItem value={60}>1 h</MenuItem>
        </Select>
        <FormHelperText>Durée minimum d'une réunion</FormHelperText>
      </FormControl>
      <Container maxWidth="md">
        <Calendar
          selectable
          localizer={localizer}
          events={events}
          views={['week']}
          defaultView={allViews[0]}
          scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={new Date(2015, 3, 12)}
          onSelectEvent={event => alert(event.title)}
          onSelectSlot={handleSelect}
          culture={'fr'}
          step={step}
        />
      </Container>
    </div>
  );
}

export default App;
