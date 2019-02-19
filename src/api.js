import Axios from "axios";

export async function toggleTodo(id) {
  return Axios.post("/.netlify/functions/toggle-todo", { id });
}

export async function fetchTodos() {
  return Axios.get("/.netlify/functions/todos");
}

export async function createTodo({ name }) {
  return Axios.post("/.netlify/functions/todos", { name });
}
