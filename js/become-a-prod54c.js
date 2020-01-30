'use strict'

var BecomeAProStep = (function() {

    // execute
    _validateBecomeAPro();

    function _becomeAProFormValues() {
        var formData = {};

        _setEmailLocalStorage();

        formData['data'] = {
            'name': $form.find('input[name=name]').val(),
            'company': $form.find('input[name=company]').val(),
            'zipcode': $form.find('input[name=zipcode]').val(),
            'phone_number': $form.find('input[name=phone_number]').val(),
            'email': $form.find('input[name=email]').val(),
            'tracking': $form.find('input[name=tracking]').val()
        };

        return formData;
    }

    function _setEmailLocalStorage() {
        if (typeof localStorage.getItem("step_email") === "undefined" || localStorage.getItem("step_email") !== $('input[name=email]').val()) {
            localStorage.setItem("step_email", $('input[name=email]').val());
        }
    }

    var PHONE_MASK_EMPTY = "___-___-____";

    function _validateBecomeAPro(btn) {
        Steps.$form.each(function(index, el) {
            $(this).validate({
                validClass: "success",

                onfocusout: function(element) {
                    if (($(element).val() !== "") && $(element).val() !== PHONE_MASK_EMPTY) {
                        $(element).valid();
                    } else {
                        Steps.removeValidate(element);
                    }
                },

                success: function(label) {
                    Steps.successCustom(label);
                },

                errorPlacement: function(error, element) {
                    Steps.errorPlacementCustom(error, element);
                },

                highlight: function (element) {
                    Steps.highlightCustom(element);
                },

                submitHandler: function(form) {
                    $form = $(form);

                    var btn = (typeof btn === "undefined" ? $form.find('.btn-submit') : btn);

                    var formData = _becomeAProFormValues();

                    Steps.submitForm(formData, btn);

                    return false;
                },

                rules: {
                    name: {
                        required: true,
                        maxlength: 64
                    },
                    company: {
                        required: true,
                        maxlength: 64
                    },
                    zipcode: {
                        required: true,
                        minlength: 5,
                        number: true
                    },
                    phone_number: {
                        required: true,
                        phoneMask: true
                    },
                    email: {
                        required: true,
                        validEmail: true,
                        maxlength: 64
                    },
                },

                messages: {
                    zipcode: {
                        minlength: "Minimum 5 characters."
                    }
                }
            });
        });
    }

})();
