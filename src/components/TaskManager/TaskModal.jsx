import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext';

const TaskModal = ({ task, onClose, onTaskUpdate, states = [], users = [] }) => {
  const [taskData, setTaskData] = useState(task);
  const { state: authState } = useAuth();
  const [priorities, setPriorities] = useState([]);

  useEffect(() => {
    setTaskData(task);
    fetchPriorities();
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`https://sandbox.academiadevelopers.com/taskmanager/tasks/${taskData.id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${authState.token}`,
        },
        body: JSON.stringify(taskData),
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const updatedTask = await response.json();
      onTaskUpdate(updatedTask);
      onClose();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const fetchPriorities = async () => {
    try {
      const response = await fetch('https://sandbox.academiadevelopers.com/taskmanager/priorities/', {
        headers: {
          'Authorization': `Token ${authState.token}`
        }
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
      const data = await response.json();
      setPriorities(data.results);
    } catch (error) {
      console.error('Error fetching priorities:', error);
    }
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={onClose}></div>
      <div className="modal-content">
        <div className="box">
          <h2 className="title">Editar Tarea</h2>
          <form onSubmit={handleSave}>
            <div className="field">
              <label className="label">Título</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  name="title"
                  value={taskData.title || ''}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="field">
              <label className="label">Descripción</label>
              <div className="control">
                <textarea
                  className="textarea"
                  name="description"
                  value={taskData.description || ''}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            <div className="field">
              <label className="label">Fecha de Vencimiento</label>
              <div className="control">
                <input
                  className="input"
                  type="date"
                  name="due_date"
                  value={taskData.due_date || ''}
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
                    value={taskData.priority || ''}
                    onChange={handleChange}
                  >
                    {priorities.length > 0 ? (
                      priorities.map(priority => (
                        <option key={priority.id} value={priority.id}>
                          {priority.priority}
                        </option>
                      ))
                    ) : (
                      <option value="">No hay prioridades disponibles</option>
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
                    value={taskData.status || ''}
                    onChange={handleChange}
                  >
                    {states.length > 0 ? (
                      states.map(state => (
                        <option key={state.id} value={state.id}>
                          {state.name}
                        </option>
                      ))
                    ) : (
                      <option value="">No hay estados disponibles</option>
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
                    value={taskData.assigned_to || ''}
                    onChange={handleChange}
                  >
                    {users.length > 0 ? (
                      users.map(user => (
                        <option key={user.user__id} value={user.user__id}>
                          {user.last_name} {user.first_name}
                        </option>
                      ))
                    ) : (
                      <option value="">No hay usuarios disponibles</option>
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

TaskModal.propTypes = {
  task: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onTaskUpdate: PropTypes.func.isRequired,
  states: PropTypes.array,
  users: PropTypes.array,
};

export default TaskModal;
