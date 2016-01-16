/**
 * 目前暂时只支持单指触摸
 **/
$.ready(function() {

    var doc = document,
        touch = {},
        firstTouch,
        deltaX = 0, deltaY = 0,
        touchTimeout,
        pageX = 'pageX',
        pageY = 'pageY',
        target = 'target',
        setTime = setTimeout;

    doc.on('touchstart', function(e) {

        firstTouch = e.touches[0];

        touch.x1 = firstTouch[pageX];
        touch.y1 = firstTouch[pageY];
        touch.ele = 'tagName' in firstTouch[target] ? firstTouch[target] : firstTouch[target].parentNode;
        touch.last = new Date().getTime();

        touchTimeout && clearTimeout(touchTimeout);
    });

    doc.on('touchmove', function(e) {

        firstTouch = e.touches[0];

        touch.x2 = firstTouch[pageX];
        touch.y2 = firstTouch[pageY];

        deltaX += Math.abs(touch.x1 - touch.x2);
        deltaY += Math.abs(touch.y1 - touch.y2);
    });

    doc.on('touchend', function(e) {

        if ('last' in touch) {
            if (deltaX < 30 && deltaY < 30) {
                touchTimeout = setTime(function() {
                    touchTimeout = setTime(function() {
                        touchTimeout = null;
                        touch.ele.trigger('tap', 'CustomEvent', {
                            touchstart: touch.last,
                            touchList: e.changedTouches
                        });
                    }, 250);
                }, 0);
            } else {
                touch = {};
            }

            deltaX = deltaY = 0;
        }
    });

});
