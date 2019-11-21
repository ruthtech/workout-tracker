const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const WorkoutSchema = new Schema({
  workoutTitle: {
    type: String,
    trim: true,
    required: "Workout title is required"
  },

  exercises: [{
    type: String,
    default: ""
  }]
});

const Workout = mongoose.model("Workout", WorkoutSchema);

module.exports = Workout;
