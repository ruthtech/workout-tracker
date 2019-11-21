// sections
const workoutTitle = document.getElementById("workoutTitle");
const exercise = document.getElementById("exercise");
const savedWorkouts = document.getElementById("savedWorkouts");

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
    const exercise = document.getElementById("exercise");
    exercise.value = "";
    const workoutTitle = document.getElementById("workoutTitle");
    workoutTitle.value = "";
}

function updateWorkout(data) {
    const exercise = document.getElementById("exercise");
    exercise.value = data.exercise;
    const workoutTitle = document.getElementById("workoutTitle");
    workoutTitle.value = data.workoutTitle;
}

// clearAllExercises.addEventListener("click", function(e) {
//     fetch("/clearall", {
//             method: "delete"
//         })
//         .then(function(response) {
//             if (response.status !== 200) {
//                 console.log("Looks like there was a problem. Status Code: " + response.status);
//                 return;
//             }
//             clearWorkout();
//         })
//         .catch(function(err) {
//             console.log("Fetch Error :-S", err);
//         });
// });

savedWorkouts.addEventListener("click", function(e) {
    // TODO FINISH
    // populate the UI

    // First, fetch the record from the database
    let element = e.target;
    const data = getData(element);
    let data_id = element.getAttribute("data-id");
    fetch("/find/" + data_id, { method: "get" })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            updateWorkout(data);
        })
        .catch(function(err) {
            console.log("Fetch Error :-S", err);
        });
});

saveBtn.addEventListener("click", function(e) {
    const data_id = e.target.getAttribute("data-id");
    if(data_id == null) {
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
        element.innerText = title
        resetWorkout();
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
            exercise: exercises
        })
    })
    .then(res => res.json())
    .then(res => newWorkoutSnippet([res]));
    resetWorkout();
};

delBtn.addEventListener("click", function(e) {
    fetch("/submit", {
        method: "delete",
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            workoutTitle: document.getElementById("workoutTitle").value,
            exercises: document.getElementById("exercise").value.split(',')
        })
    })
    .then(res => res.json())
    .then(res => newWorkoutSnippet([res]));
    resetWorkout();
});

getResults();
