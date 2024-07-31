import React, { useState, useEffect } from 'react';

const TaskModal = ({ task, projectId, onClose }) => {
  const [taskData, setTaskData] = useState({
    title: task ? task.title : '',
    description: task ? task.description : '',
    due_date: task ? task.due_date : '',
  });

  const handleSaveTask = () => {
    // Save task data
    onClose();
  };

  const handleDeleteTask = () => {
    // Delete task
    onClose();
  };

  return (
    <div>
      <h1>{task ? 'Edit Task' : 'Create Task'}</h1>
      <input
        type="text"
        value={taskData.title}
        onChange={e => setTaskData({ ...taskData, title: e.target.value })}
        placeholder="Task Title"
      />
      <textarea
        value={taskData.description}
        onChange={e => setTaskData({ ...taskData, description: e.target.value })}
        placeholder="Task Description"
      />
      <input
        type="date"
        value={taskData.due_date}
        onChange={e => setTaskData({ ...taskData, due_date: e.target.value })}
        placeholder="Due Date"
      />
      <button onClick={handleSaveTask}>Save</button>
      {task && <button onClick={handleDeleteTask}>Delete</button>}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default TaskModal;
