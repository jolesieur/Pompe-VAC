$(".navbar-nav .nav-item").on("click", function () {
    $(".navbar-nav .nav-item").find(".active").removeClass("active");
});

$(".navbar-nav li a").on("click", function () {
    if (!$(this).hasClass("dropdown-toggle")) {
        $(".navbar-collapse").collapse("hide");
    }
});

$(document).ready(function () {
    $("#formControlSelect1").focus();
});

$("#formControlSelect1").focusout(function () {
    var barcode = $("#formControlSelect1 option:selected").val();
    //console.log(barcode);

    if (barcode == "") {
        $("#formControlSelect1").focus();
        return false;
    }
});

$("#formControlSelect1").change(function () {
    var barcode = $("#formControlSelect1 option:selected").val();
    //console.log(barcode);

    if (barcode != "") {
        $("#serial").prop("disabled", false);
    }
});


$('a[href="#content-2"]').on("shown.bs.tab", function (e) {
    $("#formControlSelect1").focus();
})

$(".drop").click(function () {
    if ($(this).closest("form").find(".drop_content").hasClass("d-none")) {
        $(this).parents(".root").find(".drop_content").addClass("d-none");
        $(this).parents(".root").find(".drop svg").removeClass('fa-chevron-up').addClass('fa-chevron-down');
        $(this).closest("form").find(".drop_content").removeClass("d-none");
        $(this).find("svg").removeClass('fa-chevron-down').addClass('fa-chevron-up');
    } else {
        $(this).closest("form").find(".drop_content").addClass("d-none");
        $(this).find("svg").removeClass('fa-chevron-up').addClass('fa-chevron-down');
    }
    $(this).parents(".root").find(".charbon-dt").addClass("d-none");

    $('body,html').animate({
        scrollTop: 0
    }, 0);
});

Date.prototype.toDateInputValue = (function () {
    var local = new Date(this);
    local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
    return local.toJSON().slice(0, 10);
});


$("input[type=checkbox]").change(function () {
    var senderRootID = $(this).parents(".root").attr("id");
    var senderFormID = $(this).closest("form").attr("id");

    var checked = $("#" + senderFormID + " input:checked").length > 0;
    if (checked) {
        $("#" + senderRootID + " .btn-success").removeAttr("disabled");
    } else {
        $("#" + senderRootID + " .btn-success").attr("disabled", "disabled");
    }
});

// Set active sub-tab name to dropmenu text.
$(".sub-tab a").on("click", function () {
    $(this).closest("li").find("span").text($(this).text());
});

$(function () {
    $(document).on("click", ".alert-close", function () {
        $(this).parent().hide();
    })
});

$(".btn-valider").on("click", function () {

});
