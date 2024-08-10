import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import CreateProjectModal from './CreateProjectModal';

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [nextURL, setNextURL] = useState(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { state: authState } = useAuth();

  const fetchProjects = async () => {
    if (!authState.profile) {
      console.error("El perfil del usuario no está disponible.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`https://sandbox.academiadevelopers.com/taskmanager/projects/?page=${page}`, {
        headers: {
          'Authorization': `Token ${authState.token}`,
        },
      });

      if (!response.ok) {
        throw new Error("No se pudieron cargar los proyectos");
      }

      const data = await response.json();
      if (data.results) {
        const userProjects = data.results.filter(project => {
          const isOwner = project.owner === authState.profile.user__id;
          const isMember = Array.isArray(project.members) && project.members.includes(authState.profile.user__id);
          return isOwner || isMember;
        });

        setProjects(prevProjects => [...prevProjects, ...userProjects]);
        setNextURL(data.next);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authState.profile) {
      fetchProjects();
    }
  }, [page, authState.profile]);

  const handleLoadMore = () => {
    if (nextURL) {
      setPage(prevPage => prevPage + 1);
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const handleProjectUpdate = (updatedProject) => {
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === updatedProject.id ? updatedProject : project
      )
    );
  };  

  const handleCloseModal = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  const handleProjectCreate = (newProject) => {
    setProjects(prevProjects => [...prevProjects, newProject]);
  };

  const handleProjectDelete = (projectId) => {
    setProjects(prevProjects => prevProjects.filter(project => project.id !== projectId));
  };

  return (
    <div className="container">
      <h1 className="title is-color-info">Lista de Proyectos</h1>
      <button className="button is-primary" onClick={() => setIsCreateModalOpen(true)}>
        Nuevo Proyecto
      </button>
      <div className="mt-4">
        {projects.map(project => (
          <div key={project.id}>
            <ProjectCard
              project={project}
              onProjectUpdate={(updatedProject) => setProjects(
                prevProjects => prevProjects.map(p => (p.id === updatedProject.id ? updatedProject : p))
              )}
              onProjectDelete={handleProjectDelete}
              onClick={() => handleProjectClick(project)}
              
            /><p> </p>
          </div>
        ))}
      </div>
      {isLoading && <p>Cargando más proyectos...</p>}
      {nextURL && !isLoading && (
        <button className="button is-primary" onClick={handleLoadMore}>
          Cargar Proyectos
        </button>
      )}
      {isModalOpen && (
        <ProjectModal 
          project={selectedProject} 
          onClose={handleCloseModal}
          onProjectUpdate={handleProjectUpdate} // Asegúrate de pasar esta prop
        />
      )}
      {isCreateModalOpen && (
        <CreateProjectModal
          onClose={() => setIsCreateModalOpen(false)}
          onProjectCreate={handleProjectCreate}
        />
      )}
    </div>
  );
};

export default ProjectList;
