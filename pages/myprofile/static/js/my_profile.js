document.addEventListener("DOMContentLoaded", function () {
  // Close modal when clicking outside
  window.onclick = function (event) {
    const modal = document.getElementById("editModal");
    if (event.target == modal) {
      closeModal();
    }
  };

  // Close modal with Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeModal();
    }
  });
});

function editSection(sectionId) {
  const modal = document.getElementById("editModal");
  const modalFields = document.getElementById("modal-fields");
  const gridContainer = document.querySelector(".grid-container");
  modal.style.display = "flex";

  // Clear previous fields
  modalFields.innerHTML = "";

  if (sectionId === "top-section") {
    const firstName = gridContainer.dataset.firstName || "";
    const lastName = gridContainer.dataset.lastName || "";
    const role = gridContainer.dataset.role || "";

    modalFields.innerHTML = `
            <h2>Edit Profile Info</h2>
            <label for="firstName">First Name</label>
            <input type="text" id="firstName" name="firstName" placeholder="Enter your first name" value="${firstName}" required>
            
            <label for="lastName">Last Name</label>
            <input type="text" id="lastName" name="lastName" placeholder="Enter your last name" value="${lastName}" required>
            
            <label for="position">Position</label>
            <input type="text" id="position" name="position" placeholder="Enter your current position" value="${role}" required>
            
            <label for="profilePicture">Profile Picture</label>
            <input type="file" id="profilePicture" name="profilePicture" accept="image/*">
        `;
  } else if (sectionId === "links") {
    const linkedin = gridContainer.dataset.linkedin || "";
    const github = gridContainer.dataset.github || "";
    const facebook = gridContainer.dataset.facebook || "";

    modalFields.innerHTML = `
            <h2>Edit Social Media Links</h2>
            <label for="linkedin">LinkedIn Profile URL</label>
            <input type="url" id="linkedin" name="linkedin" placeholder="https://www.linkedin.com/in/your-profile" value="${linkedin}">
            
            <label for="github">GitHub Profile URL</label>
            <input type="url" id="github" name="github" placeholder="https://github.com/your-username" value="${github}">
            
            <label for="facebook">Facebook Profile URL</label>
            <input type="url" id="facebook" name="facebook" placeholder="https://www.facebook.com/your-profile" value="${facebook}">
        `;
  } else if (sectionId === "about") {
    const aboutMe = gridContainer.dataset.aboutMe || "";

    modalFields.innerHTML = `
            <h2>Edit About Me</h2>
            <label for="aboutMe">Tell us about yourself</label>
            <textarea id="aboutMe" name="aboutMe" placeholder="Share your story, experience, and aspirations..." required>${aboutMe}</textarea>
        `;
  } else if (sectionId === "background") {
    // Fetch background data and organizations
    Promise.all([
      fetch("/get_background").then((response) => response.json()),
      fetch("/get_organizations").then((response) => response.json()),
    ])
      .then(([backgroundData, orgData]) => {
        if (
          backgroundData.status === "success" &&
          orgData.status === "success"
        ) {
          let orgOptions = orgData.organizations
            .map(
              (org) =>
                `<option value="${org.org_name}">${org.org_name}</option>`
            )
            .join("");

          modalFields.innerHTML = `
          <h2>Manage Background</h2>
          
          ${
            backgroundData.experiences.length > 0
              ? `
            <h3 style="color: #45d49d; margin-top: 20px;">Experience</h3>
            ${backgroundData.experiences
              .map(
                (exp) => `
              <div class="project-item">
                <div>
                  <div class="project-title">${exp.org_name}</div>
                  <div style="color: #aaa; font-size: 14px;">${exp.description} | ${exp.period}</div>
                </div>
                <button type="button" class="delete-project-button" data-type="experience" data-id="${exp._id}">Delete</button>
              </div>
            `
              )
              .join("")}
          `
              : '<h3 style="color: #45d49d; margin-top: 20px;">Experience</h3><p style="color: #aaa;">No experience added yet.</p>'
          }
          
          ${
            backgroundData.educations.length > 0
              ? `
            <h3 style="color: #45d49d; margin-top: 20px;">Education</h3>
            ${backgroundData.educations
              .map(
                (edu) => `
              <div class="project-item">
                <div>
                  <div class="project-title">${edu.org_name}</div>
                  <div style="color: #aaa; font-size: 14px;">${edu.description} | ${edu.period}</div>
                </div>
                <button type="button" class="delete-project-button" data-type="education" data-id="${edu._id}">Delete</button>
              </div>
            `
              )
              .join("")}
          `
              : '<h3 style="color: #45d49d; margin-top: 20px;">Education</h3><p style="color: #aaa;">No education added yet.</p>'
          }
          
          <h3 style="color: #45d49d; margin-top: 30px;">Add New</h3>
          <label for="type">Type</label>
          <select id="type" name="type" required>
              <option value="">Select type</option>
              <option value="experience">Experience</option>
              <option value="education">Education</option>
          </select>
          
          <label for="organization">Organization</label>
          <select id="organization" name="organization" required>
              <option value="">Select organization</option>
              ${orgOptions}
          </select>
          
          <label for="position">Position/Degree</label>
          <input type="text" id="position" name="position" placeholder="Enter your position or degree" required>
          
          <label for="period">Period</label>
          <input type="text" id="period" name="period" placeholder="e.g., 2020 - Present" required>
        `;

          // Add event listeners to delete buttons
          document
            .querySelectorAll(".delete-project-button")
            .forEach((button) => {
              button.addEventListener("click", function (e) {
                e.preventDefault();
                const type = this.dataset.type;
                const id = this.dataset.id;
                const itemName =
                  this.closest(".project-item").querySelector(
                    ".project-title"
                  ).textContent;

                if (
                  confirm(
                    `Are you sure you want to delete this ${type}: ${itemName}?`
                  )
                ) {
                  deleteBackgroundItem(type, id, this.parentElement);
                }
              });
            });
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        modalFields.innerHTML = "<p>Error loading background data.</p>";
      });
  } else if (sectionId === "projects") {
    fetch("/get_projects")
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          modalFields.innerHTML = "<h2>Manage Projects</h2>";
          if (data.projects.length > 0) {
            data.projects.forEach((project) => {
              modalFields.innerHTML += `
                                <div class="project-item">
                                    <span class="project-title">${project.title}</span>
                                    <button type="button" class="delete-project-button" data-project-id="${project._id}">Delete</button>
                                </div>
                            `;
            });
          } else {
            modalFields.innerHTML += "<p>No projects added yet.</p>";
          }

          modalFields.innerHTML += `
                        <p style="margin-top: 20px; color: #45d49d;">
                            To add a new project, use the "Create Project" button in the projects section.
                        </p>
                    `;

          // Add event listeners to delete buttons
          document
            .querySelectorAll(".delete-project-button")
            .forEach((button) => {
              button.addEventListener("click", function (e) {
                e.preventDefault();
                if (confirm("Are you sure you want to delete this project?")) {
                  const projectId = this.dataset.projectId;
                  deleteProject(projectId, this.parentElement);
                }
              });
            });
        }
      });
  }

  // Add the sectionId to the modal form
  document.getElementById("editForm").dataset.sectionId = sectionId;
}

function closeModal() {
  document.getElementById("editModal").style.display = "none";
}

function deleteProject(projectId, elementToRemove) {
  fetch("/delete_project", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectId: projectId }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        elementToRemove.remove();
        // If no more projects, show message
        if (document.querySelectorAll(".project-item").length === 0) {
          document.getElementById("modal-fields").innerHTML = `
                    <h2>Manage Projects</h2>
                    <p>No projects added yet.</p>
                    <p style="margin-top: 20px; color: #45d49d;">
                        To add a new project, use the "Create Project" button in the projects section.
                    </p>
                `;
        }
      } else {
        alert("Error deleting project: " + data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while deleting the project");
    });
}

function deleteBackgroundItem(type, itemId, elementToRemove) {
  const endpoint =
    type === "experience" ? "/delete_experience" : "/delete_education";
  const idKey = type === "experience" ? "experienceId" : "educationId";

  fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ [idKey]: itemId }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        elementToRemove.remove();

        // Check if section is now empty and update display
        const section = elementToRemove.closest("div");
        const remainingItems = section.querySelectorAll(".project-item");
        if (remainingItems.length === 0) {
          const sectionTitle = section.querySelector("h3").textContent;
          const emptyMessage = document.createElement("p");
          emptyMessage.style.color = "#aaa";
          emptyMessage.textContent = `No ${sectionTitle.toLowerCase()} added yet.`;
          section.appendChild(emptyMessage);
        }
      } else {
        alert("Error deleting " + type + ": " + data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred while deleting the " + type);
    });
}

document
  .getElementById("editForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const sectionId = event.target.dataset.sectionId;
    const formData = new FormData();

    if (sectionId === "top-section") {
      formData.append(
        "firstName",
        document.getElementById("firstName").value.trim()
      );
      formData.append(
        "lastName",
        document.getElementById("lastName").value.trim()
      );
      formData.append(
        "position",
        document.getElementById("position").value.trim()
      );
      const profilePicture = document.getElementById("profilePicture").files[0];
      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }
    } else if (sectionId === "links") {
      formData.append(
        "linkedin",
        document.getElementById("linkedin").value.trim()
      );
      formData.append("github", document.getElementById("github").value.trim());
      formData.append(
        "facebook",
        document.getElementById("facebook").value.trim()
      );
    } else if (sectionId === "about") {
      formData.append(
        "aboutMe",
        document.getElementById("aboutMe").value.trim()
      );
    } else if (sectionId === "background") {
      formData.append("type", document.getElementById("type").value);
      formData.append(
        "organization",
        document.getElementById("organization").value
      );
      formData.append(
        "position",
        document.getElementById("position").value.trim()
      );
      formData.append("period", document.getElementById("period").value.trim());
    }

    formData.append("sectionId", sectionId);

    fetch("/update_profile", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "success") {
          // Update the UI with the new data
          updateUI(sectionId, data);
          closeModal();
        } else {
          alert("Error updating profile: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred while updating the profile");
      });
  });

function updateUI(sectionId, data) {
  if (sectionId === "top-section") {
    document.querySelector(
      "#top-section .my-details h1"
    ).textContent = `${data.first_name} ${data.last_name}`;
    document.querySelector("#top-section .my-details h3").textContent =
      data.role;
    if (data.profile_picture) {
      document.querySelector("#top-section img").src = data.profile_picture;
    }
  } else if (sectionId === "links") {
    const linkedinElement = document.querySelector(
      '#links a[href*="linkedin"]'
    );
    const githubElement = document.querySelector('#links a[href*="github"]');
    const facebookElement = document.querySelector(
      '#links a[href*="facebook"]'
    );

    if (linkedinElement) linkedinElement.href = data.linkedin;
    if (githubElement) githubElement.href = data.github;
    if (facebookElement) facebookElement.href = data.facebook;

    // Refresh the page to update the social media icons visibility
    location.reload();
  } else if (sectionId === "about") {
    document.querySelector("#about div").textContent = data.about_me;
  } else if (sectionId === "background") {
    // Refresh the page to show the new background item
    location.reload();
  }
}
