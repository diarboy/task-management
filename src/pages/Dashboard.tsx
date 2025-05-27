import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
  LinearProgress,
  Divider,
  Chip,
  Stack,
} from '@mui/material';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

interface Stats {
  totalTasks: number;
  completedTasks: number;
  totalProjects: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats>({
    totalTasks: 0,
    completedTasks: 0,
    totalProjects: 0,
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchStats = async () => {
      const tasksSnapshot = await getDocs(collection(db, 'tasks'));
      const projectsSnapshot = await getDocs(collection(db, 'projects'));

      const completedTasks = tasksSnapshot.docs.filter(doc => doc.data().completed).length;

      setStats({
        totalTasks: tasksSnapshot.size,
        completedTasks,
        totalProjects: projectsSnapshot.size,
      });

      setLoading(false);
    };

    fetchStats();
  }, []);

  const formatNumber = (num: number): string =>
    new Intl.NumberFormat().format(num);

  const progress: number =
    stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0;

  const ratio =
    stats.totalTasks > 0
      ? (stats.totalProjects / stats.totalTasks).toFixed(2)
      : '0.00';

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Dashboard Overview
      </Typography>
      <Typography variant="subtitle1" color="textSecondary" gutterBottom>
        Ringkasan aktivitas proyek, tugas, dan progres Anda
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={3}>
        {/* Total Tasks */}
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: '#e3f2fd', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary">
                Total Tasks
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {formatNumber(stats.totalTasks)}
              </Typography>
              <Typography variant="caption">Tugas tercatat</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Completed Tasks */}
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: '#e8f5e9', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary">
                Completed Tasks
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {formatNumber(stats.completedTasks)}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 10, borderRadius: 5, mt: 1, mb: 1 }}
              />
              <Typography variant="caption">{progress}% selesai</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Projects */}
        <Grid item xs={12} sm={4}>
          <Card sx={{ backgroundColor: '#fff3e0', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary">
                Total Projects
              </Typography>
              <Typography variant="h4" fontWeight="bold">
                {formatNumber(stats.totalProjects)}
              </Typography>
              <Typography variant="caption">Proyek aktif</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Completion Rate */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ backgroundColor: '#ede7f6', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary">
                Task Completion Rate
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="primary">
                {progress}%
              </Typography>
              <Typography variant="caption">Tingkat penyelesaian tugas</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Project-to-Task Ratio */}
        <Grid item xs={12} sm={6}>
          <Card sx={{ backgroundColor: '#fce4ec', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary">
                Project-to-Task Ratio
              </Typography>
              <Typography variant="h4" fontWeight="bold" color="secondary">
                {ratio}
              </Typography>
              <Typography variant="caption">Jumlah proyek per tugas</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Status Ringkasan */}
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: '#f1f8e9', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Ringkasan Status Tugas
              </Typography>
              <Stack direction="row" spacing={2}>
                <Chip
                  label={`Selesai: ${stats.completedTasks}`}
                  color="success"
                  variant="outlined"
                />
                <Chip
                  label={`Belum Selesai: ${stats.totalTasks - stats.completedTasks}`}
                  color="error"
                  variant="outlined"
                />
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
