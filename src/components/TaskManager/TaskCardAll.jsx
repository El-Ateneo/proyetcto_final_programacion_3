import React, { useState, useEffect } from 'react';
import TaskModal from './TaskModal'; // Asegúrate de importar el TaskModal
import { useAuth } from '../../contexts/AuthContext';

const TaskCard = ({ task, onTaskUpdate, onTaskDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState({});
  const [statuses, setStatuses] = useState({});
  const [priorities, setPriorities] = useState({});
  const { state: authState } = useAuth();

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const userIds = [task.assigned_to, task.owner];
        const statusId = task.status;
        const priorityId = task.priority;
        
        // Fetch users
        if (userIds.some(id => id)) {
          const uniqueUserIds = [...new Set(userIds)];
          const userPromises = uniqueUserIds
          .filter(id => id) // Filtra IDs no válidos
          .map(id =>
            fetch(`https://sandbox.academiadevelopers.com/users/profiles/${id}/`, {
              headers: { 'Authorization': `Token ${authState.token}` }
            }).then(response => response.json())
          );
          const userResponses = await Promise.all(userPromises);
          const userMap = userResponses.reduce((acc, user) => {
            acc[user.user__id] = `${user.first_name} ${user.last_name}`;
            return acc;
          }, {});
          setUsers(userMap);
        }

        // Fetch statuses
        const statusResponse = await fetch('https://sandbox.academiadevelopers.com/taskmanager/task-states/', {
          headers: { 'Authorization': `Token ${authState.token}` }
        });
        const statusData = await statusResponse.json();
        const statusMap = statusData.results.reduce((acc, status) => {
          acc[status.id] = status.name;
          return acc;
        }, {});
        setStatuses(statusMap);

        // Fetch priorities
        const priorityResponse = await fetch('https://sandbox.academiadevelopers.com/taskmanager/task-priorities/', {
          headers: { 'Authorization': `Token ${authState.token}` }
        });
        const priorityData = await priorityResponse.json();
        const priorityMap = priorityData.results.reduce((acc, priority) => {
          acc[priority.id] = priority.priority;
          return acc;
        }, {});
        setPriorities(priorityMap);

      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchTaskDetails();
  }, [authState.token, task]);

  const handleEdit = () => setIsModalOpen(true);

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta tarea?')) {
      await onTaskDelete(task.id);
    }
  };

  const handleModalClose = () => setIsModalOpen(false);

  const handleTaskUpdate = (updatedTask) => {
    onTaskUpdate(updatedTask);
    setIsModalOpen(false);
  };

  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title">{task.title}</p>
      </header>
      <div className="card-content">
        <div className="content">
          <p><strong>Descripcion: </strong> {task.description || 'sin descripcion'}</p>
          <p><strong>fecha de entrega: </strong> {task.due_date || 'sin fecha ded entega'}</p>
          <p><strong>Prioridad: </strong> {priorities[task.priority] || 'sin prioridad'}</p>
          <p><strong>Asignado A: </strong> {users[task.assigned_to] || 'sin asignacion'}</p>
          <p><strong>Creado Por: </strong> {users[task.owner] || 'sin dato del creador'}</p>
          <p><strong>Estado: </strong> {statuses[task.status] || 'sin estado'}</p>
        </div>
      </div>
      <footer className="card-footer">
        <button className="card-footer-item button is-primary" onClick={handleEdit}>
          Edit
        </button>
        <button className="card-footer-item button is-danger" onClick={handleDelete}>
          Delete
        </button>
      </footer>
      {isModalOpen && (
        <TaskModal
          task={task}
          onClose={handleModalClose}
          onSave={handleTaskUpdate}
          priorities={priorities}
          statuses={statuses}
          users={users}
        />
      )}
    </div>
  );
};

export default TaskCard;
