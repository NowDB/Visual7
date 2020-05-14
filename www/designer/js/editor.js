$$(document).on('page:init', '.page[data-name="editor"]', function(callback) {
    panel_left_morph();
});

$$(document).on('click', '#btn-code-editor', function() {
    var project = $$(this).attr('data-project');
    var file = $$(this).attr('data-file');
    var file_replace = file.split(".").join("_");
    var file_dir = $$(this).attr('data-dir');
    var file_type = $$(this).attr('data-type');

    tab_link_active = file;
    tab_project_active = project;
    tab_dir_active = file_dir;

    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project);
    var dir_project_www = path.join(dir_project, 'www/');
    if (file_dir === "root") {
        if (file === "index.html") {
            var file_path = path.join(dir_project_www, file);
        } else if (file === "main.js" || file === "package.json") {
            var file_path = path.join(dir_project, file);
        }
    } else {
        var file_path = path.join(path.join(dir_project_www, file_dir), file);
    }

    $$(document).find('.tab-link').removeClass('tab-link-active');
    $$(document).find('.page-content').removeClass('tab-active');

    $$(document).find('#tab-link-' + file_replace).remove();
    $$(document).find('#tab-' + file_replace).remove();

    $$(document).find('#tab-link-editor').append('<a id="tab-link-' + file_replace + '" class="tab-link tab-link-active" href="#tab-' + file_replace + '" data-file="' + file + '" data-dir="' + file_dir + '" data-project="' + project + '">' +
        '   <span style="padding-bottom:4px;font-size:small;">' + file + '</span>' +
        '   <i id="btn-code-close" data-file="' + file_replace + '" data-fileraw="' + file + '" data-dir="' + file_dir + '" data-type="' + file_type + '" data-project="' + project + '" class="material-icons no-margin no-padding" style="font-size:small;">close</i>' +
        '</a>');
    $$(document).find('#tab-editor').append('<div id="tab-' + file_replace + '" class="page-content tab tab-active"><div style="height:100%;overflow-y: hidden;" id="editor-' + file_replace + '"></div></div>');

    app.preloader.show();

    fs.readFile(file_path, 'utf-8', (err, code_data) => {
        if (err) {
            app.preloader.hide();
            return;
        } else {
            editorRequire.config({
                baseUrl: uriFromPath(path.join(__dirname, '../node_modules/monaco-editor/min'))
            });

            editorRequire(['vs/editor/editor.main'], function() {
                me = monaco.editor;
                we[file] = window.editor;

                loadTheme('Monokai').then(function(callback) {
                    me.defineTheme(callback.base, {
                        base: callback.base,
                        inherit: true,
                        rules: [callback.rules],
                        colors: callback.colors
                    });
                    me.setTheme(callback.base);

                    we[file] = me.create(document.getElementById('editor-' + file_replace), {
                        value: code_data,
                        parameterHints: { enabled: true },
                        scrollBeyondLastLine: false,
                        fixedOverflowWidgets: true,
                        lineNumbers: 'on',
                        lineDecorationsWidth: 36,
                        matchBrackets: "always",
                        lineHeight: 19,
                        folding: true,
                        autoIndent: true,
                        automaticLayout: true,
                        foldingHighlight: true,
                        showFoldingControls: 'always',
                        fontLigatures: true,
                        showUnused: true,
                        smoothScrolling: true,
                        language: file_type
                    });
                });

                app.preloader.hide();
            });
        }
    });

    if (file === 'index.html' ||
        file === 'main.js' ||
        file === 'package.json' ||
        file === 'custom.css' ||
        file === 'framework7-icons.css' ||
        file === 'framework7.bundle.css' ||
        file === 'framework7.bundle.min.css' ||
        file === 'framework7.bundle.rtl.css' ||
        file === 'framework7.bundle.rtl.min.css' ||
        file === 'framework7.css' ||
        file === 'framework7.min.css' ||
        file === 'framework7.rtl.css' ||
        file === 'framework7.rtl.min.css' ||
        file === 'constant.js' ||
        file === 'init.js' ||
        file === 'listener.js' ||
        file === 'routes.js' ||
        file === '404.html' ||
        file === 'about.html' ||
        file === 'home.html') {
        $$(document).find('#btn-code-remove').hide();
    } else {
        $$(document).find('#btn-code-remove').show();
    }

    $$(document).find('#btn-design-html').attr('data-project', project);
    $$(document).find('#btn-design-html').attr('data-file', file);

    var filename_split = file.split('.');
    fileext = filename_split.length - 1;

    if (filename_split[fileext] === "html") {
        if (filename_split[0] === "index") {
            $$(document).find('#btn-design-html').hide();
        } else {
            $$(document).find('#btn-design-html').show();
        }

        $$(document).find('.btn-snippet-js').hide();
    } else if (filename_split[fileext] === "js") {
        $$(document).find('#btn-design-html').hide();
        $$(document).find('.btn-snippet-js').show();
    } else if (filename_split[fileext] === "css") {
        $$(document).find('#btn-design-html').hide();
        $$(document).find('.btn-snippet-js').hide();
    } else if (filename_split[fileext] === "json") {
        $$(document).find('#btn-design-html').hide();
        $$(document).find('.btn-snippet-js').hide();
    }
});

$$(document).on('click', '.tab-link', function() {
    tab_link_active = $$(this).attr('data-file');
    tab_project_active = $$(this).attr('data-project');
    tab_dir_active = $$(this).attr('data-dir');
});

$$(document).on('click', '#btn-code-close', function() {
    var project = $$(this).attr('data-project');
    var file = $$(this).attr('data-fileraw');
    var file_replace = file.split(".").join("_");
    var file_element = $$(this).attr('data-file');
    var file_dir = $$(this).attr('data-dir');
    var file_path = null;

    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project);
    var dir_project_www = path.join(dir_project, 'www/');

    if (file_dir === "root") {
        if (file === "index.html") {
            file_path = path.join(dir_project_www, file);
        } else if (file === "main.js" || file === "package.json") {
            file_path = path.join(dir_project, file);
        }
    } else {
        file_path = path.join(path.join(dir_project_www, file_dir), file);
    }

    //Save Code
    var editor_value = we[file].getValue();
    fs.writeFileSync(file_path, editor_value, 'utf-8');

    //Open Sibling
    var siblings = $$(this).parent().siblings().attr('data-file');
    if (siblings !== undefined) {
        var file_replace = siblings.split(".").join("_");
        app.tab.show('#tab-' + file_replace);
    }

    //Close Tab
    $$(document).find('#tab-link-' + file_element).remove();
    $$(document).find('#tab-' + file_element).remove();

    $$(document).find('#btn-code-remove').hide();
    $$(document).find('#btn-design-html').hide();
    $$(document).find('.btn-snippet-js').hide();
});

// $$(document).on('click', '#btn-code-editor', function() {
//     page_history = app.views.main.history;
//     page_count = page_history.length;
//     page_current = page_history[page_count - 1];

//     if (page_current.split('/')[1] === "designer") {
//         editor_value = editor.getHtml();
//         editor_value = pretty(editor_value, { ocd: true });
//         editor_style = editor.getCss();
//         editor_style = pretty(editor_style, { ocd: true });

//         fs.writeFileSync(filepath_open_active, editor_value, 'utf-8');

//         var dir_visual7 = path.join(os.homedir(), 'Visual7/');
//         var dir_project = path.join(dir_visual7, project_open_active);
//         var dir_project_www = path.join(dir_project, 'www/');
//         var customcss = path.join(path.join(dir_project_www, 'css'), 'custom.css');
//         fs.readFile(customcss, 'utf-8', (err, code_data) => {
//             var customcss_value = beautify(editor_style, { format: 'css' });
//             customcss_value = code_data + customcss_value;
//             fs.writeFileSync(customcss, customcss_value, 'utf-8');
//         });

//         code_editor(project_open_active, file_open_active);

//         navigate_main_back();
//     } else {
//         // Save Previous Code
//         editor_value = we[tab_link_active].getValue();
//         fs.writeFileSync(filepath_open_active, editor_value, 'utf-8');

//         // Append New Code
//         var project = project_open_active;
//         var filename = $$(this).attr('data-file');
//         file_open_active = filename;

//         code_editor(project, filename);
//     }
// });

// function code_editor(project, filename) {
//     var dir_visual7 = path.join(os.homedir(), 'Visual7/');
//     var dir_project = path.join(dir_visual7, project);
//     var dir_project_www = path.join(dir_project, 'www/');
//     var filepath = null;
//     var filelang = null;
//     var fileext = null;

//     var filename_raw = filename;
//     var filename_split = filename_raw.split('.');
//     fileext = filename_split.length - 1;

//     $$(document).find('#page-title').html(filename_raw);
//     $$(document).find('#btn-save').attr('data-project', project);

//     if (filename_raw === 'index.html' ||
//         filename_raw === 'main.js' ||
//         filename_raw === 'package.json' ||
//         filename_raw === 'custom.css' ||
//         filename_raw === 'framework7-icons.css' ||
//         filename_raw === 'framework7.bundle.css' ||
//         filename_raw === 'framework7.bundle.min.css' ||
//         filename_raw === 'framework7.bundle.rtl.css' ||
//         filename_raw === 'framework7.bundle.rtl.min.css' ||
//         filename_raw === 'framework7.css' ||
//         filename_raw === 'framework7.min.css' ||
//         filename_raw === 'framework7.rtl.css' ||
//         filename_raw === 'framework7.rtl.min.css' ||
//         filename_raw === 'constant.js' ||
//         filename_raw === 'init.js' ||
//         filename_raw === 'listener.js' ||
//         filename_raw === 'routes.js' ||
//         filename_raw === '404.html' ||
//         filename_raw === 'about.html' ||
//         filename_raw === 'home.html') {
//         $$(document).find('#btn-code-remove').hide();
//     } else {
//         $$(document).find('#btn-code-remove').show();
//     }

//     $$(document).find('#btn-design-html').attr('data-project', project);
//     $$(document).find('#btn-design-html').attr('data-file', filename_raw);

//     if (filename_split[fileext] === "html") {
//         if (filename_split[0] === "index") {
//             filepath = path.join(dir_project_www, filename_raw);
//             filelang = 'html';

//             $$(document).find('#btn-design-html').hide();
//         } else {
//             filepath = path.join(dir_project_www, 'pages');
//             filepath = path.join(filepath, filename_raw);
//             filelang = 'html';

//             $$(document).find('#btn-design-html').show();
//         }

//         $$(document).find('.btn-snippet-js').hide();
//     } else if (filename_split[fileext] === "js") {
//         if (filename_split[0] === "main") {
//             filepath = path.join(dir_project, filename_raw);
//             filelang = 'javascript';
//         } else {
//             filepath = path.join(dir_project_www, 'js_app');
//             filepath = path.join(filepath, filename_raw);
//             filelang = 'javascript';
//         }

//         $$(document).find('#btn-design-html').hide();
//         $$(document).find('.btn-snippet-js').show();
//     } else if (filename_split[fileext] === "css") {
//         filepath = path.join(dir_project_www, 'css');
//         filepath = path.join(filepath, filename_raw);
//         filelang = 'css';

//         $$(document).find('#btn-design-html').hide();
//         $$(document).find('.btn-snippet-js').hide();
//     } else if (filename_split[fileext] === "json") {
//         if (filename_split[0] === "package") {
//             filepath = path.join(dir_project, filename_raw);
//             filelang = 'json';
//         }

//         $$(document).find('#btn-design-html').hide();
//         $$(document).find('.btn-snippet-js').hide();
//     }

//     filepath_open_active = filepath;

//     fs.readFile(path.join(filepath), 'utf-8', (err, code_data) => {
//         app.preloader.show();

//         if (err) {
//             app.preloader.hide();
//             console.log(err);
//             return;
//         } else {
//             app.preloader.hide();
//             we[tab_link_active].setValue(code_data);
//             me.setModelLanguage(me.getModels()[0], filelang);
//         }
//     });
// }

$$(document).on('click', '#btn-code-remove', function() {
    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, tab_project_active);
    var dir_project_www = path.join(dir_project, 'www/');

    var file_remove_path = path.join(path.join(dir_project_www, tab_dir_active), tab_link_active);
    app.dialog.create({
        title: 'Information',
        text: 'Remove This File <span>' + file_open_active + ' </span>?',
        buttons: [{
            text: '<span>cancel</span>'
        }, {
            text: '<span>Ok</span>',
            onClick: function() {
                fs.unlink(file_remove_path, function(err) {
                    if (err) {
                        console.log(err);
                        window.location.reload();
                    } else {
                        //Open Sibling
                        var file_replace = tab_link_active.split(".").join("_");
                        var siblings = $$(document).find("#tab-link-" + file_replace).siblings().attr('data-file');
                        if (siblings !== undefined) {
                            var file_replace_siblings = siblings.split(".").join("_");
                            app.tab.show('#tab-' + file_replace_siblings);
                        }

                        //Close Tab
                        $$(document).find('#tab-link-' + file_replace).remove();
                        $$(document).find('#tab-' + file_replace).remove();

                        $$(document).find('#btn-code-remove').hide();
                        $$(document).find('#btn-design-html').hide();
                        $$(document).find('.btn-snippet-js').hide();

                        list_html(tab_project_active);
                        list_js(tab_project_active);
                        list_css(tab_project_active);
                        list_other(tab_project_active);
                    }
                });
            }
        }],
        verticalButtons: false,
        animate: false
    }).open();
});

/**
 * Snippet Code
 */

$$(document).on('click', '#code-if', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "if (variable === 0) {\n" +
        "\tresult = false;\n" +
        "}";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-if-else', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "if (variable === 0) {\n" +
        "\tresult = false;\n" +
        "} else {\n" +
        "\tresult = true;\n" +
        "}";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-if-else-if', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "if (variable === 0) {\n" +
        "\tresult = false;\n" +
        "} else if (variable === 1){\n" +
        "\tresult = true;\n" +
        "}";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-page-init', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "$$(document).on('page:init', '.page[data-name=\"your_page_name\"]', function(callback) {\n" +
        "\tconsole.log(callback.detail.route.params);\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-page-reinit', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "$$(document).on('page:reinit', '.page[data-name=\"your_page_name\"]', function(callback) {\n" +
        "\tconsole.log(callback.detail.route.params);\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-page-beforein', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "$$(document).on('page:beforein', '.page[data-name=\"your_page_name\"]', function(callback) {\n" +
        "\tconsole.log(callback.detail.route.params);\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-page-afterin', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "$$(document).on('page:afterin', '.page[data-name=\"your_page_name\"]', function(callback) {\n" +
        "\tconsole.log(callback.detail.route.params);\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-page-beforeout', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "$$(document).on('page:beforeout', '.page[data-name=\"your_page_name\"]', function(callback) {\n" +
        "\tconsole.log(callback.detail.route.params);\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-page-afterout', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "$$(document).on('page:afterout', '.page[data-name=\"your_page_name\"]', function(callback) {\n" +
        "\tconsole.log(callback.detail.route.params);\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-page-afterin-preloader', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "$$(document).on('page:afterin', '.page[data-name=\"your_page_name\"]', function (callback) {\n" +
        "\tconsole.log(callback.detail.route.params);\n\n" +
        "\tapp.preloader.show();\n" +
        "\tsetTimeout(function () {//Wait for 5 Sec\n" +
        "\t\tapp.preloader.hide();\n" +
        "\t}, 5000);\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-page-afterin-progress', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "$$(document).on('page:afterin', '.page[data-name=\"your_page_name\"]', function (callback) {\n" +
        "\tconsole.log(callback.detail.route.params);\n\n" +
        "\tapp.progressbar.show();\n" +
        "\tsetTimeout(function () {//Wait for 5 Sec\n" +
        "\t\tapp.progressbar.hide();\n" +
        "\t}, 5000);\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-page-afterin-progress-multi', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "$$(document).on('page:afterin', '.page[data-name=\"your_page_name\"]', function (callback) {\n" +
        "\tconsole.log(callback.detail.route.params);\n\n" +
        "\tapp.progressbar.show('multi');\n" +
        "\tsetTimeout(function () {//Wait for 5 Sec\n" +
        "\t\tapp.progressbar.hide();\n" +
        "\t}, 5000);\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-page-afterin-dialog-preloader', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "$$(document).on('page:afterin', '.page[data-name=\"your_page_name\"]', function (callback) {\n" +
        "\tconsole.log(callback.detail.route.params);\n\n" +
        "\tapp.dialog.preloader('Loading');\n" +
        "\tsetTimeout(function () {//Wait for 5 Sec\n" +
        "\t\tapp.dialog.close();\n" +
        "\t}, 5000);\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-page-afterin-dialog-progress', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "$$(document).on('page:afterin', '.page[data-name=\"your_page_name\"]', function (callback) {\n" +
        "\tconsole.log(callback.detail.route.params);\n\n" +
        "\tapp.dialog.progress('Loading');\n" +
        "\tsetTimeout(function () {//Wait for 5 Sec\n" +
        "\t\tapp.dialog.close();\n" +
        "\t}, 5000);\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-selector-click', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "$$(document).on('click', '#selector_id_or_class', function () {\n" +
        "\tapp.dialog.alert('click');\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-selector-change', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "$$(document).on('change', '#selector_id_or_class', function () {\n" +
        "\tapp.dialog.alert('change');\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-selector-keyup', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "$$(document).on('keyup', '#selector_id_or_class', function () {\n" +
        "\tapp.dialog.alert('keyup');\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-selector-keydown', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "$$(document).on('keydown', '#selector_id_or_class', function () {\n" +
        "\tapp.dialog.alert('keydown');\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-notifications-full-layout', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "app.notification.create({\n" +
        "\ticon: '<i class=\"icon material-icons\">notifications</i>',\n" +
        "\ttitle: 'Visual7',\n" +
        "\ttitleRightText: 'now',\n" +
        "\tsubtitle: 'This is a subtitle',\n" +
        "\ttext: 'This is a simple notification message',\n" +
        "\tcloseTimeout: 3000,\n" +
        "\ton: {\n" +
        "\t\tclose: function () {\n" +
        "\t\t\tapp.dialog.alert('Notification closed');\n" +
        "\t\t},\n" +
        "\t},\n" +
        "}).open();";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-notifications-close-button', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "app.notification.create({\n" +
        "\ticon: '<i class=\"icon material-icons\">notifications</i>',\n" +
        "\ttitle: 'Visual7',\n" +
        "\ttitleRightText: 'now',\n" +
        "\tsubtitle: 'This is a subtitle',\n" +
        "\ttext: 'This is a simple notification message',\n" +
        "\tcloseButton: true,\n" +
        "\ton: {\n" +
        "\t\tclose: function () {\n" +
        "\t\t\tapp.dialog.alert('Notification closed');\n" +
        "\t\t},\n" +
        "\t},\n" +
        "}).open()";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-notifications-click-close', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "app.notification.create({\n" +
        "\ticon: '<i class=\"icon material-icons\">notifications</i>',\n" +
        "\ttitle: 'Visual7',\n" +
        "\ttitleRightText: 'now',\n" +
        "\tsubtitle: 'This is a subtitle',\n" +
        "\ttext: 'This is a simple notification message',\n" +
        "\tcloseOnClick: true,\n" +
        "\ton: {\n" +
        "\t\tclose: function () {\n" +
        "\t\t\tapp.dialog.alert('Notification closed');\n" +
        "\t\t},\n" +
        "\t},\n" +
        "}).open()";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-toast-top', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "app.toast.create({\n" +
        "\ttext: 'Toast',\n" +
        "\tposition: 'top',\n" +
        "\tcloseTimeout: 2000,\n" +
        "\ton: {\n" +
        "\t\tclose: function () {\n" +
        "\t\t\tapp.dialog.alert('Toast Closed');\n" +
        "\t\t},\n" +
        "\t}\n" +
        "}).open();";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-toast-bottom', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "app.toast.create({\n" +
        "\ttext: 'Toast',\n" +
        "\tcloseTimeout: 2000,\n" +
        "\ton: {\n" +
        "\t\tclose: function () {\n" +
        "\t\t\tapp.dialog.alert('Toast Closed');\n" +
        "\t\t},\n" +
        "\t}\n" +
        "}).open();";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-toast-center', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "app.toast.create({\n" +
        "\ttext: 'Toast',\n" +
        "\tposition: 'center',\n" +
        "\tcloseTimeout: 2000,\n" +
        "\ton: {\n" +
        "\t\tclose: function () {\n" +
        "\t\t\tapp.dialog.alert('Toast Closed');\n" +
        "\t\t},\n" +
        "\t}\n" +
        "}).open();";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-toast-center-icon', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "app.toast.create({\n" +
        "\ttext: 'Toast',\n" +
        "\ticon: app.theme === 'ios' ? '<i class=\"material-icons\">notifications</i>' : '<i class=\"material-icons\">notifications_none</i>',\n" +
        "\tposition: 'center',\n" +
        "\tcloseTimeout: 2000,\n" +
        "\ton: {\n" +
        "\t\tclose: function () {\n" +
        "\t\t\tapp.dialog.alert('Toast Closed');\n" +
        "\t\t},\n" +
        "\t}\n" +
        "}).open();";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-toast-close-button', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "app.toast.create({\n" +
        "\ttext: 'Toast',\n" +
        "\tcloseButton: true,\n" +
        "\ton: {\n" +
        "\t\tclose: function () {\n" +
        "\t\t\tapp.dialog.alert('Toast Closed');\n" +
        "\t\t},\n" +
        "\t}\n" +
        "}).open();";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-toast-custom-close-button', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "app.toast.create({\n" +
        "\ttext: 'Toast',\n" +
        "\tcloseButton: true,\n" +
        "\tcloseButtonText: 'Close Me',\n" +
        "\tcloseButtonColor: 'red',\n" +
        "\ton: {\n" +
        "\t\tclose: function () {\n" +
        "\t\t\tapp.dialog.alert('Toast Closed');\n" +
        "\t\t},\n" +
        "\t}\n" +
        "}).open();";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-dialog-alert', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "app.dialog.alert('Description', 'Title');";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-dialog-confirmation', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "app.dialog.confirm('Are you feel good today?', function() {\n" +
        "\tapp.dialog.alert('Yes');\n" +
        "}, function() {\n" +
        "\tapp.dialog.alert('No');\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-dialog-prompt', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "app.dialog.prompt('What is your name?', function(name) {\n" +
        "\tapp.dialog.alert('Ok, your name is ' + name);\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-dialog-horizontal', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "app.dialog.create({\n" +
        "\ttitle: 'Title',\n" +
        "\ttext: 'Information',\n" +
        "\tbuttons: [{\n" +
        "\t\t\ttext: 'Option',\n" +
        "\t\t\tonClick: function() {\n" +
        "\t\t\t\tapp.dialog.alert('Option');\n" +
        "\t\t\t}\n" +
        "\t\t},\n" +
        "\t\t{\n" +
        "\t\t\ttext: 'Cancel',\n" +
        "\t\t\tonClick: function() {\n" +
        "\t\t\t\tapp.dialog.alert('Cancel');\n" +
        "\t\t\t}\n" +
        "\t\t},\n" +
        "\t\t{\n" +
        "\t\t\ttext: 'Yes',\n" +
        "\t\t\tonClick: function() {\n" +
        "\t\t\t\tapp.dialog.alert('Yes');\n" +
        "\t\t\t}\n" +
        "\t\t},\n" +
        "\t]\n" +
        "}).open();";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-dialog-vertical', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "app.dialog.create({\n" +
        "\ttitle: 'Title',\n" +
        "\ttext: 'Information',\n" +
        "\tbuttons: [{\n" +
        "\t\t\ttext: 'Option',\n" +
        "\t\t\tonClick: function() {\n" +
        "\t\t\t\tapp.dialog.alert('Option');\n" +
        "\t\t\t}\n" +
        "\t\t},\n" +
        "\t\t{\n" +
        "\t\t\ttext: 'Cancel',\n" +
        "\t\t\tonClick: function() {\n" +
        "\t\t\t\tapp.dialog.alert('Cancel');\n" +
        "\t\t\t}\n" +
        "\t\t},\n" +
        "\t\t{\n" +
        "\t\t\ttext: 'Yes',\n" +
        "\t\t\tonClick: function() {\n" +
        "\t\t\t\tapp.dialog.alert('Yes');\n" +
        "\t\t\t}\n" +
        "\t\t},\n" +
        "\t],\n" +
        "\tverticalButtons: true\n" +
        "}).open();";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-dialog-login', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "app.dialog.login('Enter your username and password', function(username, password) {\n" +
        "\tapp.dialog.alert('Thank you!<br>Username:' + username + '<br>Password:' + password);\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-dialog-password', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "app.dialog.password('Enter your username and password', function(password) {\n" +
        "\tapp.dialog.alert('Thank you!<br>Password:' + password);\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-dialog-preloader', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "app.dialog.preloader('Title');\n" +
        "setTimeout(function() {\n" +
        "\tapp.dialog.close();\n" +
        "}, 3000);";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-dialog-progress', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "app.dialog.progress('Title');\n" +
        "setTimeout(function() {\n" +
        "\tapp.dialog.close();\n" +
        "}, 3000);";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});

$$(document).on('click', '#code-dialog-progress-percent', function() {
    app.popover.close();

    var position = we[tab_link_active].getPosition();
    var text = we[tab_link_active].getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "var progress = 0;\n" +
        "var dialog = app.dialog.progress('Loading assets', progress);\n" +
        "dialog.setText('Image 1 of 10');\n" +
        "var interval = setInterval(function() {\n" +
        "\tprogress += 10;\n" +
        "\tdialog.setProgress(progress);\n" +
        "\tdialog.setText('Image ' + ((progress) / 10) + ' of 10');\n" +
        "\tif (progress === 100) {\n" +
        "\t\tclearInterval(interval);\n" +
        "\t\tdialog.close();\n" +
        "\t}\n" +
        "}, 300);";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we[tab_link_active].setValue(splitedText.join("\n"));
    we[tab_link_active].setPosition(position);
});