{%- extends 'full.tpl' -%}

{% block html_head %}
{{ super() }}

<link rel="stylesheet" href="http://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js"></script>

<link rel="stylesheet" type="text/css" href="https://rawgit.com/jfbercher/small_nbextensions/master/usability/toc2/main.css">

<script src="https://rawgit.com/jfbercher/small_nbextensions/master/usability/toc2/toc2.js"></script>

<script>
$( document ).ready(function(){
            var cfg={'threshold':6,     // depth of toc (number of levels)
             'number_sections':true,    // sections numbering
             'toc_cell':false,          // useless here
             'toc_window_display':true, // display the toc window
             "toc_section_display": "block", // display toc contents in the window
             'sideBar':true,             // sidebar or floating window
             'navigate_menu':false       // navigation menu (only in liveNotebook -- do not change)
            }
            var st={};                  // some variables used in the script
            st.rendering_toc_cell = false;
            st.config_loaded = false;
            st.extension_initialized=false;
            st.nbcontainer_marginleft = $('#notebook-container').css('margin-left')
            st.nbcontainer_marginright = $('#notebook-container').css('margin-right')
            st.nbcontainer_width = $('#notebook-container').css('width')
            st.oldTocHeight = undefined
            st.cell_toc = undefined;
            st.toc_index=0;
            // fire the main function with these parameters
            table_of_contents(cfg,st);
    });
</script>

<script type="text/javascript" charset="utf-8" async="" data-requirecontext="_" data-requiremodule="extensions/charting">
{% include "charting.js" %}
</script>
<script type="text/javascript" charset="utf-8" async="" data-requirecontext="_" data-requiremodule="element">
{% include "element.js" %}
</script>
<script type="text/javascript" charset="utf-8" async="" data-requirecontext="_" data-requiremodule="style">
{% include "style.js" %}
</script>
<script type="text/javascript" charset="utf-8" async="" data-requirecontext="_" data-requiremodule="visualization">
{% include "visualization.js" %}
document._in_nbconverted = true;
</script>

<style type="text/css">
{% include "custom.css" %}
{% include "charting.css" %}
{% include "datalab.css" %}
</style>

{% endblock html_head %}
