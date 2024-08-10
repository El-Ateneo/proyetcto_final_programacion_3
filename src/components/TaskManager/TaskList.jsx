import React, { useState, useEffect } from 'react';
import TaskCard from './TaskCard';
import CreateTask from './CreateTask';
import TaskModal from './TaskModal';
import { useAuth } from '../../contexts/AuthContext';

const TaskList = ({ projectId }) => {
  const [tasks, setTasks] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [states, setStates] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { state: authState } = useAuth();

  useEffect(() => {
    if (projectId) {
      fetchTasks();
    }
    fetchPriorities();
    fetchStates();
    fetchAllUsers();
  }, [authState.token, projectId]); // Añade projectId a las dependencias

  const fetchTasks = async () => {
    if (!projectId) return; // Asegúrate de que projectId esté disponible

    try {
      const response = await fetch(`https://sandbox.academiadevelopers.com/taskmanager/tasks/?project=${projectId}`, {
        headers: {
          'Authorization': `Token ${authState.token}`,
        },
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setTasks(data.results);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const fetchPriorities = async () => {
    try {
      const response = await fetch('https://sandbox.academiadevelopers.com/taskmanager/task-priorities/', {
        headers: {
          'Authorization': `Token ${authState.token}`,
        },
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setPriorities(data.results);
    } catch (error) {
      console.error('Error fetching priorities:', error);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await fetch('https://sandbox.academiadevelopers.com/taskmanager/task-states/', {
        headers: {
          'Authorization': `Token ${authState.token}`,
        },
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setStates(data.results);
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchAllUsers = async () => {
    let allUsers = [];
    let page = 1;
    let hasMore = true;

    try {
      while (hasMore) {
        const response = await fetch(`https://sandbox.academiadevelopers.com/users/profiles/?page=${page}`, {
          headers: {
            'Authorization': `Token ${authState.token}`,
          },
        });
        const data = await response.json();
        allUsers = allUsers.concat(data.results);
        hasMore = !!data.next;
        page += 1;
      }
      setUsers(allUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleOpenTaskModal = (task) => {
    setSelectedTask(task);
  };

  const handleOpenCreateTaskModal = () => {
    setSelectedTask(null);
    setShowCreateModal(true);
  };

  const handleCreateTask = (newTask) => {
    setTasks([...tasks, newTask]);
    setShowCreateModal(false);
  };

  const handleDeleteTask = async (taskId) => {
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
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks(tasks.map(task => (task.id === updatedTask.id ? updatedTask : task)));
  };

  return (
    <div>
      <button className="button is-link mb-4" onClick={handleOpenCreateTaskModal}>
        Añadir Tarea
      </button>
      <div className="task-list">
        {tasks.length > 0 ? (
          tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onTaskUpdate={handleUpdateTask}
              onTaskDelete={handleDeleteTask}
              priorities={priorities}
              states={states}
              users={users}
            />
          ))
        ) : (
          <p>No hay tareas disponibles</p>
        )}
      </div>
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskUpdate={handleUpdateTask}
          priorities={priorities}
          states={states}
          users={users}
        />
      )}
      {showCreateModal && (
        <CreateTask
          onClose={() => setShowCreateModal(false)}
          onTaskCreate={handleCreateTask}
          priorities={priorities}
          states={states}
          users={users}
          authState={authState}
          projectId={projectId} // Pasa el ID del proyecto
        />
      )}
    </div>
  );
};

export default TaskList;
