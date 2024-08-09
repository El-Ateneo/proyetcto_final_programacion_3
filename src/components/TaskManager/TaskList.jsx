import React, { useState, useEffect } from 'react';
import TaskModal from './TaskModal';
import CreateTask from './CreateTask'; // Importa el nuevo componente
import { useAuth } from '../../contexts/AuthContext';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [users, setUsers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false); // Estado para mostrar el modal de creación
  const { state: authState } = useAuth();

  useEffect(() => {
    fetchTasks();
    fetchPriorities();
    fetchStates();
    fetchAllUsers();
  }, []); // Dependencias removidas

  const fetchTasks = async () => {
    try {
      const response = await fetch('https://sandbox.academiadevelopers.com/taskmanager/tasks/', {
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
    setShowCreateModal(true); // Muestra el modal de creación de tarea
  };

  const handleCreateTask = (newTask) => {
    setTasks([...tasks, newTask]);
    setShowCreateModal(false); // Cierra el modal de creación de tarea
  };

  return (
    <div>
      <button className="button is-primary" onClick={handleOpenCreateTaskModal}>
        Crear Nueva Tarea
      </button>
      {tasks.length > 0 ? (
        tasks.map(task => (
          <div key={task.id} onClick={() => handleOpenTaskModal(task)}>
            {task.title}
          </div>
        ))
      ) : (
        <p>No tasks available</p>
      )}
      {selectedTask && (
        <TaskModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onTaskUpdate={(updatedTask) => {
            const updatedTasks = tasks.map(task =>
              task.id === updatedTask.id ? updatedTask : task
            );
            setTasks(updatedTasks);
          }}
          priorities={priorities}
          states={states}
          users={users}
          authState={authState}
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
        />
      )}
    </div>
  );
};

export default TaskList;
