$(function() {
    if ($.fn.chosen !== undefined) {
        $(".js-form").chosen({
            no_results_text: "No matches found",
            max_selected_options: 1
        }).change(function() {
            if ($(this).val() === null) {
                $('.search-field input').attr('disabled', false);
            } else {
                $('.search-field input').attr('disabled', true);
            }
        });
    };

    $(".form-control-phone").mask("999-999-9999", { autoclear: false });
    $(".form-control-date").mask("99/99");

    $('.form-control-only-numbers').onlyNumbers();
    $('input, textarea').placeholder();

    $(".form-control").on("keydown", function(event) {
        if (event.keyCode !== 8) {
            var maxlength = $(this).attr('maxlength');

            if (typeof maxlength !== "undefined") {
                if (this.value.length > maxlength) {
                    $(this).val($(this).val().substr(0, maxlength));

                    return false;
                }
            }
        }
    });

    setBarPosition();

});

$(window).scroll(function() {
    setBarPosition();
    homeyouSkinhideNavCategories();
});

$(window).resize(function() {
    setBarPosition();
});

function homeyouSkinhideNavCategories() {
    var windowWidth = $(window).width();
    var scrollTop = $(window).scrollTop();

    if (scrollTop > 50 && windowWidth > 992 || windowWidth < 992) {
        $('.skin-homeyou.page-step1 .header-nav').stop().fadeOut(200);
    } else if (windowWidth > 992) {
        $('.skin-homeyou.page-step1 .header-nav').stop().fadeIn(200);
    }
}

function setBarPosition() {
    var windowheight = $(window).height();
    var footerPosition = $('#footer').position().top;
    var scrollPosition = $(window).scrollTop();

    if ((windowheight < footerPosition) && ((scrollPosition+windowheight) < footerPosition)) {
        $('.back-bar').css("position", "fixed").css("bottom", 0);
    } else {
        $('.back-bar').attr("style","");
    }
}

$.fn.extend({
    onlyNumbers: function() {
        return this.each(function() {
            $(this).keypress(function(event) {
                var charCode = (event.which) ? event.which : event.keyCode;

                if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                    event.preventDefault();
                }
                return true;
            });
        });
    }
});

Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

String.prototype.isEmail = function() {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(this);
};

String.prototype.replaceAll = String.prototype.replaceAll || function(needle, replacement) {
    return this.split(needle).join(replacement);
};