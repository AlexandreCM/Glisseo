$(document).ready(function () {
    "use strict";
    $("#file").on("change", function (e) {
        var files = $(this)[0].files;
        if (files.length == 0) {
            $(".file_label").text("Choisir un fichier");
        } else if (files.length >= 2) {
            $(".file_label").text(files.length + " Fichiers sélectionnés");
        } else {
            var fileName = e.target.value.split("\\").pop();
            $(".file_label").text(fileName);
        }
    });
});