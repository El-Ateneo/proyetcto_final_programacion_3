import React, { useState, useEffect } from 'react';

const TaskModal = ({ task, onClose, onTaskUpdate, priorities, states, authState, projectId }) => {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    priority: '',
    status: '',
    assigned_to: '', // Valor por defecto
    due_date: '',
    project: projectId || '',
  });
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAllUsers = async () => {
      let allUsers = [];
      let page = 1;
      let hasMore = true;

      try {
        setIsLoading(true);
        while (hasMore) {
          const response = await fetch(`https://sandbox.academiadevelopers.com/users/profiles/?page=${page}`, {
            headers: {
              'Authorization': `Token ${authState.token}`,
            },
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          allUsers = allUsers.concat(data.results);
          hasMore = !!data.next;
          page += 1;
        }
        setUsers(allUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllUsers();

    if (task) {
      setTaskData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || '',
        status: task.status || '',
        assigned_to: task.assigned_to || '', // Configura el usuario asignado
        due_date: task.due_date || '',
        project: task.project || projectId || '',
      });
    }
  }, [task, projectId, authState.token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData({ ...taskData, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const url = task ? `https://sandbox.academiadevelopers.com/taskmanager/tasks/${task.id}/` : 'https://sandbox.academiadevelopers.com/taskmanager/tasks/';
      const method = task ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
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
      console.error('Error saving task:', error);
    }
  };

  return (
    <div className="modal is-active">
      <div className="modal-background"></div>
      <div className="modal-content">
        <div className="box">
          <h2 className="title">{task ? 'Editar Tarea' : 'Crear Tarea'}</h2>
          {isLoading ? (
            <p>Cargando usuarios...</p>
          ) : (
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
                        <option value="">No hay estados disponibles</option>
                      )}
                    </select>
                  </div>
                </div>
              </div>
              <div className="field">
                <label className="label">Asignado a</label>
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
                        <option value="">No hay usuarios disponibles</option>
                      )}
                    </select>
                  </div>
                </div>
              </div>
              <div className="field is-grouped">
                <div className="control">
                  <button className="button is-primary" type="submit">
                    {task ? 'Guardar Cambios' : 'Crear Tarea'}
                  </button>
                </div>
                <div className="control">
                  <button
                    className="button is-light"
                    type="button"
                    onClick={onClose}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
      <button className="modal-close is-large" aria-label="close" onClick={onClose}></button>
    </div>
  );
};

export default TaskModal;
