import React, { useState } from 'react';
import './App.css';
import Container from '@material-ui/core/Container';
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { Calendar, View, DateLocalizer } from 'react-big-calendar'
import { momentLocalizer } from 'react-big-calendar';
import moment from 'moment'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Box from '@material-ui/core/Box';
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
  const [open, setOpen] = React.useState(false);
  const [client, setClient] = useState('');

  const messagesAltertBox = {
    previousDate: "Impossible de positionner un créneau à cette heure car la date choisie est antérieure à la date actuelle !",
    lunchTime: "Impossible de positionner un créneau à cette heure pendant la pause midi !",
    concurentMeeting: "Impossible de positionner un créneau à cette heure car il y a deja un créneau de programmer à ette heure !"
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeClient = (event: any) => {
    setClient(event.target.value);
    console.log(client);
  }

  const today = new Date();
  const minRangeHour = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 7, 0, 0);
  const maxRangeHour = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 21, 0, 0);

  const handleChangeStep = (event: any) => {
    setStep(Number(event.target.value));
  };

  const handleSelect = ({ start, end }: { start: any; end: any }) => {
    //handleClickOpen

    setOpen(true);

    if (client) {
      let newEvent = {} as CalendarEvent;
      newEvent.start = moment(start).toDate();
      newEvent.end = moment(end).toDate();
      newEvent.title = client;
      setEvents([
        ...events,
        newEvent
      ])
    }
  }

  return (
    <div className="App">
      <div>
        <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Création d'une réunion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Nom du client avec qui la réunion aura lieu :
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="client"
              fullWidth
              value={client}
              onChange={handleChangeClient}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={handleClose} color="primary">
              Subscribe
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <Box m={2} />
      <Container maxWidth="md">
        <Calendar
          selectable
          localizer={localizer}
          events={events}
          views={['week']}
          defaultView={allViews[0]}
          defaultDate={today}
          onSelectSlot={handleSelect}
          culture={'fr'}
          step={step}
          min={minRangeHour}
          max={maxRangeHour}
        />
        <Box m={2} />
        <FormControl >
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
      </Container>
    </div>
  );
}

export default App;
