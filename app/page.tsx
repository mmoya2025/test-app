"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from '@aws-amplify/ui-react';
import { signOut as awsSignOut } from "aws-amplify/auth";

Amplify.configure(outputs);

const client = generateClient<Schema>();

const customSignOut = () => {
  awsSignOut(); // Llama a la función de cierre de sesión de AWS
};

export default function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  function listTodos() {
    client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
  }

  useEffect(() => {
    listTodos();
  }, []);

  function createTodo() {
    client.models.Todo.create({
      content: window.prompt("Todo content"),
    });
  }

  function clearTodos() {
    // Elimina todos los registros del backend
    Promise.all(todos.map(todo => client.models.Todo.delete(todo.id)))
      .then(() => {
        setTodos([]); // Limpia el estado local después de eliminar
      })
      .catch((error) => {
        console.error("Error al eliminar los registros:", error);
      });
  }
  
  return (
    <Authenticator>
      <main>
        <button onClick={createTodo}>Nuevo registro</button>
        <button onClick={clearTodos}>Limpiar todos</button> {/* Botón para limpiar todos */}
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.content}</li>
          ))}
        </ul>
        <button onClick={customSignOut}>Cerrar sesión</button>
        <div>
          🥳 App de testeo login
          <br />
          <a href="https://www.linkedin.com/in/mariano-moya-813b05123//">
            Marian Developer
          </a>
        </div>
      </main>
    </Authenticator>
  );
}
