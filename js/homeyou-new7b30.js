$(document).ready(function() {

    nav();

    var $testimonials = $('.testimonials');
    $testimonials.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        adaptiveHeight: true,
        fade: true
    });

    var $testimonialsNav = $('.testimonials-nav li');
    $testimonialsNav.on('click', function() {
        $testimonialsNav.filter('.active').removeClass('active');
        $testimonials.slick('slickGoTo', $(this).addClass('active').index());
    });

});


function nav() {

    if ($(window).width() < 768) {
        return true;
    };

    var $aCollapse = $('[data-toggle="collapse"]'),
            $subnav = $('.subnav'),
            $overlay = $('.overlay');

    $aCollapse.on('click', function (e) {
        e.preventDefault();

        if ($(this).hasClass('collapsed')) {
            $(this).addClass('active');
            $overlay.removeClass('visibility');
        } else {
            $aCollapse.removeClass('active');
            $overlay.addClass('visibility');
        }
    });

    $('.navbar-right [data-toggle="collapse"]').parent()
        .on('mouseenter', function() {
            var $btn = $(this).find('[data-toggle="collapse"]');

            $btn.addClass('active');
            $subnav.filter($btn.attr('data-target')).collapse('show');
            $overlay.removeClass('visibility');
        })
        .on('mouseleave', function() {
            var $btn = $(this).find('[data-toggle="collapse"]');

            $aCollapse.removeClass('active');
            $subnav.filter($btn.attr('data-target')).collapse('hide');
            $overlay.addClass('visibility');
        });

    $subnav.on('show.bs.collapse', function () {
        $subnav.not(this).collapse('hide');
    });

    $overlay.on('click', function() {
        $aCollapse.removeClass('active');
        $('.collapse').collapse('hide');
    });

}