import React, { useState, useEffect } from "react";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import "./styles.css";

const API_URL = "https://jsonplaceholder.typicode.com/todos";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`${API_URL}?_limit=10`);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async () => {
    try {
      if (newTodoTitle.trim() === "") return;

      const newTodo = {
        id: uuidv4(),
        title: newTodoTitle,
        completed: false
      };

      await axios.post(API_URL, newTodo);

      setTodos((prevTodos) => [...prevTodos, newTodo]);
      setNewTodoTitle("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const updatedTodos = todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });

      setTodos(updatedTodos);
    } catch (error) {
      console.error("Error toggling todo:", error);
    }
  };

  const deleteTodo = (id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Todo List</h1>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Add a new todo"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && addTodo()}
        />
        <button className="btn btn-primary" type="button" onClick={addTodo}>
          Add Todo
        </button>
      </div>
      <ul className="list-group">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              todo.completed ? "completed" : ""
            }`}
          >
            <span>{todo.title}</span>
            <button
              className="btn btn-delete"
              onClick={() => deleteTodo(todo.id)}
            >
              X
            </button>
            <button
              className="btn btn-success"
              onClick={(e) => {
                e.stopPropagation();
                toggleTodo(todo.id);
              }}
            >
              {todo.completed ? "Undone" : "Done"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
