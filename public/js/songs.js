console.log("A");
const SongForm = document.getElementById("new_song_form");

if (SongForm) {
  const song_title = document.getElementById("song_title_value");
  const genre_input = document.getElementById("song-checkbox-container");
  const song_file = document.getElementById("song-file");

  const title_error_container = document.getElementById(
    "title_error-container"
  );
  const genre_error_container = document.getElementById(
    "genre_error-container"
  );
  const file_error_container = document.getElementById("file_error-container");
}

SongForm.addEventListener("submit", (event) => {
  event.preventDefault();

  try {
    title_error_container.classList.add("hidden");
    genre_error_container.classList.add("hidden");
    file_error_container.classList.add("hidden");

    const song_title_value = song_title.value;
    const genre_input_value = genre_input.value;
    const song_file_value = song_file.value;

    console.log(song_title_value);
    console.log(genre_input_value);
    console.log(song_file_value);

    let flag = 0;

    if (!song_title_value) {
      title_error_container.textContent = "* Song Title not provided";
      title_error_container.classList.remove("hidden");
      flag = 1;
    }

    if (!genre_input_value) {
      genre_error_container.textContent = "* Genre not provided";
      genre_error_container.classList.remove("hidden");
      flag = 1;
    }

    if (!song_file_value) {
      title_error_container.textContent = "* .mp3 Song File not provided";
      file_error_container.classList.remove("hidden");
      flag = 3;
    }
    if (flag != 0) {
      return false;
    }
  } catch (e) {
    const message = typeof e === "string" ? e : e.message;
  }
});
