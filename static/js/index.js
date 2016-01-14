var uglifyOptions = {
  parse: {
    strict: false
  },
  compress: {
    sequences     : true,
    properties    : true,
    dead_code     : true,
    drop_debugger : true,
    unsafe        : true,
    unsafe_comps  : true,
    conditionals  : true,
    comparisons   : true,
    evaluate      : true,
    booleans      : true,
    loops         : true,
    unused        : true,
    hoist_funs    : true,
    hoist_vars    : false,
    if_return     : true,
    join_vars     : true,
    cascade       : true,
    side_effects  : true,
    negate_iife   : true,
    screw_ie8     : false,

    warnings      : true,
    global_defs   : {}
  },
  output: {
    indent_start  : 0,
    indent_level  : 4,
    quote_keys    : false,
    space_colon   : true,
    ascii_only    : false,
    inline_script : true,
    width         : 80,
    max_line_len  : 32000,
    beautify      : false,
    source_map    : null,
    bracketize    : false,
    semicolons    : true,
    comments      : /@license|@preserve|^!/,
    preserve_line : false,
    screw_ie8     : false
  }
};

function uglify(code, options) {

    // 1. Parse
    var toplevel_ast = UglifyJS.parse(code, options.parse);
    toplevel_ast.figure_out_scope();

    // 2. Compress
    var compressor = UglifyJS.Compressor(options.compress);
    var compressed_ast = toplevel_ast.transform(compressor);

    // 3. Mangle
    compressed_ast.figure_out_scope();
    compressed_ast.compute_char_frequency();
    compressed_ast.mangle_names();

    // 4. Generate output
    code = compressed_ast.print_to_string(options.output);

    return code;
}

$.ready(function() {

    var group = [];
    fileList.forEach(function(i) {
        if(group.indexOf(i[0]) == -1) group.push(i[0]);
    });

    fileList = fileList.map(function(file) {

        file.unshift(file[1].split('.').join('_'));
        return file;
    });

    $('form').html( doT.template( $('#filesTpl').html() )({group: group, list: fileList}) );


    /**
     * require relate
     */
    $$('input[type="checkbox"]').toArray().forEach(function(ele) {
        ele.on('change', function() {
            var self = this;
            var id = self.attr('id');
            fileList.forEach(function(file, i) {
                var require = file[3];
                //require
                if(self.checked === true && file[0] == id && require) {
                    $('#' + fileList[require][0]).checked = true;
                }

                //relate
                if(self.checked === false && require && fileList[require][0] == id) {
                    $('#' + file[0]).checked = false;
                }
            });
        });
    });


    $('.combine').on('click', function() {
        var checkedList = $$('input:checked');
        var files = checkedList.toArray().map(function(ele) {

            var file = fileList.find(function(item) {
                return item[0] == ele.id;
            });
            return file[2];

        });

        Promise.all(files.map(function(file) {
            return fetch('static/js/src/' + file);
        })).then(function(responses) {
            Promise.all(responses.map(function(res) {
                return res.text();
            })).then(function(texts) {

                var code = uglify(texts.join(';'), uglifyOptions);
                $('#combined').value = code;
                $('.length').html(code.length);
            });
        });

    });

});
