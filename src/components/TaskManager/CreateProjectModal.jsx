import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

const CreateProjectModal = ({ onClose, onProjectCreate }) => {
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
  });
  const [error, setError] = useState(null);
  const { state: authState } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjectData({ ...projectData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://sandbox.academiadevelopers.com/taskmanager/projects/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${authState.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      if (response.status === 201) {
        const newProject = await response.json();
        onProjectCreate(newProject);
        onClose();
      } else {
        const errorData = await response.json();
        throw new Error(`Error ${response.status}: ${errorData.detail || 'Error creating project'}`);
      }
    } catch (error) {
      setError(error.message);
      console.error('Error creating project:', error);
    }
  };

  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="box">
          <h2 className="title">Create New Project</h2>
          {error && <p className="has-text-danger">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Project Name</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="name"
                  value={projectData.name}
                  onChange={handleChange}
                  placeholder="Project Name"
                  required
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Project Description</label>
              <div className="control">
                <textarea
                  className="textarea"
                  name="description"
                  value={projectData.description}
                  onChange={handleChange}
                  placeholder="Project Description"
                  required
                ></textarea>
              </div>
            </div>
            <div className="field">
              <div className="control">
                <button className="button is-primary" type="submit">
                  Create
                </button>
                <button className="button" type="button" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
    </div>
  );
};

export default CreateProjectModal;
