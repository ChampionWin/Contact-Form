'use strict'

// cache DOM
var $form = $('.form-sign-up');

var Steps = (function() {

    // execute
    _bindCheckbox();
    bindClickExpandResultsHandler();
    bindClickRemoveLineHandler();
    bindCheckHandler();
    bindClickEditHandler();

    /**
     * Submit form via ajax, receive response error or success to redirect
     *
     * @param  object formData Form inputs and step to set Cookie
     * @param  object btn      Jquery element
     */
    function submitForm(formData, btn) {
        if (btn !== undefined) {
            btn.attr('disabled', 'disabled');
        };

        $.ajax({
            url: $form.attr('action'),
            type: $form.attr('method'),
            data: formData.data,
            dataType: 'json',
            success: function(response) {
                if (response.success === true) {
                    if (_writeLocalStorage(formData.step)) {
                        window.location = response.nextStep + window.location.search;
                    }
                } else {
                    if (response.message == "Invalid Zip Code") {
                        _zipcodeInvalid();
                    } else {
                        modalError(response.message);
                    }

                    if (btn !== undefined) {
                        btn.attr('disabled', false);

                        return true;
                    };
                };
            }
        });
    }

    function _zipcodeInvalid() {
        var error = $('<label id="zipcode-error" class="error" for="zipcode">Invalid Zipcode.</label>');
        var $element = $form.find('input[name=zipcode]');

        $element.removeClass('success').addClass('error');

        errorPlacementCustom(error, $element);
    }

    function _writeLocalStorage(stepData) {
        for (var property in stepData) {
            localStorage.removeItem(property);

            localStorage.setItem(property, JSON.stringify(stepData[property]));
        }

        return true;
    }

    function clearStorage() {
        var steps = 5;
        var email = getCurrentEmail();

        for (var i = 1; i <= steps; i++) {
            localStorage.removeItem('step_' + i + '-' + email, {});
        }
    }

    function modalError(message) {
        var message = (message == "" ? "An error ocurred" : message);

        //DUPLICATE MESSAGE
        if (message == "Contractor was previously registered") {
            $('#modal-error').modal();
            var email = $("input[name='email']").val();
            $('#current-email').html(email);
            $('.modal-already-registered').modal('show');

            return;
        };

        //OTHER ERRORS
        if ($('#modal-error').length > 0) {
            $('#modal-error .modal-content p.message').text(message);
        } else {
            var tmpl = "";

            tmpl += '<div class="modal fade" id="modal-error" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">';
                tmpl += '<div class="modal-dialog" role="document">';
                    tmpl += '<div class="modal-content">';
                        tmpl += '<div class="margin-bottom-0 alert alert-danger modal-body" role="alert">';
                            tmpl += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>';
                            tmpl += '<p class="text-center message">';
                                tmpl += message;
                            tmpl += '</p>';
                        tmpl += '</div>';
                    tmpl += '</div>';
                tmpl += '</div>';
            tmpl += '</div>';

            $(tmpl).appendTo('body');
        };

        $('#modal-error').modal();
    }

    function _bindCheckbox() {
        $('.label-checkbox-wrapper .js-checkbox').click(function(event) {
            event.preventDefault();

            $(this).parent().find('input').trigger('click');
        });
    }

    function bindClickExpandResultsHandler () {
        $('body').on('click', '.js-results', function(event) {
            event.preventDefault();

            $(this).toggleClass('active');

            _expandResults.call(this);
        });
    }

    function _expandResults () {
        $(this)
            .parent()
            .parent()
            .parent()
            .parent()
            .parent()
            .find('tr.results').toggle();
    }

    function bindClickRemoveLineHandler () {
        $('body').on('click', '.js-trash', function(event) {
            event.preventDefault();

            var $insertContent = $(this)
                .parent()
                .parent()
                .parent()
                .parent()
                .parent()
                .parent('.panel-group')
                .parent('.js-insert-here')
                .parent('.js-insert-content');

            $(this)
                .parent()
                .parent()
                .parent()
                .parent()
                .parent()
                .parent('.panel-group')
                .remove();

            _validateTableNotEmpty.call($insertContent);
            validateForm();
        });
    }

    function _validateTableNotEmpty () {
        if (this.find('.panel-group').length > 0) {
            this.removeClass('hide');
        } else {
            this.addClass('hide');
        }
    }

    function validateForm() {
        var valid = 0;

        $('.form-sign-up .js-insert-content').each(function() {
            if ($(this).find('input').length > 0) {
                valid++;
            }
        });

        if ($('.form-sign-up .js-insert-content').length === valid) {
            $('.form-sign-up .btn-submit').attr('disabled', false);
        } else {
            $('.form-sign-up .btn-submit').attr('disabled', 'disabled');
        }
    }

    function renderTemplate(template, pre) {
        if (pre) {
            $('.js-insert-content .js-insert-here').prepend(template);
        } else {
            $('.js-insert-content .js-insert-here').append(template);
        }

        $('.js-insert-content').removeClass('hide');

        validateForm();
        setBarPosition();
    }

    function bindClickEditHandler() {
        $('body').on('click', '.js-results', function() {
            setTimeout(setBarPosition, 100);
            setTimeout(setBarPosition, 250);
            setTimeout(setBarPosition, 400);
        });
    }

    function bindCheckHandler() {
        $('body').on('click', '.label-checkbox input', function(event) {
            if ($(this).prop('checked') !== true) {
                $(this).parent().parent('li').addClass('disabled');
            } else {
                $(this).parent().parent('li').removeClass('disabled');
            }
        });

        $('body').on('click', '.collapse-list li', function(event) {
            event.preventDefault();

            $(this).toggleClass('disabled');

            if ($(this).find('.label-checkbox input').prop('checked') === true) {
                $(this).find('.label-checkbox input').prop('checked', false);
            } else {
                $(this).find('.label-checkbox input').prop('checked', true);
            }
        });
    }

    function successCustom (label) {
        $(label).parent().find('.ico-validate.ico-error').remove();

        var validIcon = $('<i class="ico-validate ico-success fa fa-check-circle" aria-hidden="true"></i>');

        var countValid = $(label).parent().find('label.valid').length;

        if (!label.parent(".form-group").hasClass('form-group-hide-icon')) {
            label.parent(".form-group").addClass('form-group-hide-icon');
        }

        validIcon.appendTo(label.parent('.form-group'));

        if (countValid == 0) {
            label.addClass("valid").removeClass('error').text("");
        } else {
            label.remove();
        }
    }

    function errorPlacementCustom (error, element) {
        element.parent().find('.ico-validate.ico-success').remove();

        var errorIcon = $('<i class="ico-validate ico-error fa fa-exclamation-triangle" aria-hidden="true"></i>');

        if (error) {
            error.appendTo(element.parent(".form-group"));
        }

        element.parent(".form-group").addClass('form-group-hide-icon');

        errorIcon.appendTo(element.parent(".form-group"));

        errorIcon.hover(function() {
            $(this).parent('.form-group').find('label.error').css({
                visibility: 'visible'
            });
        }, function() {
            $(this).parent('.form-group').find('label.error').css({
                visibility: 'hidden'
            });
        });
    }

    function removeValidate(element) {
        $(element).removeClass('error').removeClass('success');
        $(element).parent().find('label.error').remove();
        $(element).parent().find('label.valid').remove();
        $(element).parent().find('i.ico-validate').remove();
    }

    function highlightCustom (element) {
        $(element).addClass('error').removeClass('success');

        $(element).parent().find('label.valid').remove();

        if (($(element).prop('name') === 'phone_number') && ($(element).val() !== "___-___-____")) {
            $(element).data('last_phone', $(element).val());
        }
    }

    function getCurrentEmail() {
        var currentEmail = "";

        if (typeof localStorage.getItem("step_email") !== "undefined") {
            currentEmail = localStorage.getItem("step_email");
        }

        return currentEmail;
    }

    return {
        submitForm: submitForm,
        modalError: modalError,
        validateForm: validateForm,
        renderTemplate: renderTemplate,
        $form: $form,
        successCustom: successCustom,
        errorPlacementCustom: errorPlacementCustom,
        highlightCustom: highlightCustom,
        writeLocalStore: _writeLocalStorage,
        clearStorage: clearStorage,
        removeValidate: removeValidate,
        currentEmail: getCurrentEmail()
    };

})();

$.validator.addMethod("validEmail", function(value, element) {
    var validEmail = value.isEmail();

    return this.optional(element) || validEmail;
}, "Invalid Email.");

$.validator.addMethod("dateCard", function(value, element) {
    var dateReg = /^\d{2}\d{2}$/;
    var removeSlashes = /[^0-9]/g;
    var valid = false;

    var newValue = value.replace(removeSlashes, "");

    if ((newValue.length >= 4) && (newValue.match(dateReg) !== null)) {
        var date = value.split("/");

        if ((date[0] > 0) && (date[0] <= 12)) {
            valid = true;
        }
    }

    return this.optional(element) || valid;
}, "Invalid date.");

$.validator.addMethod("phoneMask", function(value, element) {
    value = value.replace(/[^0-9]/g, "");

    return this.optional(element) || (value.length == 10 ? true : false);
}, "Invalid phone number.");