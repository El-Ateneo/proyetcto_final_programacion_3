import useFetch from "../../hooks/useFetch";
import SongCard from "./SongCard";

import { useEffect } from "react";

function SongList() {
    const [{ data, isError, isLoading }, doFetch] = useFetch(
        "https://sandbox.academiadevelopers.com/harmonyhub/songs/",
        {}
    );

 

    useEffect(() => {
        doFetch();
    }, []);

    if (isLoading) return <p>Cargando canciones...</p>;
   
    if (isError) return <p>Error al cargar las canciones.</p>;
    
    if (!data) return <p>No hay canciones disponibles</p>;
   

    return (
        <div>
            <div className="my-5">
                <h2 className="title">Lista de Canciones</h2>
                <ul>
                    {data.map((song) => (
                        <div key={song.id} className="column is-two-third">
                            <SongCard song={song} />
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default SongList;
