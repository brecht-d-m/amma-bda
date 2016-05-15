var dataStructures = {
    stack : function() {
        var elements;

        this.push = function(element) {
            if (typeof(elements) === 'undefined') {
                elements = [];
            }
            elements.push(element);
        }

        this.pop = function() {
            return elements.pop();
        }

        this.stackTop = function(element) {
            return elements[elements.length - 1];
        }

        this.size = function() {
            if (typeof(elements) === 'undefined') {
                return 0;
            } else {
                return elements.length;
            }
        }
    }
}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function get_cell_level(cell) {
    if($('h1', cell).length >= 1) {
        level = 1;
    } else if($('h2', cell).length >= 1) {
        level = 2;
    } else if($('h3', cell).length >= 1) {
        level = 3;
    } else if($('h4', cell).length >= 1) {
        level = 4;
    } else if($('h5', cell).length >= 1) {
        level = 5;
    } else if($('h6', cell).length >= 1) {
        level = 6;
    } else {
        level = 0; // just text
    }

    return level;
}

function is_header(cell) {
    var header_elements = ["h1", "h2", "h3", "h4", "h5", "h6"];
    for(var i=0; i < header_elements.length; i++) {
        if($(header_elements[i], cell).length == 1) {
            return true;
        }
    }

    return false;
}

var text_to_replace_top = '<div class="cell border-box-sizing text_cell rendered">\n' +
                           '<div class="prompt input_prompt">\n</div>\n' +
                           '<div class="inner_cell">\n' +
                            '<div class="text_cell_render border-box-sizing rendered_html">\n';

var text_to_replace_bottom = '</div>\n</div>\n</div>';

var panel_header = '<div class="panel-group">' +
                    '<div class="panel panel-default">' +
                     '<div class="panel-heading">';

function create_panel(closing_divs, current_cell) {
    parsed_text = "";
    var uuid = guid();
    var current_cell_level = get_cell_level(current_cell);

    // Replace text from top and bottom
    parsed_text = current_cell.outerHTML
                    .replace(text_to_replace_top, "")
                    .replace(text_to_replace_bottom, "");

    // Get title
    regexpat = /<h[0-9] id=\"[^\"]*\">(.*)<a class=\"anchor-link\"/;
    cell_title = regexpat.exec(parsed_text)[1];

    // Create panel
    parsed_text = closing_divs + panel_header +
                   "<h" + current_cell_level + " id='" + guid() + "'>" +
                   "<a data-toggle='collapse' href='#" + uuid + "' class='cell-title'>  " + cell_title + "</a>" +
                   "</h" + current_cell_level + ">" +
                   "</div><div id='" + uuid + "' class='panel-collapse collapse in'> <div class='panel-body'>";

    return parsed_text;
}

window.onload = function() {
    var cells = $(".cell");
    var cell_stack = new dataStructures.stack();

    if(cells.length > 0) {
        var notebook_container_text = ""

        for(var i=0; i < cells.length; i++) {
            var current_cell = cells[i];
            var current_cell_inner_cell_length = current_cell.innerHTML.split(/\n/).length;
            var current_cell_is_text_cell = current_cell.classList.contains("text_cell");
            var current_cell_is_header_cell = is_header(current_cell);

            if(current_cell_inner_cell_length == 9 &&
                current_cell_is_text_cell &&
                current_cell_is_header_cell) {

                var parsed_text = "";

                if(cell_stack.size() > 0) {
                    var current_cell_level = get_cell_level(current_cell);
                    var previous_cell_level = cell_stack.stackTop();

                    if(current_cell_level > previous_cell_level) {
                        parsed_text = create_panel("", current_cell);
                        cell_stack.push(current_cell_level);
                    } else if(current_cell_level == previous_cell_level) {
                        parsed_text = create_panel("</div></div></div></div>", current_cell);
                        cell_stack.pop();
                        cell_stack.push(current_cell_level);
                    } else {
                        closing_divs = "";

                        while(true) {
                            previous_cell_level = cell_stack.stackTop();

                            closing_divs += "</div></div></div></div>";
                            cell_stack.pop()

                            if(current_cell_level >= previous_cell_level) {
                                break;
                            }
                        }

                        parsed_text = create_panel(closing_divs, current_cell);
                        cell_stack.push(current_cell_level);
                    }
                } else {
                    parsed_text = create_panel("", current_cell);
                    cell_stack.push(get_cell_level(current_cell));
                }

                notebook_container_text += parsed_text;
            } else {
                notebook_container_text += current_cell.outerHTML;
            }
        }

        var closing_tags = ""
        for(var i=-1; i < cell_stack.size(); i++) {
            closing_tags += "</div></div></div></div>";
        }

        document.getElementById("notebook-container").innerHTML = notebook_container_text;
    }

    tocbot.init({
        // Where to render the table of contents.
        tocSelector: '#toc',
        // Where to grab the headings to build the table of contents.
        contentSelector: '#notebook-container',
        // Which headings to grab inside of the contentSelector element.
        headingSelector: 'h1, h2',
    });

    initializeStyle();
}
