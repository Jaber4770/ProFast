require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const PORT = process.env.PORT || 3000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const stripe = require("stripe")(process.env.PAYMENT_GATEWAY_KEY);
const admin = require("firebase-admin");
const serviceAccount = require("./firebase-admin-key-zap-shift.json");

// Middleware
app.use(cors());
app.use(express.json());


// firebase token verification admin init
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});



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
        const usersCollection = client.db('ParcelDB').collection('users');
        const ridersCollection = client.db('ParcelDB').collection('riders');


        // custom middleware
        const verifyFBToken = async (req, res, next) => {
            const authHeaders = req.headers.authorization;
            if (!authHeaders) {
                return res.status(401).send({ message: "unautharized access" })
            }
            const token = authHeaders.split(' ')[1];
            if (!token) {
                return res.status(401).send({ message: "unautharized access" })
            }

            // verify the token
            try {
                const decoded = await admin.auth().verifyIdToken(token);
                req.decoded = decoded;

                next();

            } catch (err) {
                return res.status(403).send({ message: 'Forbidden Access' });
            }
        }



        app.post('/users', async (req, res) => {
            const email = req.body.email;

            const existUser = await usersCollection.findOne({ email });

            if (existUser) {
                // update last login info
                await usersCollection.updateOne({ email }, {
                    $set: {
                        lastLogIn: new Date().toISOString()
                    }
                })
                return res.status(200).send({ message: 'user already exist!' })
            }

            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);

        })


        //get specific user parcele data by email or all user parcel data
        app.get('/parcels', verifyFBToken, async (req, res) => {
            try {
                const userEmail = req.query.email;
                // console.log(req.decoded);

                if (req.decoded.email !== userEmail) {
                    return res.status(403).send({ message: 'forbidden access' });
                }

                const query = userEmail ? { userEmail } : {};
                const options = {
                    sort: { createdAt: -1 }, //get newest first
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
        app.post('/payment-success', verifyFBToken, async (req, res) => {
            try {
                const { parcelId, transactionId, email: userEmail, amount, paymentMethod } = req.body;

                if (req.decoded.email !== userEmail) {
                    return res.status(403).send({ message: 'forbidden access' });
                }

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
        app.get('/payment-success', verifyFBToken, async (req, res) => {
            try {
                const userEmail = req.query.email;

                if (req.decoded.email !== userEmail) {
                    return res.status(403).send({ message: 'forbidden access' });
                }

                const query = userEmail ? { email: userEmail } : {};
                const options = {
                    sort: { date: -1 },
                };

                const payments = await paymentCollection.find(query, options).sort({ paidAt: -1 }).toArray();
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

        // rider application
        app.post('/riders', async (req, res) => {
            const riderInfo = req.body;

            const result = await ridersCollection.insertOne(riderInfo);
            res.send(result);
        })

        // GET /api/riders?status=pending
        app.get('/riders', async (req, res) => {
            try {
                const { status } = req.query;
                const query = status ? { status } : {};
                const riders = await ridersCollection.find(query).toArray();
                res.send(riders);
            } catch (error) {
                console.error('Error fetching riders:', error);
                res.status(500).json({ error: 'Server error' });
            }
        });

        // Validate status
        // PATCH /riders/:id
        app.patch('/riders/:id', async (req, res) => {
            const riderId = req.params.id;
            const { status } = req.body;

            if (!status) {
                return res.status(400).send({ error: 'Status is required' });
            }

            try {
                // Update the rider document
                const result = await ridersCollection.updateOne(
                    { _id: new ObjectId(riderId) },
                    { $set: { status } }
                );

                if (result.matchedCount === 0) {
                    return res.status(404).send({ error: 'Rider not found' });
                }

                res.send({ message: `Rider status updated to ${status}` });

            } catch (error) {
                console.error('Failed to update rider status:', error);
                res.status(500).send({ error: 'Server error' });
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
