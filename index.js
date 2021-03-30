const express = require('express')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s69t4.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(express.json());
app.use(cors());


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("emaJohnStore").collection("products");
  const ordersCollection = client.db("emaJohnStore").collection("orders");
  // perform actions on the collection object
  console.log("database Conected");

    app.post('/addProducts',(req, res) => {
        const products = req.body;
        productsCollection.insertOne(products)
        .then(result => {
            res.send(result.insertedCount);
        })
    });

    app.get('/products',(req,res) =>{
        productsCollection.find({})
        .toArray((err, documents) =>{
            res.send(documents)
        })
    })

    app.get('/product/:key',(req,res) =>{
        productsCollection.find({key: req.params.key})
        .toArray((err, documents) =>{
            // console.log(documents[0]);
            res.send(documents[0])
        })
    });

    app.post('/productsByKeys', (req, res) =>{
        const productkeys =  req.body;
        productsCollection.find({key: {$in: productkeys}})
        .toArray((err, documents) =>{
            res.send(documents);
        })
    });

    app.post('/addOrder',(req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    });


});


const port = 5000
app.listen( process.env.PORT || port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})