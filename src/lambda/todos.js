import * as mongo from "mongodb";

function response({ statusCode = 200, body }) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  };
}

async function getDatabaseConnection() {
  // Create a mongo client instance
  const db = await mongo.MongoClient.connect(process.env.DATABASE);
  // get the todo database
  const dbo = db.db("todo");
  // Return the dbo and a means to close the connection
  return {
    dbo,
    close() {
      return db.close();
    }
  };
}

async function createNewTodo({ name }) {
  // Get a database connection
  const { dbo, close } = await getDatabaseConnection();
  // Get the todos collection from the dbo
  const todos = dbo.collection("todos");
  // Insert the new todo into the todos collection
  const todo = await todos.insertOne({ name, done: false, due: new Date() });
  // Close conection to database
  await close();
  // Return insert id of new todo
  return response({ statusCode: 201, body: todo.insertedId });
}

async function getRecentTodos() {
  // Get a database connection
  const { dbo, close } = await getDatabaseConnection();
  // Get the todos collection from the dbo
  const todos = dbo.collection("todos");
  // Find the 10 most recent todos from the todos collection
  const recentTodos = await todos
    .find()
    .limit(10)
    .toArray();
  // Close conection to database
  await close();
  // Return the recent todos
  return response({ body: recentTodos });
}

export async function handler(event, context) {
  switch (event.httpMethod) {
    case "POST":
      try {
        const todo = JSON.parse(event.body);
        return createNewTodo(todo);
      } catch (e) {
        console.error(e);
        if (e instanceof SyntaxError) {
          return response({
            statusCode: 400,
            body: { message: "Bad request" }
          });
        }
        return response({
          statusCode: 500,
          body: { message: "Unknown error" }
        });
      }

    default:
      return getRecentTodos();
  }
}
