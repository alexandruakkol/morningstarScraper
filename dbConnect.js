const dotenv = require("dotenv");
const { builtinModules } = require("module");
const { MongoClient, ServerApiVersion } = require("mongodb");

function writeToDb(obj) {
  dotenv.config();

  const uri = `mongodb+srv://alex:${process.env.CONNECTIONSTRING}@cluster0.aifhvnu.mongodb.net/?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });
  client.connect(async (err) => {
    try {
      const collection = client.db("findata").collection("last");
      await collection.deleteOne({_id:obj._id});
      const result = await collection.insertOne(obj);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);

      client.close();
    } catch (error) {
      console.log(error, err);
    }
  });
}

module.exports = writeToDb;
