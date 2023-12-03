import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { login } = useAuth();

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post("http://localhost:3000/api/auth/login", { email, password })
      .then((response) => {
        const { token } = response.data;
        login(); // Armazenando o token no LocalStorage

        // Configurar o Axios para incluir o token em solicitações futuras
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        navigate("/dashboard"); // Redirecionando para a página de dashboard ou outra página
      })
      .catch((error) => {
        if (error.response) {
          setErrorMessage(error.response.data.error || "Erro ao fazer login.");
        } else {
          setErrorMessage("Erro ao fazer a requisição.");
        }
      });
  };

  return (
    <Container>
      <h2>Login</h2>
      {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>E-mail</Form.Label>
          <Form.Control
            type="email"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Senha</Form.Label>
          <Form.Control
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Entrar
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
