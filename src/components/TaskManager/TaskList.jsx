import React, { useState } from 'react';
import TaskModal from './TaskModal';

const TaskList = ({ tasks, projectId }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCreateTask = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <h2>Tasks</h2>
      <button onClick={handleCreateTask}>Create New Task</button>
      <div>
        {tasks.map(task => (
          <div key={task.id} onClick={() => handleTaskClick(task)}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <TaskModal task={selectedTask} projectId={projectId} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default TaskList;
