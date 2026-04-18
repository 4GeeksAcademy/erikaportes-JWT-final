import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Private = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        const baseUrl = import.meta.env.VITE_BACKEND_URL;

        fetch(`${baseUrl}/private`, {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            if (!res.ok) navigate("/login");
        });
    }, []);

    return <h1>Área Privada</h1>;
};