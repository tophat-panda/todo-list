import * as mongo from "mongodb";

export default async function getDatabaseConnection() {
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
