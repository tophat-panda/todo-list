const todos = [
  {
    id: "5349b4ddd2781d08c09890f3",
    name: "Learn react",
    completed: true
  },
  {
    id: "54759eb3c090d83494e2d804",
    name: "Do a hackathon",
    completed: false
  }
];

export async function handler(event, context) {
  // This code gets run on the server
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(todos)
  };
}
