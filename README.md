# Experiment 9 — Perform CRUD Operations Using MongoDB

**Aim:** To perform CRUD (Create, Read, Update, and Delete) operations on student
records using MongoDB and Node.js.

## Algorithm
1. Install Node.js and ensure MongoDB is accessible.
2. Create a project directory for the application.
3. Initialize the project using npm.
4. Install the MongoDB Node.js driver.
5. Import the MongoDB client library.
6. Connect to the MongoDB server.
7. Select the database and students collection.
8. Insert a student record using the Create operation.
9. Retrieve and update the record using Read and Update operations.
10. Delete the record and close the database connection.

## Execution

```bash
mkdir mongodb-crud
cd mongodb-crud
npm init -y
npm install mongodb
node crud.js
```

## Program — `crud.js`

```js
// Import the MongoDB client
const { MongoClient } = require("mongodb");

// Connect to the local MongoDB server
const client = new MongoClient("mongodb://127.0.0.1:27017");

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

        // DELETE: Remove the student record
        await students.deleteOne({
            _id: result.insertedId
        });
        console.log("Student deleted");

    } catch (error) {
        // Display database errors
        console.error("Error:", error.message);
    } finally {
        // Close the connection
        await client.close();
    }
}

main();
```

## Using MongoDB Atlas

`crud.js` reads the connection string from the `MONGODB_URI` environment variable
and falls back to the local URI `mongodb://127.0.0.1:27017`.

### 1. Create a free Atlas cluster
1. Sign up at <https://www.mongodb.com/atlas> (free forever on the M0 tier).
2. Choose the **Free** shared cluster (`M0`), region closest to you, and finish
   the setup wizard.
3. **Database Access** → **Add New Database User**
   - Authentication method: **Password**
   - Username: `arul`, Password: pick a strong one
   - Database User Privileges: **Read and write to any database**
   - Click **Add User**
4. **Network Access** → **Add IP Address**
   - Either add your own IP, or choose **Allow access from anywhere**
     (`0.0.0.0/0`) so it works from any network. Click **Confirm**.

### 2. Copy the connection string
1. Go to **Deployment** → **Database** tab → **Connect** → **Drivers**.
2. Choose **Node.js** and copy the SRV string, e.g.
   ```
   mongodb+srv://arul:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
3. Replace `<password>` with the password you created in step 3.

### 3. Run it

**One command (recommended)**

The connection string is stored in `.env` (git-ignored). Node reads it with the
built-in `--env-file` flag:

```bash
npm run atlas
```

**Windows (PowerShell)**
```powershell
$env:MONGODB_URI = "mongodb+srv://arul:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority"
node crud.js
```

**macOS / Linux**
```bash
export MONGODB_URI="mongodb+srv://arul:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority"
node crud.js
```

**Permanent (Windows)**
```powershell
setx MONGODB_URI "mongodb+srv://arul:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority"
```

### Expected output
```
Inserted: new ObjectId('6ad8e99f26dbdb321775ebcd')
Student: {
  _id: new ObjectId('6ad8e99f26dbdb321775ebcd'),
  name: 'Arul',
  department: 'CSE'
}
Student updated
Updated student: {
  _id: new ObjectId('6ad8e99f26dbdb321775ebcd'),
  name: 'Arul',
  department: 'IT'
}
Student deleted
After delete: null
```

> **Security note:** the live connection string lives in `.env`, which is
> git-ignored. `.env.example` holds the template that *is* committed. If the
> credentials are ever shared publicly, rotate the database user password in
> Atlas → **Database Access**.

## Result
Thus, CRUD operations were successfully performed using MongoDB to insert, retrieve,
update, and delete student records.
# CRUD_Operationz
