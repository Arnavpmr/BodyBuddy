document.addEventListener("DOMContentLoaded", (event) => {
  const editButton = document.querySelector("#editProfileButton");
  const saveButton = document.querySelector("#saveChangesButton");
  const profileForm = document.querySelector("#profileForm");

  document.querySelectorAll(".acceptRequestBtn").forEach((button) => {
    button.addEventListener("click", () => {
      const userName = button.getAttribute("data-username");
      resolveFriendRequest(userName, "accept");
    });
  });

  document.querySelectorAll(".denyRequestBtn").forEach((button) => {
    button.addEventListener("click", () => {
      const userName = button.getAttribute("data-username");
      resolveFriendRequest(userName, "deny");
    });
  });

  const username = window.location.pathname.split("/").pop();

  const fields = profileForm
    ? profileForm.querySelectorAll("input, textarea")
    : null;

  if (editButton && fields) {
    editButton.addEventListener("click", () => {
      fields.forEach((field) => (field.disabled = false));
      saveButton.hidden = false;
    });
  } else {
    console.error("Edit button or profile form fields not found!");
  }

  if (saveButton && fields) {
    saveButton.addEventListener("click", (e) => {
      e.preventDefault();

      fields.forEach((field) => (field.disabled = false));

      const formData = new FormData(profileForm);
      const jsonData = {};

      formData.forEach((value, key) => {
        jsonData[key] = value;
      });

      fields.forEach((field) => (field.disabled = true));

      console.log("Sending JSON data:", jsonData);

      fetch(`/user/${username}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jsonData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              "Network response was not ok: " + response.statusText,
            );
          }
          return response.json();
        })
        .then((data) => {
          if (data.message) {
            console.log(data.message);
            fields.forEach((field) => (field.disabled = true));
            saveButton.hidden = true;
          } else {
            throw new Error(data.error || "Error updating profile");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  } else {
    console.error("Save button or profile form fields not found!");
  }
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const searchResults = document.getElementById("searchResults");

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();

    if (query) {
      fetch(`/user/users?prefix=${query}`)
        .then((response) => response.json())
        .then((data) => {
          searchResults.innerHTML = "";
          data.forEach((userName) => {
            const userElement = document.createElement("div");
            userElement.innerHTML = `<a href="/user/${userName}">${userName}</a>`;
            searchResults.appendChild(userElement);
          });
          if (data.length > 0) {
            searchResults.style.display = "block";
          }
        })
        .catch((error) => console.error("Error:", error));
    }
  });

  window.onclick = function (event) {
    if (!event.target.matches("#searchInput")) {
      searchResults.style.display = "none";
    }
  };
  const sendRequestBtn = document.querySelector(".sendFriendRequestBtn");
  if (sendRequestBtn) {
    sendRequestBtn.addEventListener("click", function () {
      const targetUserName = this.getAttribute("data-username");
      sendFriendRequest(targetUserName);
    });
  }
});

function resolveFriendRequest(userName, decision) {
  fetch("/user/resolverequest", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userName, decision }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message) {
        console.log(data.message);
        window.location.reload();
      } else {
        throw new Error(data.error || "Error resolving friend request");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function sendFriendRequest(targetUserName) {
  fetch("/user/createrequest", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ targetUserName: targetUserName }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((data) => {
      console.log(data.message);
      const statusElement = document.getElementById("friendRequestStatus");
      statusElement.textContent = "Friend request sent to " + targetUserName;
      statusElement.style.color = "green";
    })
    .catch((error) => {
      console.error("Error sending friend request:", error);
      const statusElement = document.getElementById("friendRequestStatus");
      statusElement.textContent = "Error sending friend request";
      statusElement.style.color = "red";
    });
}
