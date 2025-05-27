import { Snackbar, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  Card,
  CardContent,
  CardActions,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase';

interface Project {
  id: string;
  name: string;
  description: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');


  const fetchProjects = async () => {
    const querySnapshot = await getDocs(collection(db, 'projects'));
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Project[];
    setProjects(data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const addProject = async () => {
    if (name.trim()) {
      await addDoc(collection(db, 'projects'), {
        name,
        description,
      });
      setName('');
      setDescription('');
      fetchProjects();
    }
  };

  
  const deleteProject = async (id: string) => {
    await deleteDoc(doc(db, 'projects', id));
    fetchProjects();
  };

  const updateProject = async () => {
    if (editProject) {
      const projectRef = doc(db, 'projects', editProject.id);
      await updateDoc(projectRef, {
        name: editProject.name,
        description: editProject.description,
      });
      fetchProjects();
      setDialogOpen(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Projects
      </Typography>
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Project Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                variant="outlined"
                size="small"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                variant="outlined"
                size="small"
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Button variant="contained" onClick={addProject}>
            Add Project
          </Button>
        </CardActions>
      </Card>

      <Grid container spacing={3}>
        {projects.map((project) => (
          <Grid item xs={12} sm={6} md={4} key={project.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{project.name}</Typography>
                <Typography color="textSecondary">
                  {project.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => {
                    setEditProject(project);
                    setDialogOpen(true);
                  }}
                >
                  Edit
                </Button>

             <Button
                size="small"
                color="error"
                onClick={() => {
                  setProjectToDelete(project);
                  setDeleteDialogOpen(true);
                }}
              >
                Delete
              </Button>



              
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Edit Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Project Name"
            fullWidth
            value={editProject?.name || ''}
            onChange={(e) =>
              setEditProject(
                editProject ? { ...editProject, name: e.target.value } : null
              )
            }
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={editProject?.description || ''}
            onChange={(e) =>
              setEditProject(
                editProject
                  ? { ...editProject, description: e.target.value }
                  : null
              )
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button onClick={updateProject} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to delete the project{' '}
              <strong>{projectToDelete?.name}</strong>?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button
                onClick={async () => {
                  if (projectToDelete) {
                    await deleteProject(projectToDelete.id);
                    setDeleteDialogOpen(false);
                    setProjectToDelete(null);
                    setSnackbarMessage('Project berhasil dihapus');
                    setSnackbarOpen(true);
                  }
                }}
                color="error"
              >
                Delete
              </Button>

          </DialogActions>
        </Dialog>

        
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={() => setSnackbarOpen(false)}
              severity="success"
              sx={{ width: '100%' }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>

    </Box>
  );
}