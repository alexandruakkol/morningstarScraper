const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion } = require('mongodb');
dotenv.config();

const uri = `mongodb+srv://alex:${process.env.CONNECTIONSTRING}@cluster0.aifhvnu.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(async (err) => {
  const collection = client.db("findata").collection("last");

  const result = await collection.insertOne({'symbol':'AAPL', "price":3434});
    console.log(
   `A document was inserted with the _id: ${result.insertedId}`,
);

  client.close();
});