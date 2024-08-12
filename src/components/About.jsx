export default function About() {
    return (
        <div className="box content has-text-centered is-medium my-6">
            <h2 className="title">Task Manager</h2>
            <p>
                Esta es una aplicación de gestión de tareas y proyectos construida
                con React, React Router y Bulma.
            </p>
            <p>
                La aplicación permite a los usuarios crear y gestionar proyectos,
                asignar tareas a los proyectos, y realizar un seguimiento del progreso.
            </p>
            <p>
                Esta aplicación forma parte de un proyecto de aprendizaje en el
                marco de la materia de <strong>Programación 3</strong> de la{" "}
                <strong>Tecnicatura en Desarrollo de Software</strong> en la{" "}
                <strong>UPATecO</strong>.
            </p>
            <p>
                Utiliza React Router para manejar la navegación entre diferentes
                vistas y un contexto de autenticación para proteger rutas. Los datos
                se gestionan a través de una API privada proporcionada por la cátedra.
            </p>
        </div>
    );
}
