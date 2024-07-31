import { createBrowserRouter } from "react-router-dom";
import Login from "../components/Auth/LoginModal";
import SongList from "../components/TaskManager/SongList";
import Layout from "./Layout";
import About from "../components/About";
import ProtectedRoute from "./ProtectedRoute";
import Home from "../components/Home";
import TaskList from "../components/TaskManager/TaskList";
import NavBar from "../components/NavBar";
import LoginModal from "../components/Auth/LoginModal";
import ProfilePage from "../components/Perfil/ProfilePage";
import ProjectList from "../components/TaskManager/ProjectList";

const Router = createBrowserRouter(
    [
        {
            element: <Layout />,
            children: [
                {
                    path: "/home",
                    element: <Home/>,
                },
                {
                    path: "/",
                    element: <Home/>,
                },
                {
                    path: "/login",
                    element: <Login/>,
                },

                {
                    // index: true, 
                    path: "/songlist",
                    element: (
                        <ProtectedRoute>
                            <SongList />
                        </ProtectedRoute>
                    ),
                },
                {
                    // index: true, 
                    path: "/profile",
                    element: (
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/about",
                    element: (
                        <ProtectedRoute>
                            <About />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/tasklist",
                    element: (
                        <ProtectedRoute>
                            <TaskList />
                        </ProtectedRoute>
                    ),
                },
                {
                    path: "/projects",
                    element: (
                        <ProtectedRoute>
                            <ProjectList />
                        </ProtectedRoute>
                    ),
                },
                
            ],
        },
    ],
    {
        basename: "/react_context",
    }
);

export default Router;
