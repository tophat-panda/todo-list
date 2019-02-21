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
  const db = await mongo.MongoClient.connect(process.env.DATABASE);
  const dbo = db.db("todo");
  return {
    dbo,
    close() {
      return db.close();
    }
  };
}

async function todoExists(id) {
  const { dbo, close } = await getDatabaseConnection();
  const todos = dbo.collection("todos");
  const exists = !!(await todos.findOne({ _id: new mongo.ObjectID(id) }));
  await close();
  return exists;
}

async function toggleTodo(id) {
  const { dbo, close } = await getDatabaseConnection();
  const todos = dbo.collection("todos");
  await todos.updateOne(
    { _id: mongo.ObjectID(id) },
    // This toggles the done state
    {
      $set: {
        done: !(await todos.findOne({ _id: new mongo.ObjectID(id) })).done
      }
    }
  );
  await close();
  return;
}

export async function handler(event, context) {
  if (event.httpMethod !== "POST") {
    return response({
      statusCode: 405,
      body: { message: "Method not allowed" }
    });
  }
  try {
    const todo = JSON.parse(event.body);
    if (typeof todo !== "object" || !todo.id || typeof todo.id !== "string") {
      return response({
        statusCode: 400,
        body: { message: "Bad request, expected body of type { id: String }" }
      });
    }
    if (!(await todoExists(todo.id))) {
      return response({
        statusCode: 400,
        body: {
          message: `Could not find todo for ID [${todo.id}]`
        }
      });
    }
    await toggleTodo(todo.id);
    return response({
      statusCode: 204
    });
  } catch (e) {
    console.error(e);
    if (e instanceof SyntaxError) {
      return response({
        statusCode: 400,
        body: { message: "Bad request, invalid JSON in body" }
      });
    }
    return response({
      statusCode: 500,
      body: { message: "Unknown error" }
    });
  }
}
