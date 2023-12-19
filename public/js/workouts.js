/**
 * Citations:
 * ----------
 * Checkbox dropdown found on StackOverflow (with slight modifications): https://stackoverflow.com/questions/19206919/how-to-create-checkbox-inside-dropdown
 */

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
  const container = $("#element_container");

  let typeFilter = [];
  let ascendingFilter = true;

  const allWorkouts = $("#element_container").find(".favoriteWorkoutElement");

  function runFilter(types, ascending) {
    function getDivData(div) {
      const data = JSON.parse(div.firstElementChild.innerText);
      return data;
    }

    const input = $("#workoutSearch");
    const filterVal = input.val().toUpperCase();
    container.empty();
    const filteredChildren = [];
    for (let i = 0; i < allWorkouts.length; i++) {
      let willShow = false;
      const data = getDivData(allWorkouts[i]);
      const txt = data.name;
      if (types.length === 0) willShow = true;
      for (let j = 0; j < data.type.length && !willShow; j++) {
        const el = data.type[j];
        if (types.includes(el)) willShow = true;
        else willShow = false;
      }

      if (willShow && txt.toUpperCase().indexOf(filterVal) > -1)
        willShow = true;
      else willShow = false;

      if (willShow) {
        filteredChildren.push(allWorkouts[i]);
      }
      // if (txt.toUpperCase().indexOf(filterVal) > -1) {
      //   allWorkouts[i].style.display = "";
      // } else {
      //   allWorkouts[i].style.display = "none";
      // }
    }
    //Sort and remount
    if (ascending) {
      filteredChildren.sort((x, y) => {
        return x.ariaLabel > y.ariaLabel;
      });
    } else {
      filteredChildren.sort((x, y) => {
        return x.ariaLabel < y.ariaLabel;
      });
    }

    for (let i = 0; i < filteredChildren.length; i++) {
      const element = filteredChildren[i];
      container.append(element.outerHTML);
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
          window.location.replace("/workouts");
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
          window.location.replace("/workouts");
        });
      });
    });
  }

  const clearButton = $("#clear_filter");

  function toggleClearButton(turnOff) {
    if (turnOff || clearButton.val() === "Hide List") {
      $("#element_container").css("display", "none");
      clearButton.val("Show list");
    } else {
      $("#element_container").css("display", "");
      clearButton.val("Hide List");
    }
  }

  clearButton.on("click", (e) => {
    toggleClearButton();
  });

  let currentExercises = [];

  //Saving a workout
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
          window.location.replace("/workouts");
          createButton.html("Hide Creation Menu");
        }
      }, 2000);
    }
  });

  searchBar.on("keyup", (e) => {
    $("#element_container").css("display", "");
    clearButton.val("Hide List");
    runFilter(typeFilter, ascendingFilter);
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
      matches.map((el, i) => {
        const exp_d = `expand_div_${i}`;
        const exp_b = `expand_button_${i}`;
        const add_b = `add_button_${i}`;

        const reps_b = `add_reps_${i}`;
        const sets_b = `add_sets_${i}`;
        // const weight_b = `weight_${i}`;
        // const dif_b = `difficulty_${i}`;
        // const rest_b = `rest_time_${i}`;

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
            // weightGoal: target[4].valueAsNumber,
            // difficulty: target[5].valueAsNumber,
            // restTime: target[6].valueAsNumber,
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

  //Filter Workout Type
  const checklist1 = $("#list1");
  checklist1.find(".anchor").on("click", (e) => {
    if (checklist1.hasClass("visible")) {
      checklist1.removeClass("visible");
    } else {
      checklist1.addClass("visible");
    }
  });

  $("#alpha_sort").on("click", (e) => {
    if (ascendingFilter) {
      e.currentTarget.value = "Sort by Name (Descending)";
    } else {
      e.currentTarget.value = "Sort by Name (Ascending)";
    }
    ascendingFilter = !ascendingFilter;
    runFilter(typeFilter, ascendingFilter);
  });

  Array.from($("#filterCheckList").find(".selectCheck")).map((res) => {
    res.addEventListener("change", (e) => {
      const target = e.currentTarget;
      if (target.checked) {
        //Add to list
        typeFilter.push(target.value);
      } else {
        //Remove from list
        const index = typeFilter.findIndex((e) => e === target.value);
        const temp = typeFilter.slice(0, index);
        typeFilter = temp.concat(typeFilter.slice(index + 1));
      }

      runFilter(typeFilter, ascendingFilter);
    });
  });

  const checklist2 = $("#list2");
  checklist2.find(".anchor").on("click", (e) => {
    if (checklist2.hasClass("visible")) {
      checklist2.removeClass("visible");
    } else {
      checklist2.addClass("visible");
    }
  });

  runFilter(typeFilter, ascendingFilter);
})(window.jQuery);
