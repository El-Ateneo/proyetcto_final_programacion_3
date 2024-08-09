import React from 'react';

const TaskCard = ({ task, onTaskUpdate }) => {
  return (
    <div className="card">
      <header className="card-header">
        <p className="card-header-title">{task.title}</p>
      </header>
      <div className="card-content">
        <div className="content">
          <p><strong>Description:</strong> {task.description}</p>
          <p><strong>Due Date:</strong> {task.due_date}</p>
          <p><strong>Priority:</strong> {task.priority}</p>
          <p><strong>Assigned To:</strong> {task.assigned_to}</p>
          <p><strong>Status:</strong> {task.status === 0 ? 'Pending' : task.status === 1 ? 'In Progress' : 'Completed'}</p>
        </div>
      </div>
      <footer className="card-footer">
        <button className="card-footer-item button is-primary" onClick={() => onTaskUpdate(task)}>
          Edit
        </button>
      </footer>
    </div>
  );
};

export default TaskCard;
