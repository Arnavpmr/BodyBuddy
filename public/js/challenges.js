(function ($) {
  $("#imageUpload").on("submit", async (e) => {
    const target = e.currentTarget;
    $.post(`/challenges/submit`, {}, (res) => {
      const text = $("#submit_result");
      if (res.isUploaded) {
        text.css("color", "green");
        text.html("Success!");
      } else {
        text.css("color", "red");
        text.html("Failure!");
      }
    });
  });

  async function updateSubmission(username, approved) {
    //Path: /challenge/submissions/submission/:userName
    console.log("making request");
    $.post(
      `/challenges/challenge/submissions/submission/${username}`,
      {
        status: approved ? "approved" : "denied",
      },
      (res) => {
        console.log("Submission approved!");
      },
    );
  }

  const container = $("#submissions_box");
  const expandDivs = Array.from(container.find(".submission-list-item"));
  expandDivs.map((div) => {
    const button = div.children[2];
    const expDiv = div.children[3];
    const childrenList = Array.from(expDiv.children);
    const acceptButton = childrenList.slice(-2, -1)[0];
    const denyButton = childrenList.slice(-1)[0];

    acceptButton.addEventListener("click", (e) => {
      updateSubmission(div.children[0].innerHTML, true);
    });

    denyButton.addEventListener("click", (e) => {
      updateSubmission(div.children[0].innerHTML, false);
    });

    button.addEventListener("click", (e) => {
      const target = e.target;
      if (target.innerHTML === "Expand") {
        expDiv.style.display = "block";
        target.innerHTML = "Hide";
      } else {
        expDiv.style.display = "none";
        target.innerHTML = "Expand";
      }
    });
  });
})(window.jQuery);
