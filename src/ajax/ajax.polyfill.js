(function() {

    var onreadystatechange = 'onreadystatechange',
        application = 'application',
        js = 'javascript',
        _text = 'text',
        _contentType = 'contentType',
        _headers = 'headers',
        _XMLHttpRequest = 'XMLHttpRequest',
        _overrideMimeType = 'overrideMimeType',
        _timeout = 'timeout',
        _crossDomain = 'crossDomain',
        _status = 'status';

    function empty() {}

    var accepts = {
        script: _text + '/' + js + ', ' + application + '/' + js + ', ' + application + '/x-' + js,
        json:   application + '/json',
        xml:    application + '/xml, ' + _text + '/xml',
        html:   _text + '/html',
        text:   _text + '/plain'
    },

    defaultSetting = {
        // Default type of request
        type: 'GET',
        // Callback that is executed before request
        beforeSend: empty,
        // Callback that is executed if the request succeeds
        success: empty,
        // Callback that is executed the the server drops error
        error: empty,
        // Callback that is executed on request complete (both: error and success)
        complete: empty,
        // Transport
        xhr: function() { return new window[_XMLHttpRequest](); },
        dataType: 'json',
        // Whether data should be serialized to string
        processData: true,
        // Whether the browser should be allowed to cache GET responses
        cache: true,

        async: true,
    };

    defaultSetting[_timeout] = 0;
    defaultSetting[_crossDomain] = false;

    $.ajax = function(options) {

        var settings = $.extend({}, options || {});
            for (var key in defaultSetting)
                if (settings[key] === undefined)
                    settings[key] = defaultSetting[key];

        var headers = {},
            dataType = settings.dataType,
            mime = accepts[dataType],
            xhr = settings.xhr(),
            ajaxError = settings.error,
            ajaxSuccess = settings.success,
            abortTimeout,
            type = settings.type.toUpperCase();

        function setHeader(name, value) {
            headers[name.toLowerCase()] = [name, value];
        }

        if (!settings[_crossDomain]) setHeader('X-Requested-With', _XMLHttpRequest);

        setHeader('Accept', mime || '*/*');


        if(mime.indexOf(',') > -1) {
            mime = mime.split(',', 2)[0];
        }
        if(xhr[_overrideMimeType]) xhr[_overrideMimeType](mime);


        if (settings[_contentType] || (settings[_contentType] !== false && settings.data && type!= 'GET'))
            setHeader('Content-Type', settings[_contentType] || application + '/x-www-form-urlencoded');

        if (settings[_headers])
            for (var name in settings[_headers])
                setHeader(name, settings[_headers][name]);

        xhr[onreadystatechange] = function() {
            if (xhr.readyState == 4) {
                xhr[onreadystatechange] = empty;
                clearTimeout(abortTimeout);
                var result, error = false;
                if ((xhr[_status] >= 200 && xhr[_status] < 300) || xhr[_status] == 304 || (xhr[_status] == 0 && protocol == 'file:')) {
                    dataType = dataType || mimeToDataType(settings.mimeType || xhr.getResponseHeader('content-type'));
                    result = xhr.responseText;

                    try {
                        if (dataType == 'script')    (1,eval)(result);
                        else if (dataType == 'xml')  result = xhr.responseXML;
                        //else if (dataType == 'json') result = blankRE.test(result) ? null : $.parseJSON(result);
                        ajaxSuccess(result, xhr, settings);
                    } catch (e) {
                        error = e;
                        ajaxError(error, 'parsererror', xhr, settings);
                    }

                } else {
                    ajaxError(xhr.statusText || null, xhr[_status] ? 'error' : 'abort', xhr, settings);
                }
            }
        };

        xhr.open(settings.type, settings.url, settings.async, settings.username, settings.password);

        for (var head in headers)
            xhr.setRequestHeader(head, headers[head]);

        if (settings[_timeout] > 0)
            abortTimeout = setTimeout(function(){
                xhr[onreadystatechange] = empty;
                xhr.abort();
                ajaxError(null, _timeout, xhr, settings);
            }, settings[_timeout]);

        // avoid sending empty string (#319)
        xhr.send(type == 'GET' ? null : (settings.data ? JSON.stringify(settings.data) : null));

        return xhr;
    };

})();
