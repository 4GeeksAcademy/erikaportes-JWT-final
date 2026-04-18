import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const Private = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        fetch("https://studious-broccoli-v66rwgp4jrqr2x55w-3001.app.github.dev/private", {
            headers: { Authorization: `Bearer ${token}` }
        }).then(res => {
            if (!res.ok) navigate("/login");
        });
    }, []);

    return <h1>Área Privada</h1>;
};