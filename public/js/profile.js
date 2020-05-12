$(document).ready(function () {
  // Let's start writing AJAX calls!
  var oldinterested = $("#rock-checkbox").data("value").split(",");
  if (oldinterested.includes("rock")) {
    $("#rock-checkbox").prop("checked", true);
  }
  if (oldinterested.includes("pop")) {
    $("#pop-checkbox").prop("checked", true);
  }
  if (oldinterested.includes("indie")) {
    $("#indie-checkbox").prop("checked", true);
  }
  if (oldinterested.includes("classical")) {
    $("#classical-checkbox").prop("checked", true);
  }
  var myProfileForm = $("#update-user-form");
  myProfileForm.submit(function (event) {
    event.preventDefault();
    $("#msg").hide();
    var firstName = $("#first-name").val();
    var lastName = $("#last-name").val();
    // var email = $("#email").val();

    var interested = [];
    if ($("#rock-checkbox").is(":checked")) {
      interested.push("rock");
    }
    if ($("#pop-checkbox").is(":checked")) {
      interested.push("pop");
    }
    if ($("#indie-checkbox").is(":checked")) {
      interested.push("indie");
    }
    if ($("#classical-checkbox").is(":checked")) {
      interested.push("classical");
    }

    var gender = $("#gender").val();
    var city = $("#city").val();
    var state = $("#state").val();
    var age = $("#age").val();
    var bio = $("#bio").val();
    var id = $("#first-name").data("value");
    var json = JSON.stringify({
      firstName: firstName,
      lastName: lastName,
      gender: gender,
      city: city,
      state: state,
      age: age,
      bio: bio,
      interested: interested,
    });
    var requestConfig = {
      method: "PATCH",
      url: "/users/" + id,
      contentType: "application/json",
      data: json,
      success: function (json) {
        $("#msg").show();
      },
      error: function (xhr, status, errorThrown) {
        $("#msgFail").html(xhr.responseText);
        $("#msgFail").show();
      },
    };
    $.ajax(requestConfig);
  });
});
