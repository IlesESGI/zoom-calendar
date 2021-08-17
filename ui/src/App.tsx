import React, { useState, useEffect } from 'react';
import './App.css';
import Container from '@material-ui/core/Container';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, View } from 'react-big-calendar';
import { momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
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
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { Color } from '@material-ui/lab/Alert/Alert';
import set_meeting from './services/request_zoom';

const localizer = momentLocalizer(moment);
const allViews: View[] = ['week'];

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
  const [step, setStep] = useState(15);
  const [open, setOpen] = useState(false);
  const [client, setClient] = useState('');
  const [openAlert, setOpenAlert] = useState(false);
  const [severity, setSeverity] = useState('success');
  const [newEvent, setNewEvent] = useState({} as CalendarEvent);

  interface messagesObject {
    previousDate: string;
    lunchTime: string;
    concurentMeeting: string;
    clientMissing: string;
    success: string;
    [key: string]: string;
  }

  const messagesAlertBox: messagesObject = {
    previousDate:
      'Impossible de positionner un créneau à cette heure car la date choisie est antérieure à la date actuelle !',
    lunchTime:
      'Impossible de positionner un créneau à cette heure pendant la pause midi !',
    concurentMeeting:
      'Impossible de positionner un créneau à cette heure car il y a deja un créneau de programmer à cette heure !',
    clientMissing:
      "Impossible de positionner un créneau si le nom du client n'est pas renseigné",
    success: 'Rendez-vous correctement posé !',
    error: "Une erreur s'est produite vérifier si les services fonctionnent !",
  };

  const [message, setMessage] = useState(messagesAlertBox['success']);
  const handleCloseModalCancel = () => {
    setOpen(false);
    setClient('');
  };

  useEffect(() => {
    fetch('http://localhost:8081/api/meeting/all')
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result);
          const pick = (O: any, ...K: any) =>
            K.reduce((o: any, k: any) => ((o[k] = O[k]), o), {});
          let meetings = result.response.meetings.map((x: any) => {
            return pick(x, 'start_time', 'topic', 'duration');
          });

          meetings.forEach((x: any) => {
            x.title = x.topic;
            delete x.topic;
            x.start = new Date(x.start_time);
            delete x.start_time;
            x.end = moment(x.start).add(x.duration, 'minutes').toDate();
            delete x.duration;
          });
          setEvents(meetings);
          console.log(meetings);
        },
        (error) => {
          console.log(error);
          setSeverity('error');
          setMessage('error');
          setOpenAlert(true);
        }
      );
  }, []);

  const handleCloseModalValidate = () => {
    if (!client) {
      setSeverity('error');
      setMessage('clientMissing');
      setOpenAlert(true);
      return;
    }

    let deepCloneNewEvent = {} as CalendarEvent;
    deepCloneNewEvent.start = moment(newEvent.start).toDate();
    deepCloneNewEvent.end = moment(newEvent.end).toDate();
    deepCloneNewEvent.title = client;
    const duration = moment
      .duration(
        moment(deepCloneNewEvent.end).diff(moment(deepCloneNewEvent.start))
      )
      .asMinutes();

    set_meeting(client, deepCloneNewEvent.start, duration)
      .then((response: any) => {
        if (response.status === 200) {
          setSeverity('success');
          setMessage('success');
          setOpenAlert(true);
          setNewEvent(deepCloneNewEvent);
          setEvents([...events, deepCloneNewEvent]);
          setOpen(false);
          setClient('');
        }
      })
      .catch((error: any) => {
        console.log(error);
        setSeverity('error');
        setMessage('error');
        setOpenAlert(true);
      });
  };

  const handleChangeClient = (event: any) => {
    setClient(event.target.value);
  };

  function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  const handleCloseAlert = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenAlert(false);
  };

  const today = new Date();
  const minRangeHour = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    9,
    0,
    0
  );
  const maxRangeHour = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    19,
    0,
    0
  );

  const handleChangeStep = (event: any) => {
    setStep(Number(event.target.value));
  };

  const handleSelect = ({ start, end }: { start: any; end: any }) => {
    if (!checkEventHours({ start, end })) {
      setSeverity('error');
      setMessage('concurentMeeting');
      setOpenAlert(true);
      return;
    }

    if (!checkLunchHours({ start, end })) {
      setSeverity('error');
      setMessage('lunchTime');
      setOpenAlert(true);
      return;
    }

    if (!checkPreviousHours({ start, end })) {
      setSeverity('error');
      setMessage('previousDate');
      setOpenAlert(true);
      return;
    }

    let newEvent = {} as CalendarEvent;
    newEvent.start = moment(start).toDate();
    newEvent.end = moment(end).toDate();

    setNewEvent(newEvent);
    setOpen(true);
  };

  const checkEventHours = ({ start, end }: { start: Date; end: Date }) => {
    for (const meeting of events) {
      if (dateRangeOverlaps(meeting.start, meeting.end, start, end)) {
        return false;
      }
    }
    return true;
  };

  const checkLunchHours = ({ start, end }: { start: Date; end: Date }) => {
    if (
      dateRangeOverlapsWide(
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          13,
          0,
          0
        ),
        new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate(),
          14,
          0,
          0
        ),
        start,
        end
      )
    ) {
      return false;
    }
    return true;
  };

  const checkPreviousHours = ({ start, end }: { start: Date; end: Date }) => {
    const currentTime = new Date();
    if (start < currentTime || end < currentTime) {
      return false;
    }

    return true;
  };

  function dateRangeOverlaps(
    a_start: Date,
    a_end: Date,
    b_start: Date,
    b_end: Date
  ) {
    if (a_start < b_start && b_start < a_end) return true;
    if (a_start < b_end && b_end < a_end) return true;
    if (b_start < a_start && a_end < b_end) return true;
    if (
      b_start.getTime() === a_start.getTime() ||
      a_end.getTime() === b_end.getTime()
    )
      return true;
    return false;
  }

  function dateRangeOverlapsWide(
    a_start: Date,
    a_end: Date,
    b_start: Date,
    b_end: Date
  ) {
    if (a_start <= b_start && b_start <= a_end) return true;
    if (a_start <= b_end && b_end <= a_end) return true;
    if (b_start <= a_start && a_end <= b_end) return true;
    return false;
  }

  return (
    <div className="App">
      <div>
        <Dialog
          open={open}
          onClose={handleCloseModalCancel}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">
            Création d'une réunion Zoom
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              {`Nom du client avec qui la réunion aura lieu de ${moment(
                newEvent.start
              ).format('LLLL')} à ${moment(newEvent.end).format('LLLL')} :`}
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
            <Button onClick={handleCloseModalCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleCloseModalValidate} color="primary">
              Valider
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
        <FormControl>
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
      <Snackbar
        open={openAlert}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
      >
        <Alert onClose={handleCloseAlert} severity={severity as Color}>
          {messagesAlertBox[message]}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default App;
