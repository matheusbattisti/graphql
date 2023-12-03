import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Home = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/posts") // Use o endpoint correto
      .then((response) => {
        setPosts(response.data);
      })
      .catch((error) => {
        console.error("Houve um erro ao buscar os posts:", error);
      });
  }, []);

  // Função para gerar uma URL de imagem aleatória do Unsplash
  const getRandomImageUrl = () => {
    return `https://source.unsplash.com/random/800x600?sig=${Math.random()}`;
  };

  return (
    <Container>
      <Row>
        {posts.map((post) => (
          <Col md={6} lg={4} key={post.id}>
            <Card className="mb-4">
              <Card.Img variant="top" src={getRandomImageUrl()} />
              <Card.Body>
                <Card.Title>{post.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  Postado por {post.author.name}
                </Card.Subtitle>
                <Card.Text>
                  {post.content.substring(0, 100)}...{" "}
                  {/* Exibir uma prévia do conteúdo */}
                </Card.Text>
                <Link to={`/post/${post.id}`}>
                  <Button variant="primary">Leia mais</Button>
                </Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Home;
