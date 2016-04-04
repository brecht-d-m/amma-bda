console.log("A wild Datatonic javascript file appeared!");

var notebookView = "fullView";

function initializeDatatonic(ipy, events, dialog, utils, security) {
  console.log("Should we catch it?");
	
  // Datatonic
  var notebook_view = "full";
  
  $('#devView').click(function() {
	  console.log("You found the hidden treasure!");
	notebookView = "devView";
    console.log(notebookView);
	
	var styleCode = 'block';
	var styleText = 'none';
	  
	document.getElementById("addCodeCellButton").style.display = styleCode;
	document.getElementById("addMarkdownCellButton").style.display = styleText;
	  
	var codeCells  = document.getElementsByClassName("code_cell");
	for (var idx = 0; idx < codeCells.length; idx++) {
		codeCells[idx].style.display = styleCode;
	}
	  
	var textCells  = document.getElementsByClassName("text_cell");
	for (var idx = 0; idx < textCells.length; idx++) {
		textCells[idx].style.display = styleText;
	}  
	  
	notebook_view = "dev_view";
  });

  $('#fullView').click(function() {
	  console.log("...Dag vrienden van de Analyse!");
	notebookView = "fullView";
    console.log(notebookView); 
	  
	var styleCode = 'block';
	var styleText = 'block';
	  
	document.getElementById("addCodeCellButton").style.display = styleCode;
	document.getElementById("addMarkdownCellButton").style.display = styleText;
	  
	var codeCells  = document.getElementsByClassName("code_cell");
	for (var idx = 0; idx < codeCells.length; idx++) {
		codeCells[idx].style.display = styleCode;
	}
	  
	var textCells  = document.getElementsByClassName("text_cell");
	for (var idx = 0; idx < textCells.length; idx++) {
		textCells[idx].style.display = styleText;
	} 
	  
	notebook_view = "full_view";
  });

  $('#textView').click(function() {
	  
	 console.log("Jet Fuel Can't Melt Steel Beams"); 
	  
	notebookView = "textView";
    console.log(notebookView);
	  
	var styleCode = 'none';
	var styleText = 'block';
	  
	document.getElementById("addCodeCellButton").style.display = styleCode;
	document.getElementById("addMarkdownCellButton").style.display = styleText;
	  
	var codeCells  = document.getElementsByClassName("code_cell");
	for (var idx = 0; idx < codeCells.length; idx++) {
		codeCells[idx].style.display = styleCode;
	}
	  
	var textCells  = document.getElementsByClassName("text_cell");
	for (var idx = 0; idx < textCells.length; idx++) {
		textCells[idx].style.display = styleText;
	} 
	  
	notebook_view = "text_view";
  });
	
  $('#exportView').click(function() {  
	console.log("meh");  
	
	var dialogContent =
      '<p>By exporting this view, all the cell contents that are not shown will be deleted.</p>' +
      '<p>We strongly advise to make a copy of your notebook first!</p>';

    var dialogOptions = {
      title: 'Exporting view',
      body: $(dialogContent),
      buttons: { 'OK': {} }
    };
    dialog.modal(dialogOptions);

	// Remove all html
	if(notebook_view == "dev_view") {
	  var textCells = document.getElementsByClassName("text_cell");
	  for (var idx = textCells.length-1; idx >= 0; idx--) {
        textCells[idx].parentNode.removeChild(textCells[idx]);
      }
    }
	if(notebook_view == "text_view") {
      var codeCells  = document.getElementsByClassName("code_cell");
	  for (var idx = codeCells.length-1; idx >= 0; idx--) {
        codeCells[idx].parentNode.removeChild(codeCells[idx]);
      }
	}  
	  
	// Remove from notebook object
	// Not needed  
	  
	// Save notebook
	notebook.save_notebook();
  });
}

require(['base/js/namespace', 'base/js/events', 'base/js/dialog', 'base/js/utils', 'base/js/security'],
        initializeDatatonic);