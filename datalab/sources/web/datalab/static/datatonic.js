console.log("\n\n...\nA wild Datatonic jQuery widget appeared!\n...\n\n");

var QueryString = function() {
    // This function is anonymous, is executed immediately and
    // the return value is assigned to QueryString!
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
            query_string[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
            var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
            query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
            query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
    }
    return query_string;
}();

function initializeDatatonicTree(ipy, notebookList, newNotebook, events, dialog, utils) {
    $('#choseFullView').click(function() {
        document.getElementById("viewChoser").textContent = "Chose view (full view)"
        updateNBLinks("fullView");
    });

    $('#choseTextView').click(function() {
        document.getElementById("viewChoser").textContent = "Chose view (text view)"
        updateNBLinks("textView");
    });

    $('#choseTextOutputView').click(function() {
        document.getElementById("viewChoser").textContent = "Chose view (text output view)"
        updateNBLinks("textOutputView");
    });

    $('#choseCodeView').click(function() {
        document.getElementById("viewChoser").textContent = "Chose view (code view)"
        updateNBLinks("codeView");
    });

    updateNBLinks("fullView");
}

function initializeDatatonicNB(ipy, notebook, events, dialog, utils) {

    $('head').append('<link rel="stylesheet" href="/static/components/jquery-ui/themes/smoothness/jquery-ui.min.css" type="text/css" />');
    require(['notebook/js/notebook'], function(ipy) {
        var notebook = ipy.Notebook;

        notebook.prototype.switch_notebook = function(exportName, exportType) {
            var exportView = "True";

            var that = this;
            var base_url = this.base_url;
            var parent = utils.url_path_split(this.notebook_path)[0];
            if (parent.startsWith('datalab/')) {
                parent = '';
            }
            this.contents.copy(this.notebook_path, parent).then(
                function(data) {
                    var newLocation = utils.url_join_encode(base_url, 'notebooks', data.path);
                    newLocation += "?" +
                        "exportView=" + exportView + "&" +
                        "exportName=" + exportName + "&" +
                        "exportType=" + exportType;
                    var w = window.open(newLocation, "_self");
                },
                function(error) {
                    that.events.trigger('notebook_copy_failed', error);
                }
            );
        };
    });

    var notebook_view = "full";

    $('#devView').click(function() {
        switchView("codeView");
    });

    $('#fullView').click(function() {
        switchView("fullView");
    });

    $('#textView').click(function() {
        switchView("textView");
    });

    $('#textOutputView').click(function() {
        switchView("textOutputView");
    });

    $('#exportView').click(function() {
        console.log("Incoming cataclysm, to the shelters!");

        notebook.keyboard_manager.enabled = false;
        var dialogContent =
            '<p>By exporting this view, some of the cell contents will be deleted.</p>' +
            '<p>The original notebook will be saved</p><br></br>' +
            '<div class="form-group">' +
            '<label for="exportName" style="font-weight:bold;">Export name:</label>' +
            '<input type="text" class="form-control" id="exportName" placeholder="Export name">' +
            '</div>';

        var dialogOptions = {
            title: 'Exporting view',
            body: $(dialogContent),
            buttons: {
                'Code view': {
                    click: exportCodeViewCallback
                },
                'Text view': {
                    click: exportTextViewCallback
                }
            }
        };
        dialog.modal(dialogOptions);
    });

    $('#navigateTree').click(function() {
        var url = document.location.href.replace(/\/notebooks\/.*/, '/tree');
        window.open(url);
    });

    function exportCodeViewCallback() {
        exportNotebook(document.getElementById('exportName').value, "codeView");
    }

    function exportTextViewCallback() {
        exportNotebook(document.getElementById('exportName').value, "textView");
    }

    function exportNotebook(notebookName, notebookType) {
        console.log("Initiating Saviour protocol");
        notebook.keyboard_manager.enabled = true;
        notebook.save_notebook();
        notebook.switch_notebook(notebookName, notebookType);
    }

    events.on('notebook_loaded.Notebook', function() {
        var exportNotebook = QueryString.exportView;
        if (exportNotebook == undefined) {
            switchInitialView();
        } else {
            var exportType = QueryString.exportType;
            var exportName = QueryString.exportName;
            if (exportType != undefined && exportName != undefined) {
                notebook.rename(exportName);

                if (exportType == "codeView") {
                    var textCells = document.getElementsByClassName("text_cell");
                    for (var idx = textCells.length - 1; idx >= 0; idx--) {
                        textCells[idx].parentNode.removeChild(textCells[idx]);
                    }
                }
                if (exportType == "textView") {
                    var codeCells = document.getElementsByClassName("code_cell");
                    for (var idx = codeCells.length - 1; idx >= 0; idx--) {
                        codeCells[idx].parentNode.removeChild(codeCells[idx]);
                    }
                }

                notebook.save_notebook();
            }
        }
    });
}

function updateNBLinks(nbView) {
    var nbLinks = document.getElementsByClassName("item_link");
    for (var idx = 0; idx < nbLinks.length; idx++) {
        var newURL = nbLinks[idx].href.split("?")[0];
        nbLinks[idx].href = newURL + "?view=" + nbView;
    }
}

function switchInitialView() {
    var initialView = QueryString.view;
    if (initialView !== undefined) {
        switchView(initialView);
    } else {
        switchView("fullView");
    }
}

function switchView(nbView) {
    switch (nbView) {
        case "fullView":
            var styleCode = 'block';
            var styleInput = 'block';
            var styleText = 'block';

            changeView(styleCode, styleInput, styleText);
            break;
        case "textView":
            var styleCode = 'none';
            var styleInput = 'none';
            var styleText = 'block';

            changeView(styleCode, styleInput, styleText);
            break;
        case "textOutputView":
            var styleCode = 'block';
            var styleText = 'block';
            var styleInput = 'none';

            changeView(styleCode, styleInput, styleText);
            break;
        case "codeView":
            var styleCode = 'block';
            var styleInput = 'block';
            var styleText = 'none';

            changeView(styleCode, styleInput, styleText);
            break;
        default:
            var styleCode = 'block';
            var styleInput = 'block';
            var styleText = 'block';

            changeView(styleCode, styleInput, styleText);
    }
}

function changeView(styleCode, styleInput, styleText) {
    document.getElementById("addCodeCellButton").style.display = styleCode;
    document.getElementById("addMarkdownCellButton").style.display = styleText;

    var codeCells = document.getElementsByClassName("code_cell");
    for (var idx = 0; idx < codeCells.length; idx++) {
        codeCells[idx].style.display = styleCode;
    }

    var codeCells = document.getElementsByClassName("input");
    for (var idx = 0; idx < codeCells.length; idx++) {
        codeCells[idx].style.display = styleInput;
    }

    var codeCells = document.getElementsByClassName("output_wrapper");
    for (var idx = 0; idx < codeCells.length; idx++) {
        codeCells[idx].style.display = styleCode;
    }

    var codeCells = document.getElementsByClassName("widget-area");
    for (var idx = 0; idx < codeCells.length; idx++) {
        codeCells[idx].style.display = styleCode;
    }

    var textCells = document.getElementsByClassName("text_cell");
    for (var idx = 0; idx < textCells.length; idx++) {
        textCells[idx].style.display = styleText;
    }
}
