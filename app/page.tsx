"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import "./../app/app.css";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import "@aws-amplify/ui-react/styles.css";
import { Authenticator } from '@aws-amplify/ui-react';
import { signOut as awsSignOut } from "aws-amplify/auth"; // Renombramos aquí
import { User } from "aws-cdk-lib/aws-iam";

Amplify.configure(outputs);

const client = generateClient<Schema>();

const customSignOut = (event: React.MouseEvent<HTMLButtonElement>) => { // Renombramos la función
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

  return (
    <Authenticator>
      <main>
        <h1>Pedidos</h1>
        <button onClick={createTodo}>+ new</button>
        <ul>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.content}</li>
          ))}
        </ul>
        <button onClick={customSignOut}>Cerrar sesión</button> {/* Usamos la nueva función aquí */}
        <div>
          🥳 App de testeo login
          <br />
          <a href="https://docs.amplify.aws/nextjs/start/quickstart/nextjs-app-router-client-components/">
            Review next steps of this tutorial.
          </a>
        </div>
      </main>
    </Authenticator>
  );
}