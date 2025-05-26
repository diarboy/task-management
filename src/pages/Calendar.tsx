import { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
} from '@mui/material';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<Grid item xs={1.7} key={`empty-${i}`} />);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(
        <Grid item xs={1.7} key={day}>
          <Paper
            sx={{
              p: 2,
              height: 80,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: 'action.hover',
              },
            }}
          >
            <Typography>{day}</Typography>
          </Paper>
        </Grid>
      );
    }

    return days;
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Calendar
      </Typography>
      
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Button onClick={() => changeMonth(-1)}>Previous Month</Button>
        <Typography variant="h6">
          {currentDate.toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
        </Typography>
        <Button onClick={() => changeMonth(1)}>Next Month</Button>
      </Box>

      <Grid container spacing={1}>
        {daysOfWeek.map((day) => (
          <Grid item xs={1.7} key={day}>
            <Paper
              sx={{
                p: 1,
                bgcolor: 'primary.main',
                color: 'white',
                textAlign: 'center',
              }}
            >
              <Typography>{day}</Typography>
            </Paper>
          </Grid>
        ))}
        {renderCalendar()}
      </Grid>
    </Box>
  );
}