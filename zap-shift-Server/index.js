require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion } = require('mongodb');

// Middleware
app.use(cors());
app.use(express.json());


// Simple test route
app.get('/', (req, res) => {
    res.send('Parcel server is running...');
});


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.61690px.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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

        const percelCollection = client.db('percelDB').collection('percels');

        app.get('/percels', async (req, res) => {
            const result = await percelCollection.find().toArray();
            res.send(result);
        })

        app.post('/percels', async (req, res) => {
            try {
                const newPercel = req.body;
                const result = await percelCollection.insertOne(newPercel);
                res.status(201).send(result);
            } catch (error) {
                console.error('Error inseerting peercel: ', error);
                res.status(500).send({messagee: "Failed to create percel!"})
    }
})




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
