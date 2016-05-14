function initializeStyle() {
    var settings = { }

    // Datatonic settings
    settings.headerBackgroundColor = '#fff';
    settings.headerColor = '#6d7078';
    settings.headerFont = "400 17px 'Source Sans Pro', 'Helvetica Neue', Helvetica, Arial, sans-serif";
    settings.headerCompanyName = 'Datatonic';
    settings.headerCompanyLink = 'http://www.datatonic.com';
    settings.headerCompanyLogo = 'http://datatonic.com/wp-content/themes/datatonic/img/logo.png';
    settings.headerCompanyLogoAlt = 'datatonic';
    settings.headerCompanyLogoWidth = 168;
    settings.headerCompanyLogoHeight = 31;

    // Header customization
    $("#appBar")[0].style = "font: " + settings.headerFont + "; " +
                            "background-color: " + settings.headerBackgroundColor + "; " +
                            "color: " + settings.headerColor + "; ";

    $("#logo-link")[0].href = settings.headerCompanyLink;

    $("#logo-img")[0].src = settings.headerCompanyLogo;
    $("#logo-img")[0].alt = settings.headerCompanyLogoAlt;
    $("#logo-img")[0].height = settings.headerCompanyLogoHeight;
    $("#logo-img")[0].width = settings.headerCompanyLogoWidth;

    // Footer customization
    $("#footer")[0].style = "font: " + settings.headerFont + "; " +
                            "background-color: " + settings.headerBackgroundColor + "; " +
                            "color: " + settings.headerColor + "; ";

    $("#logo-link-footer")[0].src = settings.headerCompanyLink;
    $("#logo-link-footer")[0].innerHTML = settings.headerCompanyName;
}
