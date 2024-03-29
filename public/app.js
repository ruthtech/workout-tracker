// sections
let workoutTitle = document.getElementById("workoutTitle");
let exercise = document.getElementById("exercise");
let savedWorkouts = document.getElementById("savedWorkouts");

// buttons
const saveBtn = document.getElementById("save");
const delBtn = document.getElementById("delete");

function getResults() {
    clearWorkout();
    fetch("/all")
        .then(function(response) {
            if (response.status !== 200) {
                console.log("Looks like there was a problem. Status Code: " + response.status);
                return;
            }
            response.json().then(function(data) {
                newWorkoutSnippet(data);
            });
        })
        .catch(function(err) {
            console.log("Fetch Error :-S", err);
        });
}

function newWorkoutSnippet(res) {
    for (var i = 0; i < res.length; i++) {
        let data_id = res[i]["_id"];
        let workoutTitle = res[i]["workoutTitle"];
        snippet = `
            <p >
            <span data-id=${data_id}>${workoutTitle}</span>
            </p>`;
        savedWorkouts.insertAdjacentHTML("beforeend", snippet);
    }
}

function clearWorkout() {
    savedWorkouts.innerHTML = "";
}

function resetWorkout() {
    exercise.value = "";
    workoutTitle.value = "";
    workoutTitle.setAttribute("data-id", null);
}

function updateWorkout(data) {
    exercise.value = data.exercise;
    workoutTitle.value = data.workoutTitle;
    workoutTitle.setAttribute("data-id", data._id);
}

savedWorkouts.addEventListener("click", function(e) {
    // Don't need to check if it's null because by definition 
    // it cannot be in the saved list unless it exists.
    const data_id = e.target.getAttribute("data-id"); 

    fetch("/find/" + data_id, { method: "get" })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        populateActiveWorkout(data);
    })
    .catch(function(err) {
        console.log("Fetch Error :-S", err);
    });

});

function populateActiveWorkout(data) {
    workoutTitle.value = data.workoutTitle;
    workoutTitle.setAttribute("data-id", data._id); // store the data id for updating later
    exercise.value = data.exercises.toString();
}

saveBtn.addEventListener("click", function(e) {
    const data_id = workoutTitle.getAttribute("data-id");
    if((data_id == null) || (data_id == "null")) {
        // First time this is called, so create it and update it with the data_id attribute
        addWorkout();
    } else {
        updateWorkout(data_id);
    }
});

function updateWorkout(data_id) {
    const workoutTitle = document.getElementById("workoutTitle").value;
    const exercises = document.getElementById("exercise").value.split(',');

    // This has been created already. We are updating it. 
    // TO DO
    fetch("/update/" + data_id, {
        method: "post",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            workoutTitle,
            exercises
        })
    })
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        resetWorkout();
        getResults(); // populate the saved Workouts
    })
    .catch(function(err) {
        console.log("Fetch Error :-S", err);
    });
}

function addWorkout() {
    // db.workout.insert({"workoutTitle": "my workout", "exercises": ["bicep", "tricep", "stretches"]})
    const exercises = document.getElementById("exercise").value.split(',');
    fetch("/submit", {
        method: "post",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            workoutTitle: document.getElementById("workoutTitle").value,
            exercises: exercises
        })
    })
    .then(res => res.json())
    .then(res => newWorkoutSnippet([res]));
    resetWorkout();
};

delBtn.addEventListener("click", function(e) {
    const data_id = workoutTitle.getAttribute("data-id");
    fetch("/delete/" + data_id, {
        method: "delete"
    })
    .then(res => res.json())
    .then(getResults());
    // .then(res => newWorkoutSnippet([res]));
    resetWorkout();
});

getResults();

