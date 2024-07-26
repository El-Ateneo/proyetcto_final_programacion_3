export default function About() {
    return (
        <div className="box content has-text-centered is-medium my-6">
            <h2 className="title">Harmony Hub...</h2>
            <p>
                Esta es una aplicación simple de reproductor de música
                construida con React, React Router y Bulma.
            </p>
            <p>
                Esta aplicación es parte de un tutorial de aprendizaje de la
                materia de Programación 3 de la carrera de{" "}
                <strong>Tecnicatura en Desarrollo de Software</strong> de la{" "}
                <strong>UPATecO</strong>.
            </p>
            <p>
                Este ejemplo muestra cómo usar React Router para proteger rutas
                mediante un contexto de autenticación. Para esto se emplea la
                API privada proporcionada por la cátedra.
            </p>
        </div>
    );
}
