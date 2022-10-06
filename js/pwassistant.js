$(".navbar-nav .nav-item").on("click", function () {
    $(".navbar-nav .nav-item").find(".active").removeClass("active");
});

$(".navbar-nav li a").on("click", function () {
    if (!$(this).hasClass("dropdown-toggle")) {
        $(".navbar-collapse").collapse("hide");
    }
});

var dataSet = [];
var arr = null;
var table;

$(document).ready(function () {
    $("#formControlSelect1").focus();

    table = $('#example').DataTable({
        order: [0, 'desc'],
        stateSave: true,
        data: dataSet
    });

    $(this).one('keydown', function (e) {
        if (e.keyCode == 17) {
            $(".btn-delete").removeAttr("disabled");
        }
    });


    $('#addPumpform input').keyup(function () {
        var empty = false;
        $('#addPumpform input').each(function () {
            if ($(this).val().length == 0) {
                empty = true;
            }
        });

        if (empty) {
            $('.btn-valider-addPump').attr('disabled', 'disabled');
        } else {
            $('.btn-valider-addPump').removeAttr('disabled');
        }
    });
});

$('#newTag, #newSerial').keyup(function () {
    $(this).val($(this).val().toUpperCase());
});

$('body').on('keyup', function (e) {
    if (e.keyCode == 17) {
        //do something
        $(".btn-delete").attr("disabled", "disabled");
    }
    // after first keyup set to handle next keydown only once:
    $(this).one('keydown', function (e) {
        if (e.keyCode == 17) {
            $(".btn-delete").removeAttr("disabled");
        }
    });
});

$(function () {
    var list = [
               "CHAUR",
               "Shawinigan",
               "Maskinongé",
               "BNY",
                "Prêt d'équipements"
            ];
    $("#newLocalisation").autocomplete({
        source: list
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
        console.log(arr);


        if (serialNumber.length == 27 || serialNumber.length == 9) {
            serialNumber = serialNumber.substr(serialNumber.length - 9);

            if (/^[A-Z]+$/.test(serialNumber.substring(0, 4))) {
                $("#serial").val(serialNumber);
            } else {
                $("#serial").val("");
                return;
            }
        } else {
            $("#serial").val("");
            return;
        }

        var testIt = serialNumber;
        var i = 0,
            k = 0,
            indx = [],
            msg;
        for (i = 0; i < arr.length; i++) {
            for (k = 0; k < arr[i].length; k++) {
                if (arr[i][k] === testIt) {
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
            $("#tag").val(arr[indx[0]][1]);
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

$("#tag").change(function () {
    var tagName = $("#tag option:selected").val();

    if (tagName != "") {
        var testIt = tagName;
        var i = 0,
            k = 0,
            indx = [],
            msg;
        for (i = 0; i < arr.length; i++) {
            for (k = 0; k < arr[i].length; k++) {
                if (arr[i][k] === testIt) {
                    indx = [i, k];
                    break;
                }
            }
        }
        if (typeof indx[0] == "undefined" || typeof indx[1] == "undefined") {
            msg = ("");
            $("#serial").val(msg);
        } else {
            msg = "i= " + indx[0] + " k= " + indx[1];
            $("#serial").val(arr[indx[0]][2]);
            $(".btn-valider-intervention").removeAttr("disabled");
        }
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
    saveData();
});

$(".btn-valider-addPump").on("click", function () {
    var localisation = $("#newLocalisation").val();
    var tag = $("#newTag").val();
    var serial = $("#newSerial").val();

    newData = [localisation, tag, serial];
    json_obj["pompeVAC"]["inventaire"].push(newData);

    // Get a new write batch
    var batch = db.batch();

    // Set the value of 'hemodialyse -> inspection'
    var hemoRef = db.collection("pompeVAC").doc("inventaire");
    batch.set(hemoRef, {
        data: JSON.stringify(json_obj["pompeVAC"]["inventaire"])
    });

    // Commit the batch
    batch.commit().then(() => { // Write successful
        $("#error-alert").hide();
        $("#success-alert").show();

        if (document.getElementById("success-alert").classList.contains("d-none")) {
            document.getElementById("success-alert").classList.remove("d-none");
        }

        $(':input', '#addPumpform')
            .not(':button, :submit, :reset, :hidden')
            .val('')

        $(".btn-valider-addPump").attr("disabled", "disabled");

        $('body,html').animate({
            scrollTop: 0
        }, 0);

        window.setTimeout(function () {
            $("#success-alert").hide();
            //document.getElementById('success-alert').classList.add('d-none');
        }, 5000);
    })
});

function saveData() {
    var currentDate = new Date();
    var currentDateString;

    var entryID = (json_obj["pompeVAC"]["historique"].length).toString();

    currentDateString = ('0' + currentDate.getDate()).slice(-2) + '-' +
        ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' +
        currentDate.getFullYear();

    var intervention = $("#formControlSelect1 option:selected").text().substring(3);
    var serial = $("#serial").val();
    var tag = $("#tag").val();
    var tracking = $("#tracking").val();
    var note = $("#note").val();

    newData = [entryID, currentDateString, intervention, tag, serial, "CHAUR", tracking, note];
    json_obj["pompeVAC"]["historique"].push(newData);
    //console.log(JSON.stringify(json_obj["pompeVAC"]["historique"]));

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

        $(':input', '#inputform')
            .not(':button, :submit, :reset, :hidden')
            .val('')
            .prop('checked', false)
            .prop("disabled", true);

        $('#formControlSelect1')
            .prop('selected', false)
            .prop("disabled", false);

        $(".btn-valider-intervention").attr("disabled", "disabled");

        $("#formControlSelect1").focus();

        $('body,html').animate({
            scrollTop: 0
        }, 0);

        window.setTimeout(function () {
            $("#success-alert").hide();
            //document.getElementById('success-alert').classList.add('d-none');
        }, 5000);
    })

};

function populateDropdown() {
    arr = json_obj["pompeVAC"]["inventaire"];
    // Populate dropdown
    var dropMenu = document.getElementById("tag");
    for (var i = 0; i < arr.length; i++) {
        var opt = arr[i][1];
        var el = document.createElement("option");
        el.textContent = opt;
        el.value = opt;
        dropMenu.appendChild(el);
    }
};

function loadTable() {

    //console.log("historique: ", json_obj["pompeVAC"]["historique"]);


    dataSet = json_obj["pompeVAC"]["historique"];
    //console.log(dataSet);

    table.clear().rows.add(dataSet).draw().columns('.id').order('desc').draw().columns([0]).visible(false);

    // Toggle the visibility
    //var column = table.column(1);
    //column.visible(!column.visible());
};
