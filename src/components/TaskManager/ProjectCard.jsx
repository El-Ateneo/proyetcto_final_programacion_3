import React from 'react';

const ProjectCard = ({ project, onClick }) => {
  return (
    <div onClick={onClick}>
      <h2>{project.name}</h2>
      <p>{project.description}</p>
    </div>
  );
};

export default ProjectCard;
