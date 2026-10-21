// Import the MongoDB client
const { MongoClient } = require("mongodb");

// Connect to the MongoDB server.
// The connection string comes from the MONGODB_URI environment variable so that
// MongoDB Atlas can be used without editing this file:
//   $env:MONGODB_URI = "mongodb+srv://arul:<password>@cluster0.xxxxx.mongodb.net"
// It falls back to a local MongoDB server if the variable is not set.
const MONGO_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017";

// Connect to the local MongoDB server
const client = new MongoClient(MONGO_URI);

async function main() {
    try {
        // Establish the database connection
        await client.connect();

        // Select the database and collection
        const db = client.db("college");
        const students = db.collection("students");

        // CREATE: Insert a student record
        const result = await students.insertOne({
            name: "Arul",
            department: "CSE"
        });
        console.log("Inserted:", result.insertedId);

        // READ: Retrieve the student
        const student = await students.findOne({
            _id: result.insertedId
        });
        console.log("Student:", student);

        // UPDATE: Change the student's department
        await students.updateOne(
            { _id: result.insertedId },
            { $set: { department: "IT" } }
        );
        console.log("Student updated");

        // READ AGAIN: Verify the update was applied
        const updated = await students.findOne({ _id: result.insertedId });
        console.log("Updated student:", updated);

        // DELETE: Remove the student record
        await students.deleteOne({
            _id: result.insertedId
        });
        console.log("Student deleted");

        // READ AGAIN: Confirm the record is gone
        const afterDelete = await students.findOne({ _id: result.insertedId });
        console.log("After delete:", afterDelete);

    } catch (error) {
        // Display database errors
        console.error("Error:", error.message);

        if (!process.env.MONGODB_URI) {
            console.error(
                "\nNo MONGODB_URI was set, so the local server was used.\n" +
                    "To run against MongoDB Atlas:\n" +
                    '  $env:MONGODB_URI = "mongodb+srv://<user>:<password>@<cluster>.mongodb.net"\n' +
                    "  node crud.js"
            );
        }
    } finally {
        // Close the connection
        await client.close();
    }
}

main();
