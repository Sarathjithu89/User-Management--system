// Function to show alert messages
function showAlert(message, type = "success") {
  const alertBox = document.createElement("div");
  alertBox.className = `alert alert-${type} alert-dismissible fade show`;
  alertBox.role = "alert";
  alertBox.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
  document.body.prepend(alertBox);

  // Remove alert after 3 seconds
  setTimeout(() => {
    alertBox.remove();
  }, 3000);
}

// Add User
document.getElementById("addUserForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    name: e.target.name.value,
    email: e.target.email.value,
    mobile: e.target.mobile.value,
    password: e.target.password.value,
  };

  try {
    const response = await fetch("/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const newUser = await response.json();
      const userRow = `
            <tr data-user-id="${newUser._id}">
              <td>${newUser.name}</td>
              <td>${newUser.email}</td>
              <td>${newUser.mobile}</td>
              <td>
                <button class="btn btn-warning btn-sm edit-user-btn" data-user='${JSON.stringify(
                  newUser
                )}' data-bs-toggle="modal" data-bs-target="#editUserModal">Edit</button>
                <button class="btn btn-danger btn-sm delete-user-btn" data-user-id="${
                  newUser._id
                }">Delete</button>
              </td>
            </tr>
          `;

      document
        .getElementById("userTable")
        .insertAdjacentHTML("beforeend", userRow);
      $("#addUserModal").modal("hide");
      e.target.reset();
      showAlert("User added successfully!", "success");
    } else {
      showAlert("Failed to add user", "danger");
    }
  } catch (error) {
    console.error("Error:", error);
    showAlert("An error occurred!", "danger");
  }
});

// Delete User (With Event Delegation)
document.getElementById("userTable").addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-user-btn")) {
    const userId = e.target.dataset.userId;

    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        e.target.closest("tr").remove();
        showAlert("User deleted successfully!", "success");
      } else {
        showAlert("Failed to delete user", "danger");
      }
    } catch (error) {
      console.error("Error:", error);
      showAlert("An error occurred!", "danger");
    }
  }
});

// Edit User Modal Population
document.getElementById("userTable").addEventListener("click", (e) => {
  if (e.target.classList.contains("edit-user-btn")) {
    const user = JSON.parse(e.target.dataset.user);

    document.getElementById("editName").value = user.name;
    document.getElementById("editEmail").value = user.email;
    document.getElementById("editMobile").value = user.mobile;
    document.querySelector("input[name='userId']").value = user._id;

    new bootstrap.Modal(document.getElementById("editUserModal")).show();
  }
});

// Edit User Submission
document
  .getElementById("editUserForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const userId = document.querySelector("input[name='userId']").value;
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      mobile: e.target.mobile.value,
      password: e.target.password.value,
    };

    try {
      const response = await fetch(`/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        const userRow = document.querySelector(
          `#userTable tr[data-user-id="${updatedUser._id}"]`
        );

        userRow.children[0].textContent = updatedUser.name;
        userRow.children[1].textContent = updatedUser.email;
        userRow.children[2].textContent = updatedUser.mobile;

        $("#editUserModal").modal("hide");
        showAlert("User updated successfully!", "success");
      } else {
        showAlert("Failed to update user", "danger");
      }
    } catch (error) {
      console.error("Error:", error);
      showAlert("An error occurred!", "danger");
    }
  });

// Search Functionality
document.getElementById("searchInput").addEventListener("input", (e) => {
  const searchTerm = e.target.value.toLowerCase();
  document.querySelectorAll("#userTable tr").forEach((row) => {
    const name = row.children[0].textContent.toLowerCase();
    const email = row.children[1].textContent.toLowerCase();
    row.style.display =
      name.includes(searchTerm) || email.includes(searchTerm) ? "" : "none";
  });
});
