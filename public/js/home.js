const workoutHotbar = Array.from(
  document.getElementsByClassName("favoriteWorkoutElement"),
);
console.log(workoutHotbar);

workoutHotbar.map((div) => {
  console.log(div);
  const expandDiv = Array.from(div.getElementsByClassName("expanded"))[0];
  const expandButton = Array.from(
    div.getElementsByClassName("about_button"),
  )[0];

  expandButton.addEventListener("click", (e) => {
    console.log(e.currentTarget);
    if (e.currentTarget.innerHTML === "Expand") {
      //Show list
      expandDiv.style.display = "";
      e.currentTarget.innerHTML = "Hide";
    } else {
      //Hide list
      expandDiv.style.display = "none";
      e.currentTarget.innerHTML = "Expand";
    }
  });
});
