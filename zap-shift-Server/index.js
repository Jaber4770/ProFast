require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const stripe = require("stripe")(process.env.PAYMENT_GATEWAY_KEY);

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

        const parcelCollection = client.db('ParcelDB').collection('parcels');
        const paymentCollection = client.db('ParcelDB').collection('payment-success');

        app.get('/parcels', async (req, res) => {
            const result = await parcelCollection.find().toArray();
            res.send(result);
        })

        //get specific user parcele data by email or all user parcel data
        app.get('/parcels', async (req, res) => {
            try {
                const userEmail = req.query.email;
                const query = userEmail ? { created_by: userEmail } : {};
                const options = {
                    sort: { created_by: -1 }, //get newest first
                };
                const parcels = await parcelCollection.find(query, options).toArray();
                res.send(parcels);
            } catch (err) {
                res.status(500).send({ message: "failed to get parcels data." })
            }
        })

        // get percel by id
        app.get('/parcels/:id', async (req, res) => {
            try {
                const id = req.params.id;
                const query = { _id: new ObjectId(id) };
                const parcel = await parcelCollection.findOne(query);

                if (!parcel) {
                    return res.status(404).send({ message: "Parcel not found" });
                }

                res.send(parcel);
            } catch (err) {
                res.status(500).send({ message: "Failed to get parcel", error: err.message });
            }
        });

        // savee data to db when user send a perecel
        app.post('/parcels', async (req, res) => {
            try {
                const newparcel = req.body;
                const result = await parcelCollection.insertOne(newparcel);
                res.status(201).send(result);
            } catch (error) {
                console.error('Error inseerting peercel: ', error);
                res.status(500).send({ messagee: "Failed to create parcel!" })
            }
        });
        
        // create payment intend
        app.post('/create-payment-intent', async (req, res) => {
            const amountInCents = req.body.amountInCents;
            try {
                const paymentIntent = await stripe.paymentIntents.create({
                    amount: amountInCents,
                    currency: 'usd',
                    payment_method_types: ['card']
                });

                res.json({ clientSecret: paymentIntent.client_secret });
            } catch (error) {
                res.status(500).json({ error: error.message });
            }
          });
          
        // payment susccess api
        app.post('/payment-success', async (req, res) => {
            try {
                const { parcelId, transactionId, email, amount, paymentMethod } = req.body;

                if (!parcelId || !email || !transactionId || !amount || !paymentMethod) {
                    return res.status(400).send({ message: "Missing payment data." });
                }

                const parcelObjectId = new ObjectId(parcelId);

                // Update parcel
                const updateParcelResult = await parcelCollection.updateOne(
                    { _id: parcelObjectId },
                    { $set: { paymentStatus: 'paid' } }
                );

                // Insert into payments collection
                const paymentEntry = {
                    parcelId: parcelObjectId,
                    email,
                    transactionId,
                    amount,
                    paymentMethod,
                    paidAtString: new Date().toString(),
                    paidAt: new Date(),
                    status: 'success'
                };

                const insertPaymentResult = await paymentCollection.insertOne(paymentEntry);

                res.send({
                    message: 'Payment recorded and parcel updated.',
                    updated: updateParcelResult.modifiedCount > 0,
                    insertedId: insertPaymentResult.insertedId
                });

            } catch (err) {
                console.error(err);
                res.status(500).send({ message: "Payment processing failed." });
            }
        });

        // get payment data
        app.get('/payment-success', async (req, res) => {
            try {
                const userEmail = req.query.email;

                const query = userEmail ? { email: userEmail } : {};
                const options = {
                    sort: { date: -1 },
                };

                const payments = await paymentCollection.find(query, options).sort({paidAt: -1}).toArray();
                res.send(payments);

            } catch (err) {
                console.error(err);
                res.status(500).send({ message: "Failed to load payment history." });
            }
        });
        


        // DELETE parcel by ID
        app.delete('/parcels/:id', async (req, res) => {
            try {
                const id = req.params.id;
                if (!id) return res.status(400).send({ message: "Missing parcel ID" });
                const result = await parcelCollection.deleteOne({ _id: new ObjectId(id) });
                res.send(result);
            } catch (error) {
                console.error('Error deleting parcel:', error);
                res.status(500).send({ message: "Failed to delete parcel" });
            }
        });


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
