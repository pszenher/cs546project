$(document).ready(function () {
  var myProfileForm = $("#new-password-form");
  myProfileForm.submit(function (event) {
    event.preventDefault();
    $("#msg").hide();
    $("#msgFail").hide();
    var oldPass = $("#password-old").val();
    var newPass = $("#password-new").val();
    var id = $("#user-id").data("value");
    var json = JSON.stringify({
      id: id,
      password: oldPass,
      newPass: newPass,
    });
    /*var requestConfig = {
        method: 'POST',
        url: '/users/updatePassword',
        contentType: 'application/json',
        data: json
      } */

    var requestConfig = {
      method: "POST",
      url: "/users/updatePassword",
      contentType: "application/json",
      data: json,
      success: function (json) {
        if (json.msg) {
          $("#msg").show();
        } else {
          $("#msgFail").html(json.errormsg);
          $("#msgFail").show();
        }
      },
      error: function (xhr, status, errorThrown) {
        $("#msgFail").html(xhr.responseText);
        $("#msgFail").show();
      },
    };
    $.ajax(requestConfig);
  });
});
