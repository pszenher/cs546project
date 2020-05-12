(function () {
  console.log("A");
  const userForm = document.getElementById("new-user-form");
  console.log(userForm);

  if (userForm) {
    const first_name = document.getElementById("first-name");
    const last_name = document.getElementById("last-name");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const rock_input = document.getElementById("rock-checkbox");
    const pop_input = document.getElementById("pop-checkbox");
    const indie_input = document.getElementById("indie-checkbox");
    const classical_input = document.getElementById("classical-checkbox");
    const gender = document.getElementById("gender");
    const city = document.getElementById("city");
    const state = document.getElementById("state");
    const age = document.getElementById("age");
    const Biography = document.getElementById("bio");

    let first_error_container = document.getElementById("first_name-container");
    let last_error_container = document.getElementById("last_name-container");
    let email_error_container = document.getElementById("email_user-container");
    let password_error_container = document.getElementById(
      "password_user-container"
    );
    let interest_error_container = document.getElementById(
      "Interest_user-container"
    );
    let gender_error_container = document.getElementById(
      "gender_user-container"
    );
    let city_error_container = document.getElementById("city_user-container");
    let state_error_container = document.getElementById("state_user-container");
    let age_error_container = document.getElementById("age_user-container");
    let bio_error_container = document.getElementById("bio_user-container");

    userForm.addEventListener("submit", (event) => {
      event.preventDefault();
      console.log("B");
      try {
        first_error_container.hidden = true;
        last_error_container.hidden = true;
        email_error_container.hidden = true;
        password_error_container.hidden = true;
        interest_error_container.hidden = true;
        gender_error_container.hidden = true;
        city_error_container.hidden = true;
        state_error_container.hidden = true;
        age_error_container.hidden = true;
        bio_error_container.hidden = true;

        const first_name_value = first_name.value;
        const last_name_value = last_name.value;
        const email_value = email.value;
        const password_value = password.value;
        const gender_value = gender.value;
        const city_value = city.value;
        const state_value = state.value;
        const age_value = age.value;
        const biography_value = Biography.value;
        // const rock_input_value = rock_input.value;
        // const pop_input_value = pop_input.value;
        // const indie_input_value = indie_input.value;
        // const classical_input_value = classical_input.value;

        console.log(rock_input.checked);
        console.log(pop_input.checked);
        console.log(indie_input.checked);
        console.log(classical_input.checked);
        console.log(biography_value);

        let flag = 0;
        console.log(flag);

        if (!first_name_value) {
          console.log(first_error_container);
          first_error_container.hidden = false;
          flag = 1;
          console.log(first_error_container);
        }

        if (!last_name_value) {
          console.log(last_error_container);
          last_error_container.hidden = false;
          flag = 1;
          console.log(last_error_container);
        }

        if (!email_value) {
          console.log(email_error_container);
          email_error_container.hidden = false;
          flag = 1;
          console.log(email_error_container);
        }

        if (!password_value) {
          console.log(password_error_container);
          password_error_container.hidden = false;
          flag = 1;
          console.log(password_error_container);
        }

        if (
          !rock_input.checked &&
          !pop_input.checked &&
          !indie_input.checked &&
          !classical_input.checked
        ) {
          console.log(interest_error_container);
          interest_error_container.hidden = false;
          flag = 1;
          console.log(interest_error_container);
        }

        if (!gender_value) {
          console.log(gender_error_container);
          gender_error_container.hidden = false;
          flag = 1;
          console.log(gender_error_container);
        }

        if (!city_value) {
          console.log(city_error_container);
          city_error_container.hidden = false;
          flag = 1;
          console.log(city_error_container);
        }

        if (!state_value) {
          console.log(state_error_container);
          state_error_container.hidden = false;
          flag = 1;
          console.log(state_error_container);
        }

        if (!age_value) {
          console.log(age_error_container);
          age_error_container.hidden = false;
          flag = 1;
          console.log(age_error_container);
        }

        if (!biography_value) {
          console.log(bio_error_container);
          bio_error_container.hidden = false;
          flag = 1;
          console.log(bio_error_container);
        }

        if (flag == 0) {
          console.log("entered in flag");
          userForm.action = "/users";
          console.log(userForm);
          userForm.submit();
        }
      } catch (e) {
        const message = typeof e === "string" ? e : e.message;
        console.log(message);
      }
    });
  }
})();
