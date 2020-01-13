var tpj = jQuery;
tpj.noConflict();

function toUnique(a, b, c) { //array,placeholder,placeholder
    b = a.length;
    while (c = --b) while (c--) a[b] !== a[c] || a.splice(c, 1);
    return a;
}

function detectWithOfScreen() {
    var isDesktop = true;
    if (tpj(window).width() <= 991 ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPod/i)) {

        isDesktop = false;
        tpj(".logo-corner-hide").hide();
        tpj(".logo-hide").show();

        // debugger
        // tpj("#header.semi-transparent").removeClass();
        tpj(".current-li").css("background-color", "transparent");
        tpj("#header.semi-transparent").css("background", "#FFF");
        tpj("#primary-menu.sub-title > ul > li > a, #primary-menu.sub-title > div > ul > li > a, #primary-menu.sub-title > ul > li > a span, #primary-menu.sub-title > div > ul > li > a span").css("color", "#000");

    } else {

        isDesktop = true;
        tpj(".logo-hide").hide();
        tpj(".logo-corner-hide").show();

        // debugger
        // tpj("#header.semi-transparent").removeClass();
        tpj(".current-li").css("background-color", "#e74c3c");
        tpj("#header.semi-transparent").css("background", "linear-gradient(0deg, transparent, rgba(45, 52, 54, 1.0))");
        tpj("#primary-menu.sub-title > ul > li > a, #primary-menu.sub-title > div > ul > li > a, #primary-menu.sub-title > ul > li > a span, #primary-menu.sub-title > div > ul > li > a span").css("color", "#FFF");
    }
}

tpj(document).on("scroll", function () {

    if (tpj(document).scrollTop() > 100) {
        tpj("header").addClass("sticky-header");
    } else {
        tpj("header").removeClass("sticky-header");
    }

});

tpj(window).resize(function () {
    var activeRoute = window.location.pathname;
    if (activeRoute.indexOf("project-detail") === -1) {
        detectWithOfScreen();
    }
});

tpj(document).ready(function () {
    var isProductDetail;
    var activeRoute = window.location.pathname;
    if (activeRoute.indexOf("project-detail") !== -1) isProductDetail = true;
    else {
        isProductDetail = false;
        detectWithOfScreen();

        tpj('html, body').css({
            overflow: 'hidden',
            height: '100%'
        });
    }

    tpj(".projectDesc-sort").each(function (i) {
        var len = tpj(this).text().trim().length;
        if (len != undefined) {
            if (len > 250) tpj(this).text(tpj(this).text().substring(0, 250) + '...');
        }
    });
});

tpj("#info, #scrolldown-info").click(function () {
    tpj('html, body').animate({
        scrollTop: tpj("#content-information").offset().top
    }, 2000);
});

tpj("#location").click(function () {
    tpj('html, body').animate({
        scrollTop: tpj("#content-location").offset().top
    }, 2000);
});

tpj("#siteplan").click(function () {
    tpj('html, body').animate({
        scrollTop: tpj("#content-siteplan").offset().top
    }, 2000);
});

tpj("#gallery").click(function () {
    tpj('html, body').animate({
        scrollTop: tpj("#content-gallery").offset().top
    }, 2000);
});

tpj("#unittype").click(function () {
    tpj('html, body').animate({
        scrollTop: tpj("#content-unittype").offset().top
    }, 2000);
});

tpj("#diagramatic").click(function () {
    tpj('html, body').animate({
        scrollTop: tpj("#content-diagramatic").offset().top
    }, 2000);
});

tpj(window).scroll(function () {
    if (tpj(this).scrollTop() >= 50) {        // If page is scrolled more than 50px
        tpj('#return-to-top').fadeIn(200);    // Fade in the arrow
    } else {
        tpj('#return-to-top').fadeOut(200);   // Else fade out the arrow
    }
});
tpj('#return-to-top').click(function () {      // When arrow is clicked
    tpj('body,html').animate({
        scrollTop: 0                       // Scroll to top of body
    }, 500);
});




