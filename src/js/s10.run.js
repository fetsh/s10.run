var source = [
    { value: 0, text: "не выбран" },
    { value: 1, text: "бегаю" },
    { value: 2, text: "отдых" },
    { value: 3, text: "длительная" },
];

var colors = { 0: "gray", 1: "green", 2: "blue", 3: "green" };

var calendars = $(".row.training.seven-cols");
var prev_calendar = calendars.first();
var prev_calendar_source = prev_calendar.find('.col-sm-1').toArray().map(x => source.find(y => y.text == x.innerText.split("\n")[1]));

var controlsDiv = $("<div class='row training' style='padding: 10px; 30px; text-align: center;'></div>");
var copyLink = $("<a style='cursor: pointer;'>Скопировать</a>");
var saveLink = $("<a style='cursor: pointer;'>Сохранить</a>");
var copyAndSaveLink = $("<a style='cursor: pointer;'>Скопировать неделю и сохранить</a>");

var csl = $("<div style='position: absolute; bottom: 4px; left: 15px; font-size: 20px;' title='Скопировать предыдущую неделю'><a style='cursor: pointer;'>⟱</a></div>")



var typeofdays = $('.typofday');

if (typeofdays.length > 0) {
    doEverything();
} else {
    console.log("Calendar is not available today");
}


function doEverything() {

    var editable_calendar = calendars[1];
    if (editable_calendar === undefined)
        return;

    var new_calendar = $(editable_calendar).clone();
    $(editable_calendar).hide();

    new_calendar.find(".typofday").each(function (index) {
        $(this).removeClass("typofday").addClass("typeofday");
        $("<span class='tdstatus' style='padding: 0px;'></span>").insertBefore($(this));
        $(this).editable({
            showbuttons: false,
            source: [
                { value: 0, text: "не выбран" },
                { value: 1, text: "бегаю" },
                { value: 2, text: "отдых" },
                { value: 3, text: "длительная" },
            ],
            display: function (value, sourceData) {
                var elem = $.grep(sourceData, function (o) { return o.value == value; });
                if (elem.length) {
                    $(this).text(elem[0].text).css("color", colors[value]);
                } else {
                    $(this).empty();
                }
            }
        });
    });


    // copyLink.click(copyValues);
    // saveLink.click(saveValues);
    // copyAndSaveLink.click(function () {
    //     copyValues();
    //     saveValues();
    // });


    csl.click(function () {
        saveValues(copyValues());
    });

    new_calendar.prepend(csl);
    new_calendar.insertAfter(prev_calendar);

    chrome.storage.sync.get('autoUpdate', function (data) {
        if (data.autoUpdate) {
            saveValues(copyValues(false));
        }
    });

    // controlsDiv.append(copyAndSaveLink);
    // controlsDiv.append(" / ");
    // controlsDiv.append(copyLink);
    // controlsDiv.append(" / ");
    // controlsDiv.append(saveLink);
    // controlsDiv.insertAfter(prev_calendar);
};

function copyValues(all = true) {
    var datesToChange = [];
    $('.typeofday').each(function (index, element) {
        if (all == true || $(element).editable('getValue').t == 0) {
            $(element).data('value', prev_calendar_source[index].value);
            $(element).editable('setValue', prev_calendar_source[index].value);
            datesToChange.push($(element));
        }
    });
    return datesToChange;
}

function saveValues(datesToChange = []) {
    $(datesToChange).each(function (index, element) {
        var typofday = $(element);
        var status = typofday.prev("span.tdstatus")
        status.text("⌚");
        status.css('padding-right', '5px');
        var posting = $.post(typofday.data('url'), { name: typofday.data('name'), value: typofday.editable('getValue').t, pk: typofday.data('pk') });
        posting.done(function () {
            status.text("");
            status.css('padding-right', '0px');
            console.log("Saved")
        }).fail(function () {
            status.text("❌");
            status.css('padding-right', '5px');
        })
    });
}