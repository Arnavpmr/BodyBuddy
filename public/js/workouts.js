(function ($) {
  const createButton = $("#create_workout");
  const searchBar = $("#workoutSearch");
  const createPopup = $("#create_workout_popup");
  const addExercises = $("#addExercises");
  const bodyDiagram = $("#bodyDiagram");
  const availableList = $("#availableList");
  const curPlanList = $("#planList");
  const saveWorkout = $("#submitWorkout");
  const submitError = $("#submitError");

  function runFilter() {
    const input = $("#workoutSearch");
    const filterVal = input.val().toUpperCase();
    const allChildren = $("#element_container").find(".favoriteWorkoutElement");
    for (let i = 0; i < allChildren.length; i++) {
      const txt = allChildren[i].ariaLabel;
      if (txt.toUpperCase().indexOf(filterVal) > -1) {
        allChildren[i].style.display = "";
      } else {
        allChildren[i].style.display = "none";
      }
    }
  }

  const deleteWorkouts = Array.from(
    $("#element_container").find(".about_button"),
  ).filter((el) => {
    return el.innerHTML === "Delete";
  });

  const addWorkouts = Array.from(
    $("#element_container").find(".about_button"),
  ).filter((el) => {
    return el.innerHTML === "Add";
  });

  addWorkouts.map((item) => {
    item.addEventListener("click", () => {
      const body = JSON.parse(item.value);
      body["workoutTypes"] = body.type;
      body.isPreset = false;
      console.log(body);
      $.post(`/workouts/workout/`, body, (res) => {
        console.log("Workout made!");
        location.reload();
      });
    });
  });

  deleteWorkouts.map((item) => {
    item.addEventListener("click", () => {
      const id = item.value;
      $.ajax({
        url: `/workouts/workout/${id}`,
        type: "DELETE",
      }).then((res) => {
        console.log(res);
        location.reload();
      });
    });
  });

  $("#clear_filter").on("click", (e) => {
    const allChildren = $("#element_container").find(".favoriteWorkoutElement");
    for (let i = 0; i < allChildren.length; i++) {
      allChildren[i].style.display = "none";
    }
  });

  let currentExercises = [];

  saveWorkout.on("submit", (e) => {
    submitError.empty();
    const target = e.currentTarget;
    e.preventDefault();
    let errorMsg = "";
    let errors = false;
    const name = target[0].value.trim();
    if (name.length === 0) {
      errors = true;
      errorMsg = "Workout name must not be only empty spaces";
    }

    const types = [];
    let index = 1;
    let usedType = false;
    while (target[index].type === "checkbox") {
      if (target[index].checked) {
        types.push(target[index].value);
        usedType = true;
      }
      index++;
    }

    if (!usedType) {
      errors = true;
      errorMsg = "You must select a workout type";
    }

    if (currentExercises.length === 0) {
      errors = true;
      errorMsg = "You must have at least 1 exercise in your workout";
    }
    const desc = target[index].value.trim();

    if (errors) {
      submitError.append(errorMsg);
      console.log(errorMsg);
    } else {
      submitError.empty();
      const body = {
        name: name,
        workoutTypes: types,
        notes: desc,
        exercises: currentExercises,
      };
      console.log(body);
      $.post(`/workouts/workout/`, body, (res) => {
        console.log("Workout made!");
      });

      curPlanList.empty();
      createPopup.css("display", "none");
      createButton.html("Workout Created!! Press to make another!");
      setTimeout(() => {
        if (createPopup.css("display") === "none") {
          createButton.html("Create your Own Workout!");
        } else {
          createButton.html("Hide Creation Menu");
        }
      }, 2000);
    }
  });

  searchBar.on("keyup", (e) => {
    runFilter();
  });

  function renderExercises() {
    curPlanList.empty();
    currentExercises.map((ex, i) => {
      const element2 = $(`
      <form id="ex_${i}">
      <div class="center" style="border-radius: 5px; border: .1rem solid black;margin: .5rem;color: black;">
      <span style="font-size: 16pt;font-weight: bold;">${ex.name} </span>
      <span><span style="font-weight: bold">Muscles: </span>  ${
        ex.targetMuscles
      } </span>
      <span><span style="font-weight: bold">Difficulty: </span>  ${
        ex.difficulty
      } </span>
      <br/>
      <div id="$exercise_done_${i}" style="color: black;">
          <p>${ex.description}</p>
          <p class="expand_title">Required Equipment</p>
          ${ex.equipment.length === 0 ? "None!" : ex.equipment}
          <p class="expand_title">Instructions</p>

          ${ex.instructions
            .split("\n")
            .map((el3) => `<p>${el3}</p>`)
            .join("")}
          <p class="expand_title">Reps and Sets</p>
          <p>Reps: ${ex.reps}</p>
          <p>Sets: ${ex.sets}</p>
          <input type="submit" value="Remove Exercise" id="ex_button_${i}">
      </div>
      </div>
      </form>
      `);
      element2.on("submit", (e) => {
        currentExercises = currentExercises
          .slice(0, i)
          .concat(currentExercises.slice(i + 1));
        renderExercises();
      });
      curPlanList.append(element2);
    });
  }

  createButton.on("click", (e) => {
    const curDisplay = createPopup.css("display");
    curDisplay === "none"
      ? createPopup.css("display", "")
      : createPopup.css("display", "none");
    if (curDisplay === "none") {
      createButton.html("Hide Creation Menu");
      createPopup.css("display", "");
      saveWorkout[0].reset();
      curPlanList.empty();
    } else {
      createButton.html("Create your Own Workout!");
      createPopup.css("display", "none");
    }
  });

  addExercises.on("click", (e) => {
    e.preventDefault();
    bodyDiagram.removeAttr("hidden");
  });

  $(".muscle_group_button").click((e) => {
    e.preventDefault();
    const muscleGroup = e.target.innerHTML;
    $.ajax({
      method: "GET",
      url: `/exercises/target/${muscleGroup}`,
    }).then((res) => {
      availableList.empty();
      const matches = res.match;
      console.log(matches);
      matches.map((el, i) => {
        const exp_d = `expand_div_${i}`;
        const exp_b = `expand_button_${i}`;
        const add_b = `add_button_${i}`;

        const reps_b = `add_reps_${i}`;
        const sets_b = `add_sets_${i}`;
        const rep_form = `ex_form_${i}`;

        //I don't want to talk about it
        const element = $(`
          <form id="${rep_form}">
          <div class="center" style="border-radius: 5px; border: .1rem solid black;margin: .5rem;color: black;">
          <span style="font-size: 16pt;font-weight: bold;">${el.name} </span>
            <span><span style="font-weight: bold">Muscles: </span>  ${
              el.targetMuscles
            } </span>
            <span><span style="font-weight: bold">Difficulty: </span>  ${
              el.difficulty
            } </span>
            <br/>
            <div id="${exp_d}" hidden style="color: black;">
                <img src="${el.image}" alt="${el.name}">
                <p>${el.description}</p>
                <p class="expand_title">Required Equipment</p>
                ${el.equipment.length === 0 ? "None!" : el.equipment}
                <p class="expand_title">Instructions</p>

                ${el.instructions
                  .split("\n")
                  .map((el2) => `<p>${el2}</p>`)
                  .join("")}
            </div>
            <button id="${exp_b}">Expand</button><button id="${add_b}">Add Exercise</button>
                <div id="add_rep_set_${i}" hidden>
                  <label for="${reps_b}">
                  Number of Reps
                  <input type="number" name="${reps_b}" id="${reps_b}" min="1" required>
                  </label><br>
                  <label for="${sets_b}">
                  Number of Sets
                  <input type="number" name="${sets_b}" id="${sets_b}" min="1" required><br>
                  <label for="confirm_b_${i}">Confirm your submission<input type="submit" value="Confirm" id="confirm_b_${i}" id="confirm_b_${i}"></label>
                </div>
                </div>
              </form>
          <script>
            document.getElementById("${exp_b}").addEventListener('click', (e) => {
                e.preventDefault();
                const currentText = e.target.innerHTML;
                e.target.innerHTML = (currentText === "Expand") ? "Unexpand" : "Expand";
                const info_div = document.getElementById("${exp_d}")
                if(currentText === "Expand"){
                  info_div.hidden = false;
                }
                else{
                  info_div.hidden = true;
                }
            });

            const expandForm = document.getElementById("add_rep_set_${i}");

            document.getElementById("${add_b}").addEventListener('click', (e) => {
              e.preventDefault();
              expandForm.hidden = false;

            });

            document.getElementById("${rep_form}").addEventListener('submit', (e) => {
              expandForm.hidden = true;
            });

          </script>
      `);
        element.on("submit", (e) => {
          e.preventDefault();
          const target = e.currentTarget;
          const temp = {
            ...el,
            reps: target[2].valueAsNumber,
            sets: target[3].valueAsNumber,
          };

          temp["id"] = temp._id;
          delete temp._id;
          currentExercises.push(temp);
          renderExercises();
        });
        availableList.append(element);
      });
    });
  });
})(window.jQuery);
