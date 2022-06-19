const dotenv = require("dotenv");
const { builtinModules } = require("module");
const { MongoClient, ServerApiVersion } = require("mongodb");

dotenv.config();

const uri = `mongodb+srv://alex:${process.env.CONNECTIONSTRING}@cluster0.aifhvnu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

function writeToDb(obj) {
  client.connect(async (err) => {
    try {
      const collection = client.db("findata").collection("last");
      await collection.deleteOne({ _id: obj._id });
      const result = await collection.insertOne(obj);
      console.log(`${obj._id} was inserted into the database.`);

      client.close();
    } catch (error) {
      console.log(error, err);
    }
  });
}

async function existsInDb(symbol) {

    const collection = client.db("findata").collection("last");
    try {
        out = await collection.findOne({ _id: symbol })

    } catch (error) {
      console.log("existsInDb error", error);
    }
    return out;
  }

module.exports = { writeToDb, existsInDb };
