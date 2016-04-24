console.log("\n\n...\nA wild Datatonic jQuery widget appeared!\n...\n\n");

var notebookView = "fullView";

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
	require(['notebook/js/notebook'], function(ipy) {
		var notebook = ipy.Notebook;

		// A notebook (safe) copy function
		notebook.prototype.safe_copy_notebook = function() {
		  var that = this;
		  var parent = utils.url_path_split(this.notebook_path)[0];
		  if (parent.startsWith('datalab/')) {
			parent = '';
		  }
		  this.contents.copy(this.notebook_path, parent).then(
			function (data) {
			  console.log("Notebook saved");
			},
			function(error) {
			  that.events.trigger('notebook_copy_failed', error);
			}
		  );
		};
	});
	
	
	// Datatonic
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
	
		var dialogContent =
	      	'<p>By exporting this view, all the cell contents that are not shown will be deleted.</p>' +
	      	'<p>A copy of the full notebook is made in the background</p>';
		
		//Provide the opportunity to set a different name?
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

		//saveView(notebook_view, "Test");
	});

	function saveView(notebook_view, view_name) {
		console.log("Initiating Saviour protocol");
		//Need to make deep copy here
		// Remove all html
		if(notebook_view == "code_view") {
			var textCells = document.getElementsByClassName("text_cell");
			for (var idx = textCells.length-1; idx >= 0; idx--) 
			{
				textCells[idx].parentNode.removeChild(textCells[idx]);
		      	}
		}
		if(notebook_view == "text_view") {
		      	var codeCells  = document.getElementsByClassName("code_cell");
			  for (var idx = codeCells.length-1; idx >= 0; idx--) {
				codeCells[idx].parentNode.removeChild(codeCells[idx]);
		      	}
		}
		//ToDo: Save as a different notebook/view

		notebook.save_notebook();
	}
	
	events.on('notebook_loaded.Notebook', function() {
      switchInitialView();
    });
}

function exportCodeViewCallback() {
	    notebook.safe_copy_notebook();
		saveView("code_view", "code_view_export");
}

function exportTextViewCallback() {
	    notebook.safe_copy_notebook();
		saveView("text_view", "text_view_export");
}

function updateNBLinks(nbView) {
  var nbLinks  = document.getElementsByClassName("item_link");
  for (var idx = 0; idx < nbLinks.length; idx++) {
    var newURL = nbLinks[idx].href.split("?")[0];
    nbLinks[idx].href = newURL + "?view=" + nbView;
  }
}

var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    // If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = decodeURIComponent(pair[1]);
    // If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
      query_string[pair[0]] = arr;
    // If third or later entry with this name
    } else {
      query_string[pair[0]].push(decodeURIComponent(pair[1]));
    }
  } 
  return query_string;
}();

function switchInitialView() {
  var initialView = QueryString.view;
  if(initialView !== undefined) {
    switchView(initialView);
  } else {
    switchView("fullView");
  }
}

function switchView(nbView) {
  switch(nbView) {
    case "fullView":
      notebookView = "fullView";
	  notebook_view = "full_view";
	  
	  var styleCode = 'block';
	  var styleInput = 'block';
	  var styleText = 'block';
	  
	  changeView(styleCode, styleInput, styleText);
      break;
    case "textView":
      console.log(nbView);
      notebookView = "textView";
	  notebook_view = "text_view";
	  
	  var styleCode = 'none';
	  var styleInput = 'none';
	  var styleText = 'block';
	  
	  changeView(styleCode, styleInput, styleText);
      break;
    case "textOutputView":
      notebookView = "textOutputView";
	  notebook_view = "text_output_view";
	  
	  var styleCode = 'block';
	  var styleText = 'block';
	  var styleInput = 'none';
	  
	  changeView(styleCode, styleInput, styleText);
      break;
    case "codeView":
      notebookView = "codeView";
	  notebook_view = "dev_view";  
	
      var styleCode = 'block';
	  var styleInput = 'block';
	  var styleText = 'none';
	  
	  changeView(styleCode, styleInput, styleText);
      break;
    default:
      notebookView = "fullView";
	  notebook_view = "full_view";
	  
	  var styleCode = 'block';
	  var styleInput = 'block';
	  var styleText = 'block';
	  
	  changeView(styleCode, styleInput, styleText);
  } 
}

function changeView(styleCode, styleInput, styleText) {
	//Switch views
	document.getElementById("addCodeCellButton").style.display = styleCode;
	document.getElementById("addMarkdownCellButton").style.display = styleText;
	  
	var codeCells  = document.getElementsByClassName("code_cell");
	for (var idx = 0; idx < codeCells.length; idx++) {
		codeCells[idx].style.display = styleCode;
	}
	  
	var codeCells  = document.getElementsByClassName("input");
	for (var idx = 0; idx < codeCells.length; idx++) {
		codeCells[idx].style.display = styleInput;
	}
	  
	var textCells  = document.getElementsByClassName("text_cell");
	for (var idx = 0; idx < textCells.length; idx++) {
		textCells[idx].style.display = styleText;
	} 

    console.log("done");
}