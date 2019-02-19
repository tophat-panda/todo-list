import getDatabaseConnection from "./util/get-database-connection";
import response from "./util/response";
export async function register({ username, email, password }) {
  const { dbo, close } = await getDatabaseConnection();

  // TODO, save username, email and password.

  // Password should not be stored directly into database, bcrypt should be used to hash it

  await close();

  // Return the newly created user, including the ID in the database but filter out the password
  return {
    userId: "5c6b20d511cb298253104481",
    username: "bob.smith",
    email: "bobsmith123@test.com"
  };
}

// -------- Ignore the rest of this code --------

export async function handler(event) {
  if (event.httpMethod !== "POST") {
    return response({
      statusCode: 405,
      body: { message: "Method not supported." }
    });
  }
  try {
    const user = JSON.parse(event.body);
    if (
      typeof user !== "object" ||
      !user.username ||
      typeof user.username !== "string" ||
      !user.email ||
      typeof user.email !== "string" ||
      !user.password ||
      typeof user.password !== "string"
    ) {
      return response({
        statusCode: 400,
        body: {
          message:
            "Bad request, expected request body to be of type { username: String, email: String, password: String }"
        }
      });
    }
    return response({ statusCode: 200, body: await register(user) });
  } catch (e) {
    console.error(e);
    if (e instanceof SyntaxError) {
      return response({
        statusCode: 400,
        body: { message: "Bad request, invalid JSON in request body." }
      });
    }
    return response({
      statusCode: 500,
      body: { message: "Unknown error" }
    });
  }
}
