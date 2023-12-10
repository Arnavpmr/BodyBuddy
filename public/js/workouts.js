function filterWorkouts(){
    const input = document.getElementById("workoutSearch");
    const filterVal = input.value.toUpperCase();
    const allChildren = document.getElementById("element_container").getElementsByClassName("favoriteWorkoutElement");
    for (let i = 0; i < allChildren.length; i++) {
        const txt = allChildren[i].ariaLabel;
        if(txt.toUpperCase().indexOf(filterVal) > -1){
            allChildren[i].style.display = "";
        }
        else{
            allChildren[i].style.display = "none";
        }
    }
}

function expandWorkout(id){
    //TODO: View info about spoecific workout
}

function deleteWorkout(id){
    // TODO: Make request to delete workout
}

function createWorkout(){
    //TODO: Make screen to create workout
}