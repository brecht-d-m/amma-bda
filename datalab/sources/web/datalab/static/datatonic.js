console.log("\n\n...\nA wild Datatonic jQuery widget appeared!\n...\n\n");

var notebookView = "fullView";

function initializeDatatonic(ipy, events, dialog, utils, security) {
  // Datatonic
  var notebook_view = "full";
  
  $('#devView').click(function() {
	  notebookView = "devView";
	  notebook_view = "dev_view";
	  
	  var styleCode = 'block';
	  var styleInput = 'block';
	  var styleText = 'none';
	  
	  changeView(styleCode, styleInput, styleText);
  });

  $('#fullView').click(function() {
	  notebookView = "fullView";
	  notebook_view = "full_view";
	  
	  var styleCode = 'block';
	  var styleInput = 'block';
	  var styleText = 'block';
	  
	  changeView(styleCode, styleInput, styleText);
  });

  $('#textView').click(function() {
	  notebookView = "textView";
	  notebook_view = "text_view";
	  
	  var styleCode = 'none';
	  var styleInput = 'none';
	  var styleText = 'block';
	  
	  changeView(styleCode, styleInput, styleText);
  });

  $('#textOutputView').click(function() {
	  notebookView = "textOutputView";
	  notebook_view = "text_output_view";
	  
	  var styleCode = 'block';
	  var styleText = 'block';
	  var styleInput = 'none';
	  
	  changeView(styleCode, styleInput, styleText);
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
	
  function changeView(styleCode, styleInput, styleText) {
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
  }
}

require(['base/js/namespace', 'base/js/events', 'base/js/dialog', 'base/js/utils', 'base/js/security'],
        initializeDatatonic);
