(function () {
  const commentForm = document.getElementById("new_comment_form");
  console.log(commentForm);

  if (commentForm) {
    const comment = document.getElementById("comment-content");

    let comment_error_container = document.getElementById(
      "comment_box-container"
    );

    commentForm.addEventListener("submit", (event) => {
      event.preventDefault();
      console.log("B");
      try {
        comment_error_container.hidden = true;

        const comment_value = comment.value;

        let flag = 0;
        console.log(flag);

        if (!comment_value) {
          console.log(comment_error_container);
          comment_error_container.hidden = false;
          flag = 1;
          console.log(comment_error_container);
        }

        if (flag == 0) {
          console.log("entered in flag");
          commentForm.action = "/comments";
          console.log(commentForm);
          commentForm.submit();
        }
      } catch (e) {
        const message = typeof e === "string" ? e : e.message;
        console.log(message);
      }
    });
  }
})();
