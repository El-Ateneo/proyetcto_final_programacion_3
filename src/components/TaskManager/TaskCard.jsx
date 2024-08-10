import React, { useState, useEffect } from 'react';
import TaskModal from './TaskModal';
import { useAuth } from '../../contexts/AuthContext';

const TaskCard = ({ task, onTaskUpdate, onTaskDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const { state: authState } = useAuth();

  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        // Fetch users
        const userIds = [task.assigned_to, task.owner];
        if (userIds.some(id => id)) {
          const uniqueUserIds = [...new Set(userIds)];
          const userPromises = uniqueUserIds
            .filter(id => id)
            .map(id =>
              fetch(`https://sandbox.academiadevelopers.com/users/profiles/${id}/`, {
                headers: { 'Authorization': `Token ${authState.token}` }
              }).then(response => response.json())
            );
          const userResponses = await Promise.all(userPromises);
          setUsers(userResponses.map(user => ({
            user__id: user.user__id,
            fullName: `${user.first_name} ${user.last_name}`
          })));
        }

        // Fetch statuses
        const statusResponse = await fetch('https://sandbox.academiadevelopers.com/taskmanager/task-states/', {
          headers: { 'Authorization': `Token ${authState.token}` }
        });
        const statusData = await statusResponse.json();
        setStatuses(statusData.results.map(status => ({
          id: status.id,
          name: status.name
        })));

        // Fetch priorities
        const priorityResponse = await fetch('https://sandbox.academiadevelopers.com/taskmanager/task-priorities/', {
          headers: { 'Authorization': `Token ${authState.token}` }
        });
        const priorityData = await priorityResponse.json();
        setPriorities(priorityData.results.map(priority => ({
          id: priority.id,
          priority: priority.priority
        })));

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
          <p><strong>Descripción: </strong> {task.description || 'sin descripción'}</p>
          <p><strong>Fecha de Entrega: </strong> {task.due_date || 'sin fecha de entrega'}</p>
          <p><strong>Prioridad: </strong> {priorities.find(p => p.id === task.priority)?.priority || 'sin prioridad'}</p>
          <p><strong>Asignado A: </strong> {users.find(u => u.user__id === task.assigned_to)?.fullName || 'sin asignación'}</p>
          <p><strong>Creado Por: </strong> {users.find(u => u.user__id === task.owner)?.fullName || 'sin dato del creador'}</p>
          <p><strong>Estado: </strong> {statuses.find(s => s.id === task.status)?.name || 'sin estado'}</p>
        </div>
      </div>
      <footer className="card-footer">
        <button className="card-footer-item button is-primary" onClick={handleEdit}>
          Editar
        </button>
        <button className="card-footer-item button is-danger" onClick={handleDelete}>
          Eliminar
        </button>
      </footer>
      {isModalOpen && (
        <TaskModal
          task={task}
          onClose={handleModalClose}
          onTaskUpdate={handleTaskUpdate}
          priorities={priorities}
          states={statuses}
          users={users}
          authState={authState}
          projectId={task.project}
        />
      )}
    </div>
  );
};

export default TaskCard;
