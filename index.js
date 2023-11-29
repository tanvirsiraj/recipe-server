const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.b0m9oyj.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection

    const recipeCollection = client.db("recipeDB").collection("allRecipe");
    const savedRecipeCollection = client
      .db("recipeDB")
      .collection("savedRecipe");

    // createRecipe api
    app.post("/createRecipe", async (req, res) => {
      const recipe = req.body;
      // console.log(recipe);
      const result = await recipeCollection.insertOne(recipe);
      res.send(result);
    });

    app.get("/createRecipe", async (req, res) => {
      const result = await recipeCollection.find().toArray();
      res.send(result);
    });

    // get single data api
    app.get("/createRecipe/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const recipe = await recipeCollection.findOne(query);
      res.send(recipe);
    });

    // update api
    app.put("/updateRecipe/:id", async (req, res) => {
      const id = req.params.id;
      const recipe = req.body;
      const options = { upsert: true };
      const filter = { _id: new ObjectId(id) };
      const updatedRecipe = {
        $set: {
          img: recipe.img,
          recipeName: recipe.recipeName,
          ingredients: recipe.ingredients,
          instructions: recipe.instructions,
          cookingTime: recipe.cookingTime,
          mealType: recipe.mealType,
        },
      };

      const result = await recipeCollection.updateOne(
        filter,
        updatedRecipe,
        options
      );
      res.send(result);
    });

    // savedRecipe api
    app.post("/savedRecipe", async (req, res) => {
      const recipe = req.body;
      const result = await savedRecipeCollection.insertOne(recipe);
      res.send(result);
    });

    // getting  user all saved data from database
    app.get("/savedRecipe", async (req, res) => {
      const email = req.query.email;
      query = { email: email };
      const result = await savedRecipeCollection.find(query).toArray();
      res.send(result);
    });

    app.delete("/savedRecipe/:id", async (req, res) => {
      const id = req.params.id;
      query = { _id: new ObjectId(id) };
      const result = await savedRecipeCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Recipe server is running");
});

app.listen(port, () => {
  console.log(`Recipe server is running on port ${port}`);
});
