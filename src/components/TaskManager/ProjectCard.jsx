import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProjectModal from './ProjectModal';
import TaskModal from './TaskModal'; // Importa el componente TaskModal


const ProjectCard = ({ project, onProjectUpdate, onProjectDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false); // Nuevo estado para el modal de tareas
 
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null); // Nuevo estado para la tarea seleccionada
  
  const [users, setUsers] = useState({});
  const [statuses, setStatuses] = useState({});
  const [priorities, setPriorities] = useState({});
  const { state: authState } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`https://sandbox.academiadevelopers.com/taskmanager/tasks/?project=${project.id}`, {
          headers: {
            'Authorization': `Token ${authState.token}`,
          },
        });
        const data = await response.json();
        setTasks(data.results);
        fetchUsers(data.results.map(task => task.assigned_to).concat(data.results.map(task => task.owner)));
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    const fetchUsers = async (userIds) => {
      try {
        const uniqueUserIds = [...new Set(userIds)];
        const userPromises = uniqueUserIds.map(id => 
          fetch(`https://sandbox.academiadevelopers.com/users/profiles/${id}/`, {
            headers: {
              'Authorization': `Token ${authState.token}`,
            },
          }).then(response => response.json())
        );
        const userResponses = await Promise.all(userPromises);
        const userMap = userResponses.reduce((acc, user) => {
          acc[user.user__id] = `${user.first_name} ${user.last_name}`;
          return acc;
        }, {});
        setUsers(userMap);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchStatuses = async () => {
      try {
        const response = await fetch('https://sandbox.academiadevelopers.com/taskmanager/task-states/', {
          headers: {
            'Authorization': `Token ${authState.token}`,
          },
        });
        const data = await response.json();
        const statusMap = data.results.reduce((acc, status) => {
          acc[status.id] = status.name;
          return acc;
        }, {});
        setStatuses(statusMap);
      } catch (error) {
        console.error('Error fetching statuses:', error);
      }
    };

    const fetchPriorities = async () => {
      try {
        const response = await fetch('https://sandbox.academiadevelopers.com/taskmanager/task-priorities/', {
          headers: {
            'Authorization': `Token ${authState.token}`,
          },
        });
        const data = await response.json();
        const priorityMap = data.results.reduce((acc, priority) => {
          acc[priority.id] = priority.priority;
          return acc;
        }, {});
        setPriorities(priorityMap);
      } catch (error) {
        console.error('Error fetching priorities:', error);
      }
    };

    fetchTasks();
    fetchStatuses();
    fetchPriorities();
  }, [project.id, authState.token]);

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsTaskModalOpen(true);
  };

  const handleTaskSave = (updatedTask) => {
    setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
    setIsTaskModalOpen(false);
  };

  const handleCloseProjectModal = () => {
    setIsProjectModalOpen(false);
  };
  const handleDelete = async (taskId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      try {
        await fetch(`https://sandbox.academiadevelopers.com/taskmanager/tasks/${taskId}/`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Token ${authState.token}`,
          },
        });
        setTasks(tasks.filter(task => task.id !== taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    //onProjectUpdate();
  };

  return (
    <div className="card">
      <header className="card-header">
        <h3 className="card-header-title"><strong>Proyecto: "</strong>{project.name}"</h3>
        <button className="card-header-icon" aria-label="more options" onClick={() => setIsModalOpen(true)}>
          <span className="icon">
            <i className="fas fa-edit" aria-hidden="true"></i>
          </span>
        </button>
        <button className="card-header-icon" aria-label="delete" onClick={() => handleDelete(project.id)}>
          <span className="icon">
            <i className="fas fa-trash" aria-hidden="true"></i>
          </span>
        </button>
      </header>
      <div className="card-content">
        <div className="content">
          <p><strong>Descripción: </strong>{project.description || 'No disponible'}</p>
          <table className="table is-fullwidth">
            <thead>
              <tr>
                <th>Título</th>
                <th>Descripción</th>
                <th>Prioridad</th>
                <th>Estado</th>
                <th>Asignado a</th>
                <th>Creado por</th>
                <th>Fecha de Vencimiento</th> {/* Nueva columna agregada */}                
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{priorities[task.priority]}</td>
                  <td>{statuses[task.status]}</td>
                  <td>{users[task.assigned_to]}</td>
                  <td>{users[task.owner]}</td>
                  <td>{task.due_date}</td> {/* Nuevo campo agregado */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && (
        <ProjectModal
          project={project}
          onClose={handleCloseModal}
          onProjectUpdate={onProjectUpdate}
        />
      )}
      {isTaskModalOpen && selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setIsTaskModalOpen(false)}
          onSave={handleTaskSave}
        />
      )}
    </div>
  );
};

export default ProjectCard;