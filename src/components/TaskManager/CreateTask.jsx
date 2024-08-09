import React, { useState, useEffect } from 'react';

const CreateTask = ({ onClose, onTaskCreate, priorities, states, users, authState, projectId }) => {
  const storedProjectId = localStorage.getItem('currentProjectId'); 
  
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: '',
    status: '',
    assigned_to: '',
    due_date: '', // Nuevo campo agregado
    project: projectId || storedProjectId, // Agrega el ID del proyecto
  });

  useEffect(() => {
    if (projectId) {
      setTaskData((prevState) => ({
        ...prevState,
        project: projectId,
      }));
    }
  }, [projectId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    console.log("datos enviados al crear la tarea: ", taskData);
    try {
      const response = await fetch('https://sandbox.academiadevelopers.com/taskmanager/tasks/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authState.token}`,
        },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const newTask = await response.json();
      onTaskCreate(newTask);
      onClose();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="box">
          <h2 className="title">Crear Tarea</h2>
          <form onSubmit={handleSave}>
            <div className="field">
              <label className="label">Título</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="title"
                  value={taskData.title}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Descripción</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="description"
                  value={taskData.description}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Fecha de Vencimiento</label>
              <div className="control">
                <input
                  className="input"
                  type="date"
                  name="due_date"
                  value={taskData.due_date}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Prioridad</label>
              <div className="control">
                <div className="select">
                  <select
                    name="priority"
                    value={taskData.priority}
                    onChange={handleChange}
                  >
                    {priorities.length > 0 ? (
                      priorities.map(priority => (
                        <option key={priority.id} value={priority.id}>
                          {priority.priority}
                        </option>
                      ))
                    ) : (
                      <option value="">No priorities available</option>
                    )}
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Estado</label>
              <div className="control">
                <div className="select">
                  <select
                    name="status"
                    value={taskData.status}
                    onChange={handleChange}
                  >
                    {states.length > 0 ? (
                      states.map(state => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No states available</option>
                    )}
                  </select>
                </div>
              </div>
            </div>
            <div className="field">
              <label className="label">Usuario Asignado</label>
              <div className="control">
                <div className="select">
                  <select
                    name="assigned_to"
                    value={taskData.assigned_to}
                    onChange={handleChange}
                  >
                    {users.length > 0 ? (
                      users.map(user => (
                        <option key={user.user__id} value={user.user__id}>
                          {user.last_name} {user.first_name}
                        </option>
                      ))
                    ) : (
                      <option value="">No users available</option>
                    )}
                  </select>
                </div>
              </div>
            </div>
            <div className="field is-grouped">
              <div className="control">
                <button className="button is-primary" type="submit">
                  Guardar
                </button>
              </div>
              <div className="control">
                <button
                  className="button"
                  type="button"
                  onClick={onClose}
                >
                  Cancelar
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

export default CreateTask;
