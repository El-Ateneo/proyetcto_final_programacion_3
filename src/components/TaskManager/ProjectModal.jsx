import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';
import TaskModal from './TaskModal';
import CreateTask from './CreateTask'; // Importa el nuevo componente
import { useAuth } from '../../contexts/AuthContext';

const ProjectModal = ({ project, onClose, onProjectUpdate }) => {
  const { state: authState } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projectData, setProjectData] = useState({
    name: project ? project.name : '',
    description: project ? project.description : '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false); // Estado para el nuevo modal
  const [selectedTask, setSelectedTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [priorities, setPriorities] = useState([]);

  // Guardar el ID del proyecto en localStorage cuando el modal se abre
  useEffect(() => {
    if (project) {
      setProjectData({
        name: project.name,
        description: project.description,
      });
      localStorage.setItem('currentProjectId', project.id);
    }
  }, [project]);

  useEffect(() => {
    const token = authState.token;
    if (project) {
      fetch(`https://sandbox.academiadevelopers.com/taskmanager/tasks/?project=${project.id}`, {
        headers: {
          'Authorization': `Token ${token}`
        }
      })
      .then(response => response.json())
      .then(data => setTasks(data.results))
      .catch(error => console.error('Error fetching tasks:', error));
    }
  }, [project, authState.token]);

  useEffect(() => {
    fetchUsers();
    fetchPriorities();
  }, [authState.token]);

  const fetchUsers = async () => {
    const token = authState.token;
    try {
      const response = await fetch('https://sandbox.academiadevelopers.com/users/profiles/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      const data = await response.json();
      setUsers(data.results);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchPriorities = async () => {
    const token = authState.token;
    try {
      const response = await fetch('https://sandbox.academiadevelopers.com/taskmanager/priorities/', {
        headers: {
          'Authorization': `Token ${token}`
        }
      });
      const data = await response.json();
      setPriorities(data.results);
    } catch (error) {
      console.error('Error fetching priorities:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const token = authState.token;
    const url = project 
      ? `https://sandbox.academiadevelopers.com/taskmanager/projects/${project.id}/`
      : 'https://sandbox.academiadevelopers.com/taskmanager/projects/';
    const method = project ? 'PATCH' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify(projectData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error ${response.status}: ${errorData.detail || 'Error saving project'}`);
      }

      const updatedProject = await response.json();
      onProjectUpdate(updatedProject);
      onClose();
    } catch (error) {
      setError(error.message);
      console.error('Error saving project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProject = async () => {
    setIsLoading(true);
    const token = authState.token;

    try {
      const response = await fetch(`https://sandbox.academiadevelopers.com/taskmanager/projects/${project.id}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Error ${response.status}: ${errorData.detail || 'Error deleting project'}`);
      }

      onClose();
    } catch (error) {
      setError(error.message);
      console.error('Error deleting project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = () => {
    setSelectedTask(null);
    setIsCreateTaskModalOpen(true); // Abre el modal de creación de tareas
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskModalClose = () => {
    setIsTaskModalOpen(false);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(prevTasks => {
      const taskIndex = prevTasks.findIndex(t => t.id === updatedTask.id);
      if (taskIndex !== -1) {
        const newTasks = [...prevTasks];
        newTasks[taskIndex] = updatedTask;
        return newTasks;
      } else {
        return [...prevTasks, updatedTask];
      }
    });
  };

  const handleTaskDelete = (deletedTaskId) => {
    setTasks(prevTasks => prevTasks.filter(t => t.id !== deletedTaskId));
  };

  const handleCreateTaskClose = () => {
    setIsCreateTaskModalOpen(false);
  };

  const handleCreateTask = (newTask) => {
    setTasks([...tasks, newTask]);
    setIsCreateTaskModalOpen(false);
  };

  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="box">
          <h2 className="title">{project ? 'Editar Proyecto' : 'Crear Proyecto'}</h2>
          {error && <p className="has-text-danger">{error}</p>}
          <form onSubmit={handleSaveProject}>
            <div className="field">
              <label className="label">Nombre del Proyecto</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="name"
                  value={projectData.name} 
                  onChange={handleChange}
                  placeholder="Nombre del Proyecto"
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Descripción del Proyecto</label>
              <div className="control">
                <textarea
                  className="textarea"
                  name="description"
                  value={projectData.description}
                  onChange={handleChange}
                  placeholder="Descripción del Proyecto"
                ></textarea>
              </div>
            </div>
            <div className="field is-grouped">
              <div className="control">
                <button className="button is-primary" type="submit" disabled={isLoading}>
                  {isLoading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
              {project && (
                <div className="control">
                  <button
                    className="button is-danger"
                    type="button"
                    onClick={handleDeleteProject}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              )}
              <div className="control">
                <button
                  className="button"
                  type="button"
                  onClick={onClose}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
          {project && (
            <div>
              <h3 className="title is-5 mt-4">Tareas del Proyecto</h3>
              <TaskList tasks={tasks} onEditTask={handleEditTask} onDeleteTask={handleTaskDelete} />
            </div>
          )}
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
      {isCreateTaskModalOpen && (
        <CreateTask
          onClose={handleCreateTaskClose}
          onTaskCreate={handleCreateTask}
          users={users}
          priorities={priorities}
          projectId={project ? project.id : ''} // Pasa el ID del proyecto
        />
      )}
    </div>
  );
};

export default ProjectModal;
