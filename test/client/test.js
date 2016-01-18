(function() {
    var E = chai.expect;
    var D = describe;
    D('core', function() {

        D('$', function() {

            it('$ -> get a element with selector (即 document.querySelector 简单封装)', function() {
                var ele = $('body');
                E(ele && ele.tagName.toLowerCase()).to.equal('body');
            });

            it('$ -> createElement $("<div></div>")', function() {
                var ele = $('<div class="test"></div>');
                E(ele.firstChild.className).to.equal('test');
            });

            it('$ -> createElement $("<div>111</div><p></p>")', function() {
                var ele = $('<div class="test"><p id="test">111</p></div><a>11></a>');
                E(ele.childNodes.length).to.equal(2);
            });

            it('$$ -> get a element list with selector (即 document.querySelectorAll 简单封装)', function() {
                var eles = $$('div');
                E(eles.length >= 2).to.equal(true);
            });

        });


        D('全局方法测试', function() {

            D('$.extend', function() {

                it('extend A、B', function() {
                    var A = {a: 1};
                    var B = {b: 1};
                    var C = $.extend({}, A, B);
                    E(C.a + C.b).to.equal(2);
                });

            });

        });

    });


    D('Date extend', function() {

        D('format', function() {
            it('new Date.format("Y-m-d H:i:s")->' + new Date().format('Y-m-d H:i:s'), function() {
                var d = new Date();
                E(d.format('Y-m-d H:i:s').length).to.equal(19);
            });
        });
    });



    D('Element extend', function() {

        var ele = $('<div class="haha hehe bobo"></div>').firstChild;
        D('classList', function() {
            it('classList return class list like array', function() {
                E(ele.classList.length).to.equal(3);
            });

            it('classList.contains', function() {
                E(ele.classList.contains('haha')).to.equal(true);
            });

            it('classList.add', function() {
                ele.classList.add('test');
                E(ele.classList.contains('test')).to.equal(true);
            });

            it('classList.remove', function() {
                var a = ele.classList.contains('test');
                ele.classList.remove('test');
                E(a && !ele.classList.contains('test')).to.equal(true);
            });

            it('classList.toggle  add a class', function() {
                E(ele.classList.toggle('test') && ele.classList.contains('test')).to.equal(true);
            });

            it('classList.toggle  remove a class', function() {
                E(!ele.classList.toggle('test') && !ele.classList.contains('test')).to.equal(true);
            });

            it('tear down', function() {
                ele.remove();
            });
        });


        D('Element basic extend', function() {

            var ele = $('<div id="testId" data-attr="1"></div>');
            document.body.appendChild(ele);
            ele = $('#testId');

            it('attr -> get a attr', function() {
                E(ele.attr('data-attr')).equal('1');
            });

            it('attr -> set a attr', function() {
                ele.attr('data-attr', '2');
                E(ele.attr('data-attr')).equal('2');
            });

            it('html -> set a html content', function() {
                ele.html('<p class="child" data-id="gg"></p>');
                E($$('#testId .child').length).equal(1);
            });

            it('html -> get element html content', function() {
                E($('#testId .child').attr('data-id')).equal('gg');
            });

            it('find -> find child from parent', function() {
                E(ele.find('.child')[0].attr('data-id')).equal('gg');
            });

            it('css -> set background for element', function() {
                ele.css('background', 'red');
                E('red').equal(ele.style.background);
            });

            it('css -> set font-size for element', function() {
                ele.css('fontSize', '23px');
                E('23px').equal(ele.style.fontSize);
            });

            it('hide -> hide ele display="none"', function() {
                ele.hide();
                E(ele.style.display).to.equal('none');
            });

            it('hide -> show ele css("display") ="none"', function() {
                ele.show();
                E(ele.css('display')).to.equal('block');
            });

            it('offset -> ele`s offset left top is number', function() {
                var o = $('#mocha').offset();
                E(typeof (o.left * o.top)).to.equal('number');
            });

            it('tear down', function() {
                ele.remove();
            });

        });

        D('Element manage Extend(增删改查)', function() {

            var ele = $('<div id="testId1"><a class="aaa"></a></div>');
            document.body.appendChild(ele);
            ele = $('#testId1');

            it('before -> insert ele before someone', function() {
                ele.find('.aaa')[0].before($('<a class="before"></a>'));
                E(ele.firstChild.className).to.equal('before');
            });

            it('after -> insert ele after someone', function() {
                ele.find('.aaa')[0].after($('<a class="after"></a>'));
                E(ele.lastChild.className).to.equal('after');
            });

            it('replaceWith -> replace ele with someone', function() {
                ele.find('.aaa')[0].replaceWith($('<a class="replace"></a>'));
                E(!ele.find('.aaa').length && ele.find('.replace').length === 1).to.equal(true);
            });

            it('tear down', function() {
                ele.remove();
            });

        });

    });


    D('NodeList extend', function() {

        it('toArray -> return a array', function() {
            E($$('div').toArray() instanceof Array).to.equal(true);
        });

    });


    D('Event', function() {

        it('Node on', function(done) {
            document.body.on('click', function(e) {
                E(e.data.data).to.equal(1);
                document.body.off('click', arguments.callee);
                done();
            });
            document.body.trigger('click', {data: 1});
        });

        it('Node on("多个事件名")', function(done) {
            var hand = function(e) {
                E(e.data.data).to.equal(2);
                document.body.off('click', arguments.callee);
                document.body.off('mousedown', arguments.callee);
                done();
            };
            ['click', 'mousedown'].map(function(type){
                document.body.on(type, hand);
            });
            document.body.trigger('mousedown', {data: 2});
        });

        var c = 1;
        it('delegate', function(done) {
            document.body.delegate('#mocha', 'click', function(e) {
                E(1).to.equal(1);
                c++;
                done();
            });
            $('#mocha ul').trigger('click');
        });

        it('delegate off', function() {
            document.body.off();
            $('#mocha ul').trigger('click');
            $('#mocha ul').trigger('click');
            E(c).to.equal(2);
        })

    });

    D('Ajax', function() {

        it('get', function(done) {
            $.ajax({
                url: '../server/data.php',
                dataType: 'json',
                success: function(e) {
                    E(e).to.equal('cool');
                    done();
                }
            });
        });


        it('get with params', function(done) {
            $.ajax({
                url: '../server/data.php?data=123',
                dataType: 'json',
                success: function(e) {
                    E(e).to.equal('get123');
                    done();
                }
            });
        });

        it('post', function(done) {
            $.ajax({
                url: '../server/data.php',
                type: 'post',
                dataType: 'text',
                success: function(e) {
                    E(e).to.equal('cool');
                    done();
                }
            });
        });

        it('post width params', function(done) {
            $.ajax({
                url: '../server/data.php',
                type: 'post',
                data: {data: 123},
                dataType: 'text',
                success: function(e) {
                    E(e).to.equal('post123');
                    done();
                }
            });
        });

    });

})();
