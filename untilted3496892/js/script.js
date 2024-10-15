$(document).ready(function () {
    // Fetch navigation data from JSON
    $.getJSON('navigation.json', function (data) {
        var navMenu = $('#navMenu');
        var navItems = data.navigation;
        $.each(navItems, function (index, item) {
            var listItem = $('<li><a href="' + item.url + '">' + item.name + '</a></li>');
            navMenu.append(listItem);
        });
    });
});
