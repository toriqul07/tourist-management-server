const express=require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const app=express();
const port=process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.khd7ggn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)

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
    
    const tourismCollection=client.db('tourismDB').collection('tourism');

    app.get('/tourism',async(req,res)=>{
      const cursor=tourismCollection.find();
      const result=await cursor.toArray();
      res.send(result);
    })
    app.get('/tourism/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id :new ObjectId(id)}
      const result=await tourismCollection.findOne(query);
      res.send(result);
    })

    app.post('/tourism',async(req,res)=>{
      const newTourism=req.body;
      console.log(newTourism);
      const result=await tourismCollection.insertOne(newTourism);
      res.send(result);
    })


    app.put('/tourism/:id',async(req,res)=>{
      const id=req.params.id;
      const filter={_id: new ObjectId(id)}
      const options={upsert: true};
      const updatedTourism=req.body;
      const tourism={
        $set:{
          photo:updatedTourism.photo,
          seasonality:updatedTourism.seasonality,
          touristSpot:updatedTourism.touristSpot,
          travelTime:updatedTourism.travelTime,
          travelTime:updatedTourism.travelTime,
          countryName:updatedTourism.countryName,
          totalVisitorPerYear:updatedTourism.totalVisitorPerYear,
          location:updatedTourism.location,
          email:updatedTourism.email,
          shortDescription:updatedTourism.shortDescription,
          userName:updatedTourism.userName,
          averageCost:updatedTourism.averageCost
        }
      }
      const result=await tourismCollection.updateOne(filter,tourism,options);
      res.send(result);
    })



    app.delete('/tourism/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id :new ObjectId(id)}
      const result=await tourismCollection.deleteOne(query);
      res.send(result);

    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Tourist management server is running');
})
app.listen(port,()=>{
    console.log(`Turist management server is running ${port}`);
})