$(".navbar-nav .nav-item").on("click", function () {
    $(".navbar-nav .nav-item").find(".active").removeClass("active");
});

$(".navbar-nav li a").on("click", function () {
    if (!$(this).hasClass("dropdown-toggle")) {
        $(".navbar-collapse").collapse("hide");
    }
});

var arr = null;
var dataSet = [];

var table;

$(document).ready(function () {
    $("#formControlSelect1").focus();

    $.ajax({
        'async': false,
        'global': false,
        'url': "pompeVAC.json",
        'dataType': "json",
        'success': function (data) {
            arr = data;
        }
    });

    console.log(arr.data.length);

    // Populate dropdown
    var dropMenu = document.getElementById("tag");
    for (var i = 0; i < arr.data.length; i++) {
        var opt = arr.data[i][1];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        dropMenu.appendChild(el);
    }

    table = $('#example').DataTable({
        order: [0, 'desc'],
        stateSave: true,
        data: dataSet
    });
});

$("#formControlSelect1").focusout(function () {
    var barcode = $("#formControlSelect1 option:selected").val();
    //console.log(barcode);

    if (barcode == "") {
        $("#formControlSelect1").focus();
        return false;
    }
});

$("#serial").keypress(function (e) {
    if (e.which == 13) {
        e.preventDefault();
        var serialNumber = $("#serial").val();
        console.log(serialNumber.length);
        console.log(arr.data);

        if (serialNumber.length == 27 || serialNumber.length == 9) {
            serialNumber = serialNumber.substr(serialNumber.length - 9)
            $("#serial").val(serialNumber);
        } else {
            return;
        }

        var testIt = serialNumber;
        var i = 0,
            k = 0,
            indx = [],
            msg;
        for (i = 0; i < arr.data.length; i++) {
            for (k = 0; k < arr.data[i].length; k++) {
                if (arr.data[i][k] === testIt) {
                    indx = [i, k];
                    break;
                }
            }
        }
        if (typeof indx[0] == "undefined" || typeof indx[1] == "undefined") {
            msg = ("N/A");
            $("#tag").val(msg);
        } else {
            msg = "i= " + indx[0] + " k= " + indx[1];
            $("#tag").val(arr.data[indx[0]][1]);
        }
        console.log(msg);

        var action = $("#formControlSelect1 option:selected").val();
        console.log(action);
        if (action == "FIN") {
            //$(".btn-valider-intervention").removeAttr("disabled");
            saveData();
        }
    }
});

$("#formControlSelect1").change(function () {
    var barcode = $("#formControlSelect1 option:selected").val();
    //console.log(barcode);

    if (barcode != "") {
        $("#serial").prop("disabled", false);
        $("#tag").prop("disabled", false);
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

$(".btn-valider-intervention").on("click", function () {

});


function saveData() {
    var currentDate = new Date();
    var currentDateString;

    var entryID = (json_obj["pompeVAC"]["historique"].length).toString();

    currentDateString = ('0' + currentDate.getDate()).slice(-2) + '-' +
        ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' +
        currentDate.getFullYear();

    /*    $.ajax({
            'async': false,
            'global': false,
            'url': "log.json",
            'dataType': "json",
            'success': function (data) {
                log = data;
            }
        });
        console.log(log.data);*/

    var intervention = $("#formControlSelect1 option:selected").val();
    var serial = $("#serial").val();
    var tag = $("#tag").val();
    var tracking = $("#tracking").val();
    var note = $("#note").val();

    newData = [entryID, currentDateString, intervention, tag, serial, "CHAUR", tracking, note];
    json_obj["pompeVAC"]["historique"].push(newData);
    console.log(JSON.stringify(json_obj["pompeVAC"]["historique"]));

    // Get a new write batch
    var batch = db.batch();

    // Set the value of 'hemodialyse -> inspection'
    var hemoRef = db.collection("pompeVAC").doc("historique");
    batch.set(hemoRef, {
        data: JSON.stringify(json_obj["pompeVAC"]["historique"])
    });

    // Commit the batch
    batch.commit().then(() => { // Write successful
        $("#error-alert").hide();
        $("#success-alert").show();

        if (document.getElementById("success-alert").classList.contains("d-none")) {
            document.getElementById("success-alert").classList.remove("d-none");
        }

        //$("#" + senderRootID + " :input[type=text]").val("");
        //$("#" + senderRootID + " .btn-valider-inspection").attr("disabled", "disabled");
        //$("#" + senderRootID).find("svg").removeClass('fa-chevron-up').addClass('fa-chevron-down');
        //$("#" + senderRootID).find(".drop_content").addClass("d-none");

        $('body,html').animate({
            scrollTop: 0
        }, 0);

        window.setTimeout(function () {
            $("#success-alert").hide();
            //document.getElementById('success-alert').classList.add('d-none');
        }, 5000);
    })

};

function loadTable() {

    console.log("historique: ", json_obj["pompeVAC"]["historique"]);


    dataSet = json_obj["pompeVAC"]["historique"];
    console.log(dataSet);

    table.clear().rows.add(dataSet).draw().columns('.id').order('desc').draw().columns([0]).visible(false);

    // Toggle the visibility
    //var column = table.column(1);
    //column.visible(!column.visible());
};
