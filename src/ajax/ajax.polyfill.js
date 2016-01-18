(function() {

    function empty() {}

    var accepts = {
        script: 'text/javascript, application/javascript, application/x-javascript',
        json:   'application/json',
        xml:    'application/xml, text/xml',
        html:   'text/html',
        text:   'text/plain'
    };

    var defaultSetting = {
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
        xhr: function() { return new window.XMLHttpRequest(); },
        dataType: 'json',
        // Whether the request is to another domain
        timeout: 0,
        // Whether data should be serialized to string
        processData: true,
        // Whether the browser should be allowed to cache GET responses
        cache: true,

        crossDomain: false,

        async: true,
    };

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

        if (!settings.crossDomain) setHeader('X-Requested-With', 'XMLHttpRequest');

        setHeader('Accept', mime || '*/*');


        if(mime.indexOf(',') > -1) {
            mime = mime.split(',', 2)[0];
        }
        if(xhr.overrideMimeType) xhr.overrideMimeType(mime);


        if (settings.contentType || (settings.contentType !== false && settings.data && type!= 'GET'))
            setHeader('Content-Type', settings.contentType || 'application/x-www-form-urlencoded');

        if (settings.headers)
            for (var name in settings.headers)
                setHeader(name, settings.headers[name]);

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                xhr.onreadystatechange = empty;
                clearTimeout(abortTimeout);
                var result, error = false;
                if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304 || (xhr.status == 0 && protocol == 'file:')) {
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
                    ajaxError(xhr.statusText || null, xhr.status ? 'error' : 'abort', xhr, settings);
                }
            }
        };

        xhr.open(settings.type, settings.url, settings.async, settings.username, settings.password);

        for (var head in headers)
            xhr.setRequestHeader(head, headers[head]);

        if (settings.timeout > 0)
            abortTimeout = setTimeout(function(){
                xhr.onreadystatechange = empty;
                xhr.abort();
                ajaxError(null, 'timeout', xhr, settings);
            }, settings.timeout);

        // avoid sending empty string (#319)
        xhr.send(type == 'GET' ? null : (settings.data ? JSON.stringify(settings.data) : null));

        return xhr;
    };

})();
