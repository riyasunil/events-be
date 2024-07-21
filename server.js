const express = require("express");
const cors = require("cors")
const cookieSession = require("cookie-session")



const app = express();



var corsOptions = {
    origin: "*"
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({extended : true}));

app.use(
    cookieSession({
        name : "riaSession",
        keys: ["COOKIE_SECRET"],
        httpOnly: true
    })
);

const dbConfig = require("./app/config/db.config.js");

const db = require("./app/models")
const Role = db.role;


  db.mongoose
  .connect(`mongodb+srv://mdl21cs102:PwQNr2T9T6QTZ26x@cluster0.z2k5gbf.mongodb.net/${dbConfig.DB}`)
  .then(() => {
      console.log("Successfully connect to MongoDB.");
      initial();
  })
  .catch(err => {
      console.error("Connection error", err);
      process.exit();
    });


  
  

app.get("/", (req, res) => {
    res.json("Welcome to the platform")
})


const PORT  = process.env.PORT || 3000;

app.listen(PORT, () => { console.log(`listening to port ${PORT}`)});

require('./app/routes/auth.routes')(app);
  require('./app/routes/user.routes')(app);


  async function initial() {
    try {
        const count = await Role.estimatedDocumentCount();
        if (count === 0) {
            await new Role({ name: "user" }).save();
            console.log("Added 'user' to roles collection");

            await new Role({ name: "moderator" }).save();
            console.log("Added 'moderator' to roles collection");

            await new Role({ name: "admin" }).save();
            console.log("Added 'admin' to roles collection");

            await new Role({ name: "organiser" }).save();
            console.log("Added 'organiser' to roles collection");
        }
    } catch (err) {
        console.error("Error initializing roles", err);
    }
}

            
