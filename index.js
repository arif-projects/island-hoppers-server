const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.mbkcs.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        // console.log('connected to database');
        const database = client.db('islandHoppers');
        const serviceCollection = database.collection('services');
        const purcheseCollection = database.collection('purchese');

        //get api(Showing all data in website)

        app.get('/services', async(req,res)=>{
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        })

       //showing single data(get api)
       app.get('/services/:id', async (req, res)=>{
           const id = req.params.id;
           const query = {_id: ObjectId(id)};
           const service = await serviceCollection.findOne(query);
           res.json(service);
       })

    //GET API (Showing all Purchese Data) starts

    app.get('/purchese', async(req,res)=>{
        const cursor = purcheseCollection.find({});
        const purchese = await cursor.toArray();
        res.send(purchese);
    })
    //GET API (Showing all Purchese Data)ends

        //GET API (Load specific Purchese data from database) starts
        app.get('/purchese/:email', async (req,res)=>{
            const email = req.params.email;
            const query = {customerEmail : email}
            const cursor = purcheseCollection.find(query);
            const purchese = await cursor.toArray();
            res.send(purchese);
        })
        //GET API (Load specific Purchese data from database) ends
    
        


        //POST api(Insert data operation)
        app.post('/services', async(req, res)=>{

            const service = req.body;
               
            console.log('Hit the post APi',service);

            const result = await serviceCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });

        //insert Purchese data
        app.post('/purchese', async(req, res)=>{

            const purchese = req.body;
               
            // console.log('Hit the post APi',service);

            const result = await purcheseCollection.insertOne(purchese);
            console.log(result);
            res.json(result);
        });

        //Delete operation

        app.delete('/services/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await serviceCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally{
        // await client.close();
    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Running island hopper server');
})

app.listen(port,()=>{
    console.log('Running island hoppers on port',port);
})