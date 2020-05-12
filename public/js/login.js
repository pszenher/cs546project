(function () {
  console.log("A");
  const loginForm = document.getElementById("login-form");
  console.log(loginForm);

  if (loginForm) {
    const email = document.getElementById("email");
    const pass = document.getElementById("password");

    let email_error_container = document.getElementById(
      "email_error-container"
    );
    let password_error_container = document.getElementById(
      "password_error-container"
    );
    let backend_error_container = document.getElementById("backend_checking");

    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      console.log("B");
      console.log(backend_error_container);
      try {
        email_error_container.hidden = true;
        password_error_container.hidden = true;
        if (backend_error_container) {
          // console.log("errors")
          backend_error_container.hidden = false;
        }

        const email_value = email.value;
        const passsword_value = pass.value;

        let flag = 0;
        console.log(flag);

        if (!email_value) {
          console.log(email_error_container);
          email_error_container.hidden = false;
          flag = 1;
          console.log(email_error_container);
          if (backend_error_container) {
            backend_error_container.hidden = true;
          }
        }

        if (!passsword_value) {
          console.log(password_error_container);
          password_error_container.hidden = false;
          flag = 1;
          console.log(password_error_container);
          if (backend_error_container) {
            backend_error_container.hidden = true;
          }
        }

        if (flag == 0) {
          console.log("entered in flag");
          loginForm.action = "/login";
          console.log(loginForm);
          loginForm.submit();
        }
      } catch (e) {
        const message = typeof e === "string" ? e : e.message;
        console.log(message);
      }
    });
  }
})();
