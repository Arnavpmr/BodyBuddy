(function ($) {
  $("#imageUpload").on("submit", async (e) => {
    const target = e.currentTarget;
    $.post(`/challenges/submit`, {}, (res) => {
      const text = $("#submit_result");
      if (res.isUploaded) {
        text.css("color", "green");
        text.html("Success!");
      } else {
        text.css("color", "red");
        text.html("Failure!");
      }
    });
  });
})(window.jQuery);
