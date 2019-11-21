const express = require("express");
const mongojs = require("mongojs");
const logger = require("morgan");
const path = require("path");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const Workout = require("./workoutModel.js");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

const databaseUrl = "workoutTrackerDB";
const collections = ["workout"];
mongoose.connect(process.env.MONGODB_URI || `mongodb://localhost/${databaseUrl}`, { useNewUrlParser: true,  useUnifiedTopology: true});

const db = mongojs(databaseUrl, collections);

//
// Mongoose way
//
// app.post("/submit", ({ body }, res) => {
//   User.create(body)
//     .then(dbUser => {
//       res.json(dbUser);
//     })
//     .catch(err => {
//       res.json(err);
//     });
// });


db.on("error", error => {
  console.log("Database Error:", error);
});

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "./public/index.html"));
});

app.post("/submit", (req, res) => {
  console.log(req.body);

  Workout.create(req.body)
  .then(dbWorkout => {
    res.json(dbWorkout)
  })
  .catch(err => {
    res.json(err)
  })
});

app.get("/all", (req, res) => {
  Workout.find(function (err, workouts) {
    if (err) return console.error(err);
    console.log(workouts);
    res.json(workouts);
  })
});

app.get("/find/:id", (req, res) => {
  Workout.findById(req.params.id)
  .then(dbWorkout => {
    res.json(dbWorkout)
  })
  .catch(err => {
    res.json(err)
  });
});

app.post("/update/:id", (req, res) => {
  var query = {'_id':req.params.id};
  let newData = {
    _id: req.params.id,
    workoutTitle: req.body.workoutTitle,
    exercises: req.body.exercises
  }
  Workout.findOneAndUpdate(query, newData, {upsert:true}, function(err, data){
      if (err) return res.send(500, { error: err });
      return res.send(data);
  });
  
  // // TODO FINISH
  // db.workout.update(
  //   {
  //     _id: mongojs.ObjectId(req.params.id)
  //   },
  //   {
  //     $set: {
  //       workoutTitle: req.body.workoutTitle,
  //       exercises: req.body.exercises
  //     }
  //   },
  //   (error, data) => {
  //     if (error) {
  //       res.send(error);
  //     } else {
  //       res.send(data);
  //     }
  //   }
  // );
});

app.delete("/delete/:id", (req, res) => {
  Workout.findByIdAndRemove(req.params.id, req.body, function(err, data) {
    if(err) return res.send(err);

    res.send(data);
  });

  // db.workout.remove(
  //   {
  //     _id: mongojs.ObjectID(req.params.id)
  //   },
  //   (error, data) => {
  //     if (error) {
  //       res.send(error);
  //     } else {
  //       res.send(data);
  //     }
  //   }
  // );
});

app.listen(3000, () => {
  console.log("App running on port 3000!");
});
