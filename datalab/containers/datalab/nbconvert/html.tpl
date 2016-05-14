{%- extends 'basic.tpl' -%}
{% from 'mathjax.tpl' import mathjax %}

{%- block header -%}
<!DOCTYPE html>
<html>
<head>
{%- block html_head -%}
<meta charset="utf-8" />
<title>{{resources['metadata']['name']}}</title>

<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.10/require.min.js"></script>

{% for css in resources.inlining.css -%}
    <style type="text/css">
    {{ css }}
    </style>
{% endfor %}

<style type="text/css">
/* Overrides of notebook CSS for static HTML export */
body {
  overflow: visible;
  /*padding: 8px;*/
}

div#notebook {
  overflow: visible;
  border-top: none;
}

@media print {
  div.cell {
    display: block;
    page-break-inside: avoid;
  }
  div.output_wrapper {
    display: block;
    page-break-inside: avoid;
  }
  div.output {
    display: block;
    page-break-inside: avoid;
  }
}
</style>

<!-- Custom stylesheet, it must be in the same directory as the html file -->
<link rel="stylesheet" href="custom.css">

<!-- Loading mathjax macro -->
{{ mathjax() }}

<!-- CSS files -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/require.js/2.1.10/require.min.js"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.css">

<!-- Javascript files -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.3/jquery.min.js" type="text/javascript"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/js/bootstrap.min.js"></script>

<!-- Table of contents -->
<link rel="stylesheet" href="http://tscanlin.github.io/tocbot/assets/css/tocbot.css">
<script src="http://tscanlin.github.io/tocbot/assets/js/tocbot.js"></script>

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



<style>
    .cell-title {
        font-size: 18px;
    }
    /* Icon when the collapsible content is shown */
    .cell-title:before {
        font-family: "Glyphicons Halflings";
        font-size: 14px;
        content: "\e114";
    }

    /* Icon when the collapsible content is hidden */
    .cell-title.collapsed:before {
        content: "\e080";
    }

    .sidebar-nav-fixed {
        width:20%;
    }
</style>

<script src="https://gist.githubusercontent.com/brecht-d-m/22f65a38f18a5dd568c14ce976bc87a7/raw/385233fc2c09d2a49a9d7f1ff82ffff6d51e2020/datatonic.js"></script>


{%- endblock html_head -%}
</head>
{%- endblock header -%}

{% block body %}
<body>
<div id="app">
    <div id="appBar" style="background-color: #fff; color: #6d7078; font: 400 17px 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif">
        <span id="logo" class="nav navbar-brand pull-left">
            <a id="logo" href="http://www.datatonic.com" target="_blank">
                <img src="http://datatonic.com/wp-content/themes/datatonic/img/logo.png" alt="<%headerCompanyLogoAlt>" height="31" width="undefined">
            </a>
        </span>
    </div>
    <div id="appContent">
        <div class="container">
            <div class="row">
                <div class="col-sm-2" style="font-size: 18px">
                <div class="sidebar-nav-fixed affix">
                    <br><br>
                    <nav id="toc" class="toc js-toc soft-double transition--300 position--absolute"></nav>
                </div>
                </div>
                <div class="col-sm-10">
                    <div tabindex="-1" id="notebook" class="border-box-sizing">
                        <div class="container" id="notebook-container">
                            {{ super() }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<div id="footer" style="background-color: #fff; color: #6d7078; font: 400 17px 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif">
    <p class="text-muted">Made with ♥ for <a href="http://www.datatonic.com" target="_blank">Datatonic</a></p>
</div>

</body>
{%- endblock body %}

{% block footer %}
</html>
{% endblock footer %}
