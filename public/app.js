// new item
const saveBtn = document.getElementById("save");
// clear all items
const clearAllExercises = document.getElementById("clear-all-exercises");
// delete an item
const results = document.getElementById("results");


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

function newWorkoutTodoSnippet(res) {
    for (var i = 0; i < res.length; i++) {
        let data_id = res[i]["_id"];
        let workoutTitle = res[i]["workoutTitle"];
        let todoList = document.getElementById("results");
        snippet = `
      <p class="data-entry">
      <span class="dataTitle" data-id=${data_id}>${workoutTitle}</span>
      <span onClick="delete" class="delete" data-id=${data_id}>x</span>;
      </p>`;
        todoList.insertAdjacentHTML("beforeend", snippet);
    }
}

function clearWorkout() {
    const todoList = document.getElementById("results");
    todoList.innerHTML = "";
}

function resetTitleAndNote() {
    const exercise = document.getElementById("exercise");
    exercise.value = "";
    const workoutTitle = document.getElementById("workoutTitle");
    workoutTitle.value = "";
    const repetitions = document.getElementById("repetitions");
    repetitions.value = 0;
}

function updateTitleAndNote(data) {
    const exercise = document.getElementById("exercise");
    exercise.value = data.exercise;
    const workoutTitle = document.getElementById("workoutTitle");
    workoutTitle.value = data.workoutTitle;
}

getResults();

clearAllExercises.addEventListener("click", function(e) {
    if (e.target.matches("#clear-all-exercises")) {
        element = e.target;
        fetch("/clearall", {
                method: "delete"
            })
            .then(function(response) {
                if (response.status !== 200) {
                    console.log("Looks like there was a problem. Status Code: " + response.status);
                    return;
                }
                clearWorkout();
            })
            .catch(function(err) {
                console.log("Fetch Error :-S", err);
            });
    }
});

results.addEventListener("click", function(e) {
    if (e.target.matches(".delete")) {
        element = e.target;
        data_id = element.getAttribute("data-id");
        fetch("/delete/" + data_id, {
                method: "delete"
            })
            .then(function(response) {
                if (response.status !== 200) {
                    console.log("Looks like there was a problem. Status Code: " + response.status);
                    return;
                }
                element.parentNode.remove();
                resetTitleAndNote();
            })
            .catch(function(err) {
                console.log("Fetch Error :-S", err);
            });
    } else if (e.target.matches(".dataTitle")) {
        // TODO Finish this block
        element = e.target;
        data_id = element.getAttribute("data-id");
        fetch("/find/" + data_id, { method: "get" })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                updateTitleAndNote(data);
            })
            .catch(function(err) {
                console.log("Fetch Error :-S", err);
            });
    }
});

actionBtn.addEventListener("click", function(e) {
    if (e.target.matches("#updater")) {
        updateBtnEl = e.target;
        data_id = updateBtnEl.getAttribute("data-id");
        const workoutTitle = document.getElementById("workoutTitle").value;
        const exercise = document.getElementById("exercise").value;
        const repetitions = document.getElementById("repetitions").value;
        fetch("/update/" + data_id, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    workoutTitle,
                    exercise,
                    repetitions
                })
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                element.innerText = title
                resetTitleAndNote();
            })
            .catch(function(err) {
                console.log("Fetch Error :-S", err);
            });
    } else if (e.target.matches("#save")) {
        element = e.target;
        fetch("/submit", {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    workoutTitle: document.getElementById("workoutTitle").value,
                    exercise: document.getElementById("exercise").value,
                    repetitions: document.getElementById("repetitions").value
                })
            })
            .then(res => res.json())
            .then(res => newWorkoutSnippet([res]));
        resetTitleAndNote();
    }
});
