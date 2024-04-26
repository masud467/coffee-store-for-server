const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 7000;




// middleware
app.use(cors());
app.use(express.json())
//  console.log(process.env.SECRET_USER)
//  console.log(process.env.SECRET_PASS)



const uri = `mongodb+srv://${process.env.SECRET_USER}:${process.env.SECRET_PASS}@cluster0.uoysey8.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const coffeeCollection = client.db("coffeeDB").collection("coffee")
    const userCollection = client.db("coffeeDB").collection("users")

    app.get('/coffee',async(req,res)=>{
      const cursor = coffeeCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.get('/coffee/:id',async(req,res)=>{
      const id= req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.findOne(query)
      res.send(result)
    })

    app.put('/coffee/:id',async(req,res)=>{
      const id = req.params.id
      const filter = {_id:new ObjectId(id)}
      const options = { upsert: true };
      const updatedCoffee = req.body
      const coffee= {
        $set:{
          name:updatedCoffee.name,
          quantity:updatedCoffee.quantity,
          supplier:updatedCoffee.supplier,
          taste:updatedCoffee.taste,
          category:updatedCoffee.category,
          details:updatedCoffee.details,
          photo:updatedCoffee.photo,
        }
      }
      const result = await coffeeCollection.updateOne(filter,coffee,options)
      res.send(result)

    })

    app.post('/coffee',async(req,res)=>{
      const newCoffee= req.body
      console.log(newCoffee)
      const result = await coffeeCollection.insertOne(newCoffee)
      res.send(result)
    })

    app.delete('/coffee/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id: new ObjectId(id)}
      const result = await coffeeCollection.deleteOne(query)
      res.send(result)
    })

    app.post('/users',async(req,res)=>{
      const user = req.body
      console.log(user)
      const result = await userCollection.insertOne(user)
      res.send(result)
    })

    app.get('/users',async(req,res)=>{
      const cursor = userCollection.find()
      const result = await cursor.toArray()
      res.send(result)
    })

    app.patch('/users',async(req,res)=>{
      const user = req.body
      const filter = {email:user.email}
      const updatedUser = {
        $set:{
          lastLoggedAt:user.lastLoggedAt
        }
      }
      const result = await userCollection.updateOne(filter,updatedUser)
      res.send(result)
    })

    app.delete('/users/:id',async(req,res)=>{
      const id = req.params.id
      const query = {_id:new ObjectId(id)}
      const result = await userCollection.deleteOne(query)
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.log);




app.get('/',(req,res)=>{
    res.send('coffee making server store is running soon ')
})

app.listen(port,()=>{
    console.log(`coffee making server store is running on port: ${port}`)
})