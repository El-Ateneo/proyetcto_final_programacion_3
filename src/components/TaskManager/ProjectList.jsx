import React, { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('https://sandbox.academiadevelopers.com/taskmanager/projects/')
      .then(response => response.json())
      .then(data => setProjects(data.results));
  }, []);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1>Project List</h1>
      <button onClick={() => setIsModalOpen(true)}>Create New Project</button>
      <div>
        {projects.map(project => (
          <ProjectCard key={project.id} project={project} onClick={() => handleProjectClick(project)} />
        ))}
      </div>
      {isModalOpen && (
        <ProjectModal project={selectedProject} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ProjectList;
