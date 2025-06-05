"use strict";
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector(".login-form");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const formObject = {};
    formData.forEach((value, key) => {
      formObject[key] = value;
    });

    // Handle checkbox specifically (it won't be in FormData if unchecked)
    const rememberCheckbox = form.querySelector('input[name="remember-me"]');
    formObject["remember-me"] = rememberCheckbox
      ? rememberCheckbox.checked
      : false;

    console.log("Form data being sent:", formObject); // Debug log

    try {
      const response = await fetch("/check_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formObject),
      });

      const result = await response.json();
      if (result.success) {
        window.location.href = result.redirect;
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  });
});
