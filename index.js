const mongoose = require("mongoose");
const express = require("express");
const app = express();
const port = 3002;
app.use(express.json());



mongoose.Promise = global.Promise;
const uri = "mongodb://127.0.0.1/tests";
//Make connections
mongoose
  .connect(uri)
  .then(() => {
    console.log("Database is connected!");
    // cb hells
  })
  .catch((err) => {
    console.log("Database is not connected!", err);
  });

//Model - user
//Define model
const userSchema = mongoose.Schema({
  name: { type: String, require: true },
  age: { type: Number, require: true },
  salary: { type: Number },
  country: { type: String, require: true },
});

// Collection

const db = mongoose.model("users", userSchema);
// mongoose.model('users')
function seed() {
  //1
  db.insertMany([{
      name: "Daniel Merigo",
      age: 21,
      salary: 60000,
      country: "Brazil",
    },
    {
      name: "Priscila Merigo",
      age: 28,
      salary: 35000,
      country: "Brazil",
    },
    {
      name: "Lauro Merigo",
      age: 58,
      salary: 33000,
      country: "Brazil",
    },
    {
        name: "Marcia Regina Mulinari Merigo",
        age: 46,
        salary: 22000,
        country: "Brazil",
    },
    {
        name: "Renan Pagno",
        age: 28,
        salary: 10000,
        country: "Brazil",
    },
    {
        name: "Cristopher",
        age: 30,
        salary: 1000000,
        country: "Brazil",
    },
    {
        name: "Helder",
        age: 31,
        salary: 5000,
        country: "Brazil",
    },
  ]).then((a) => console.log(a , '\n The data was insert :)'));

  //.forEach(u => u.save())
  // new db ({
  //     name: "Priscila Merigo",
  //     age: 14,
  //     salary: 30000,
  //     country: "Brazil"
  // }).save().then(() => {
  //     console.log("The user has been saved!")
  // }).catch((err) => {
  //     console.log("The user has not been saved!");
  //     console.log(`The error is: ${err}`)
  // })
}

//select all persons
    app.get("/persons", (req, res) => {
        db.find().then(values => {
            res.json(values)
        })
    })

//select oldest person
    app.get('/oldest-person', (req, res) => {
        db.findOne().sort({age: -1}).then((values) => {
            res.json(values)
            console.log("Sucess :)")
      });
    });
//Select 5 more rich persons
    app.get('/richest-persons', (req, res) => {
        db.find().sort({salary: -1}).limit(5).then(values => {
            res.json(values)
            console.log("Sucess :)")
        })
    });

//select person by id
   app.get("/persons/:id", (req, res) => {
       const { id } = req.params
        db.findById(id).then((values) => {
            res.json(values)
        })
   })


    //Insert
    app.post("/persons", (req, res) => {
        // req => request (header, body, ...)
        //console.log(Object.keys(req))

        db.insertMany(req.body).then(values => {
            res.json(values)
            console.log('Sucess')
        })
    })

    //Update

    app.put("/persons/:id", (req, res) => {
        const { id } = req.params
        const { name, age, salary, country } = req.body
        db.findByIdAndUpdate(id, { $set: { name: name, age: age, salary: salary, country: country }}).then(values => {
            res.json(values)
        })

    })
//Delete person by Id
   app.delete("/persons/:id", (req, res) => {
    const { id } = req.params
     db.deleteOne({"id": id}).then((values) => {
         res.json('Person was deleted!')
     })
})

//DeleteAll
    app.delete("/persons", (req, res) => {
        db.deleteMany({}).then(values => {
            res.json(values)
        })
    })
   
//Searches the oldest person in the database
// function selectAge() {
//   db.findOne().sort({age: -1}).then((c) => {
      
//       console.log(c)
// });
// }
// //Creates a raking of top 5# riches persons
// function selectRich() {
//     db.find().sort({salary: -1}).limit(5).then((c) => {
//         console.log(c)
//   });
//   }

//  async function clean(err) {
//    await db.deleteMany({});
//   console.log("Data is deleted!");
// }


// //EXECUTE FUNCIONS 
// clean();
//seed();
// //selectAge();
// //selectRich()


//Use seed in case of values isn't exist
db.find().then(values => {
    if(values[0] === undefined){
        seed()
    }
})

 
app.listen(port,() => {
    console.log(`Server is running in port: ${port}`)
})
