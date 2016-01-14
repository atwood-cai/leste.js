## Core

### Default

#### **\$**
\$(selector) ⇒ element
\$(htmlString) ⇒ fragment
selector 即 CSS selector 。
htmlString 为一段完整的 HTML 片段。
```
// 文档中第一个 div
$('div')

// 文档中第一个 class 为 header 的元素
$('.header')

//create element
$('<div class="Hello"></div>')
$('<div class="Hello"></div><div class="Hello"></div>')
```
#### **$$**
\$$(selector) ⇒ collection
selector 即 CSS selector
```
//获取所有的 div
$$('div')
```
#### **$.ready**

$.ready(function(args){ ... })

事件 DOMContentLoaded 触发后执行的方法

#### **$.extend**

\$.extend(target, [source, [source2, ...]])  ⇒ target
\$.extend(true, target, [source, ...])  ⇒ target

如果第一个参数是 true 则为深拷贝，否则为浅拷贝。

```
var target = { one: 'patridge' },
    source = { two: 'turtle doves' }

$.extend(target, source)
//=> { one: 'patridge',
//     two: 'turtle doves' }
```

## Date

### Default

#### **format**
new Date().format('Y-m-d H:i:s') => "2016-01-01 12:00:00"

其中 Y、m、d、H、i、s 分别是年、月、日、时、分、秒的占位符，可随意组合成需要的格式。

```
var date = new Date();
//2015\12\01 23:10:01
date.format('Y\m\d H:i:s');
```

## Element

### Default

#### **attr**
ele.attr(name)  ⇒ string
ele.attr(name, value)  ⇒ self

```
var form = $('form')
form.attr('action')             //=> read value
form.attr('action', '/create')  //=> set value
```
#### **css**
ele.css(property)  ⇒ value
ele.css(property, value)  ⇒ self
ele.css({ property: value, property2: value2, ... })  ⇒ self

**注意：** 参数为一个对象是，属性需要是驼峰形式，即 ele.style.xxx 这里能识别的属性名。
```
var elem = $('h1')
elem.css('background-color')          // read property
elem.css('background-color', '#369')  // set property

// set multiple properties:
elem.css({ backgroundColor: '#8EE', fontSize: 28 })

```
#### **find**
ele.find(selector)  ⇒ collection

```
var form = $('#myform')
form.find('input, select')
```

#### **html**
ele.html()  ⇒ string
ele.html(content)  ⇒ self
content 为一段完整的 HTML 片段

```
// autolink everything that looks like a Twitter username
$('.comment p').html(function(idx, oldHtml){
  return oldHtml.replace(/(^|\W)@(\w{1,15})/g,
    '$1@<a href="http://twitter.com/$2">$2</a>')
})
```
#### **hide**
ele.hide()  ⇒ self

隐藏一个元素，就是将该元素的 css 属性 display 设置为 none 。
#### **show**
ele.show()  ⇒ self

显示一个元素，就是将该元素的 css 属性 display 设置为 '' 。

#### **offset**
ele.offset()  ⇒ object{left, top}

返回该元素的左上角相对文档流的左上角坐标。

### classList
ele.classList classes list

直接返回某元素的 class 集合
```
//ele => <div id="test" class="A B C D"></div>

//["A", "B", "C", "D"]
ele.classList
```

#### **add**
ele.classList.add(className)

```
//ele => <a class="A B"></a>
ele.classList.add('C')
//ele => <a class="A B C"></a>
```
#### **remove**
ele.classList.remove(className)

```
//ele => <a class="A B C"></a>
ele.classList.remove('C')
//ele => <a class="A B"></a>
```
#### **toggle**
ele.classList.toggle(className) => true/false

ele 已有该 className 返回 false
ele 没有该 className 返回 true

```
//ele => <a class="A B"></a>
ele.classList.toggle('C')
//ele => <a class="A B C"></a>
ele.classList.toggle('C')
//ele => <a class="A B"></a>
```
#### **contains**
ele.classList.contains(className)

```
//ele => <a class="A B"></a>
ele.classList.contains('C')//false
```

### manipulation
#### **before**
ele.before(content)
ele.before(collection)

在某元素前面添加一些内容

```
$('table').before('<p>See the following table:</p>')

$('table').before($$('.test'))
```

#### **after**
ele.after(content)
ele.after(collection)

在某元素后面添加一些内容

```
$('table').after('<p>See the following table:</p>')

$('table').after($$('.test'))
```
#### **replaceWith**
ele.replaceWith(content)
ele.replaceWith(collection)

用一些内容来替换某元素

```
$('table').replaceWith('<p>See the following table:</p>')

$('table').replaceWith($$('.test'))
```
#### **remove**
ele.remove()

移除某个元素

## Event
### Default
#### **on**
ele.on(type, [selector], function(e){ ... })  ⇒ self

type 可以传多个事件类型，空格分隔

```
elem.on('click', function(e){ ... })
elem.on('click mousedown', function(e){ ... })
elem.on('customEvent', function(e){ ... })
```
#### **delegate**
ele.delegate(selector, type, function(e){ ... })  ⇒ self

selector 是 ele 的后代元素的 CSS 选择器。去掉此事件代理就是 ele.off() 。
```
ele.delegate('.child', 'click', function(e) {...})
```

#### **off()**
ele.off(type, [selector])  ⇒ self
ele.off()  ⇒ self

跟 removeEventListener 一样的传参。

#### **trigger**
ele.trigger(event)  ⇒ self

手动触发某事件，可以是自定义事件，也可以是系统事件，并能够传递数据。
```
// add a handler for a custom event
$('body').on('mylib:change', function(e){
  console.log('change on %o with data %s, %s', e.target);
  console.log(e.data) //['one', 'two']
})
// trigger the custom event
$('body').trigger('mylib:change', ['one', 'two'])
```
### touch
#### **tap**
ele.on('tap', function(e) {...})

滑动距离超过 (30, 30) 不触发。
```
ele.on('tap', function(e) {
    //能记录 touchstart 的时间戳
    console.log(e.touchstart)
});
```

## NodeList
### Default
#### **toArray**
list.toArray() => collection

将 nodelist 返回一个数组集合，之后便能使用数组的方法。
```
$$('div').toArray()
.map(item => console.log(item))
.forEach(function() {....})
```

## Other
### promise polyfill
[Promise A+ 的 polyfill](https://github.com/Financial-Times/polyfill-service/tree/master/polyfills/Promise)
### fetch polyfill
[Fetch 的 polyfill](https://github.com/Financial-Times/polyfill-service/tree/master/polyfills/fetch)



