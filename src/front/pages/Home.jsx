import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
	const navigate = useNavigate();

	const [isLogin, setIsLogin] = useState(true); // toggle
	const [form, setForm] = useState({
		email: "",
		password: ""
	});

	const handleSubmit = async (e) => {
		e.preventDefault();
		const endpoint = isLogin ? "login" : "signup";

		// Usamos import.meta.env para no escribir la URL a mano
		const baseUrl = import.meta.env.VITE_BACKEND_URL;

		try {
			const resp = await fetch(`${baseUrl}/${endpoint}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(form)
			});

			const data = await resp.json();

			if (resp.ok) {
				if (isLogin) {
					sessionStorage.setItem("token", data.token);
					navigate("/private");
				} else {
					alert("Registro exitoso, ahora inicia sesión");
					setIsLogin(true);
				}
			} else {
				alert(data.msg || "Ocurrió un error");
			}
		} catch (error) {
			console.error("Error en la conexión", error);
		}
	};

	return (
		<div className="container mt-5">
			<div className="card pt-4 pb-4 shadow w-50 mx-auto">
				<h2 className="text-center mb-4">
					{isLogin ? "Iniciar Sesión" : "Registrarse"}
				</h2>

				<form onSubmit={handleSubmit}>
					<input
						type="email"
						placeholder="Correo"
						className="form-control mb-3 w-50 mx-auto"
						onChange={e => setForm({ ...form, email: e.target.value })}
					/>

					<input
						type="password"
						placeholder="Contraseña"
						className="form-control mb-3 w-50 mx-auto"
						onChange={e => setForm({ ...form, password: e.target.value })}
					/>
					<div className="d-flex justify-content-center">
						<button className="btn btn-dark w-50">
							{isLogin ? "Entrar" : "Registrarme"}
						</button>
					</div>

				</form>

				<div className="text-center mt-3">
					{isLogin ? (
						<p>
							¿No tienes cuenta?{" "}
							<span
								style={{ cursor: "pointer", color: "blue" }}
								onClick={() => setIsLogin(false)}
							>
								Regístrate
							</span>
						</p>
					) : (
						<p>
							¿Ya tienes cuenta?{" "}
							<span
								style={{ cursor: "pointer", color: "blue" }}
								onClick={() => setIsLogin(true)}
							>
								Inicia sesión
							</span>
						</p>
					)}
				</div>
			</div>
		</div>
	);
};