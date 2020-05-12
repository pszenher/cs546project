(function () {
  console.log("A");
  const SongForm = document.getElementById("new_song_form");
  console.log(SongForm);

  if (SongForm) {
    const song_title = document.getElementById("song-title");
    const rock_input = document.getElementById("rock-checkbox");
    const pop_input = document.getElementById("pop-checkbox");
    const indie_input = document.getElementById("indie-checkbox");
    const classical_input = document.getElementById("classical-checkbox");
    const song_file = document.getElementById("song-file");

    let title_error_container = document.getElementById(
      "title_error-container"
    );
    let genre_error_container = document.getElementById(
      "genre_error-container"
    );
    let file_error_container = document.getElementById("file_error-container");

    SongForm.addEventListener("submit", (event) => {
      event.preventDefault();
      console.log("B");
      try {
        title_error_container.hidden = true;
        genre_error_container.hidden = true;
        file_error_container.hidden = true;

        const song_title_value = song_title.value;
        // const rock_input_value = rock_input.value;
        // const pop_input_value = pop_input.value;
        // const indie_input_value = indie_input.value;
        // const classical_input_value = classical_input.value;
        const song_file_value = song_file.value;

        console.log(song_title_value);
        console.log(rock_input.checked);
        console.log(pop_input.checked);
        console.log(indie_input.checked);
        console.log(classical_input.checked);
        console.log(song_file_value);

        let flag = 0;
        console.log(flag);

        if (!song_title_value) {
          console.log(title_error_container);
          title_error_container.hidden = false;
          flag = 1;
          console.log(title_error_container);
        }

        if (
          !rock_input.checked &&
          !pop_input.checked &&
          !indie_input.checked &&
          !classical_input.checked
        ) {
          console.log(genre_error_container);
          genre_error_container.hidden = false;
          flag = 1;
          console.log(title_error_container);
        }

        if (!song_file_value) {
          console.log(file_error_container);
          file_error_container.hidden = false;
          flag = 3;
          console.log(title_error_container);
        }

        if (flag == 0) {
          console.log("entered in flag");
          SongForm.action = "/songs";
          console.log(SongForm);
          SongForm.submit();
        }
      } catch (e) {
        const message = typeof e === "string" ? e : e.message;
        console.log(message);
      }
    });
  }
})();
