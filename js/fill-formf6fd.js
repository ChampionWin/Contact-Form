var FillForm = (function(){
    var getQueryParams = function(qs) {
        qs = qs.split('+').join(' ');

        var params = {},
            tokens,
            re = /[?&]?([^=]+)=([^&]*)/g;

        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }

        return params;
    };

    var getInput = function(form, inputName) {
        return form.find('[name=' + inputName + ']');
    };

    var params = getQueryParams(window.location.search);

    if (!params.attributes) {
        return;
    }

    var attrs = JSON.parse(params.attributes);

    var $form = $('.form-sign-up');
    var track = false;
    var $input;
    var name, value;

    for (var name in attrs) {
        if (attrs.hasOwnProperty(name)) {
            $input = getInput($form, name);

            $input.val(attrs[name]).blur().parent().focus();

            if (name.toLowerCase() === 'emid' || name.toLowerCase() === 'subid') {
                track = true;
            }
        }
    }

    if (track) {
        var trackingInput = '<input type="hidden" name="tracking" val="" />';
        $form.append($(trackingInput).val(JSON.stringify(attrs)));
    }
})();
