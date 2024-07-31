import React, { useState, useEffect } from 'react';
import TaskList from './TaskList';

const ProjectModal = ({ project, onClose }) => {
  const [tasks, setTasks] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [projectData, setProjectData] = useState({
    name: project ? project.name : '',
    description: project ? project.description : '',
  });

  useEffect(() => {
    if (project) {
      fetch(`https://sandbox.academiadevelopers.com/taskmanager/tasks/?project=${project.id}`)
        .then(response => response.json())
        .then(data => setTasks(data.results));
    }
  }, [project]);

  const handleSaveProject = () => {
    // Save project data
    onClose();
  };

  const handleDeleteProject = () => {
    // Delete project
    onClose();
  };

  return (
    <div>
      <h1>{project ? 'Edit Project' : 'Create Project'}</h1>
      <input
        type="text"
        value={projectData.name}
        onChange={e => setProjectData({ ...projectData, name: e.target.value })}
        placeholder="Project Name"
      />
      <textarea
        value={projectData.description}
        onChange={e => setProjectData({ ...projectData, description: e.target.value })}
        placeholder="Project Description"
      />
      <button onClick={handleSaveProject}>Save</button>
      {project && <button onClick={handleDeleteProject}>Delete</button>}
      <button onClick={onClose}>Close</button>
      {project && <TaskList tasks={tasks} projectId={project.id} />}
    </div>
  );
};

export default ProjectModal;
