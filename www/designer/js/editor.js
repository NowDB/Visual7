$$(document).on('page:init', '.page[data-name="editor"]', function(callback) {
    panel_left_morph();

    var project = callback.detail.route.params.project;
    var filename = callback.detail.route.params.filename;

    $$(document).find('#page-title').html(filename);

    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project);
    var dir_project_www = path.join(dir_project, 'www/');

    file_open_active = filename;
    filepath_open_active = path.join(dir_project_www, filename);

    self.module = undefined;

    fs.readFile(path.join(dir_project_www, filename), 'utf-8', (err, code_data) => {
        app.preloader.show();

        if (err) {
            app.preloader.hide();
            console.log(err);
            return;
        } else {
            editorRequire.config({
                baseUrl: uriFromPath(path.join(__dirname, '../node_modules/monaco-editor/min'))
            });

            editorRequire(['vs/editor/editor.main'], function() {
                loadTheme('Monokai').then(function(callback) {
                    me = monaco.editor;
                    me.defineTheme(callback.base, {
                        base: callback.base,
                        inherit: true,
                        rules: [callback.rules],
                        colors: callback.colors
                    });
                    me.setTheme(callback.base);

                    we = window.editor;
                    we = me.create(document.getElementById('container'), {
                        value: code_data,
                        parameterHints: { enabled: true },
                        scrollBeyondLastLine: false,
                        fixedOverflowWidgets: true,
                        lineNumbers: 'on',
                        folding: true,
                        foldingHighlight: true,
                        showFoldingControls: 'always',
                        fontLigatures: true,
                        showUnused: true,
                        smoothScrolling: true,
                        language: 'html'
                    });
                });

                app.preloader.hide();

                // Terminal Project
                termEditor = new Terminal({
                    fontFamily: 'Fira Code, Iosevka, monospace',
                    fontSize: 12,
                    experimentalCharAtlas: 'dynamic'
                });

                termEditor.setOption('theme', { background: '#1e1e1e' });

                const fitAddon = new FitAddon();
                termEditor.loadAddon(fitAddon);

                const terminalElem = document.getElementById('term-editor');
                termEditor.open(terminalElem);

                fitAddon.fit();

                const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];
                ptyProcessEditor = pty.spawn(shell, [], {
                    name: 'xterm-color',
                    cols: term.cols,
                    rows: term.rows,
                    cwd: process.cwd(),
                    env: process.env
                });

                termEditor.onData(function(data) {
                    ptyProcessEditor.write(data);
                });

                termEditor.onResize(function(size) {
                    ptyProcessEditor.resize(
                        Math.max(size ? size.cols : termEditor.cols, 1),
                        Math.max(size ? size.rows : termEditor.rows, 1)
                    );
                });

                ptyProcessEditor.on('data', function(data) {
                    termEditor.write(data);
                });

                if (os.platform() === "darwin") {
                    ptyProcessEditor.write('cd ~\r');
                    ptyProcessEditor.write('cd Visual7\r');
                    ptyProcessEditor.write('cd ' + project + '\r');
                } else if (os.platform() === "linux") {
                    ptyProcessEditor.write('cd ~\r');
                    ptyProcessEditor.write('cd Visual7\r');
                    ptyProcessEditor.write('cd ' + project + '\r');
                } else {
                    ptyProcessEditor.write('cd %homepath%\r');
                    ptyProcessEditor.write('cd Visual7\r');
                    ptyProcessEditor.write('cd ' + project + '\r');
                }
            });
        }
    });
});

$$(document).on('click', '#btn-code-editor', function() {
    page_history = app.views.main.history;
    page_count = page_history.length;
    page_current = page_history[page_count - 1];

    if (page_current.split('/')[1] === "designer") {
        editor_value = editor.getHtml();
        editor_value = pretty(editor_value, { ocd: true });

        fs.writeFileSync(filepath_open_active, editor_value, 'utf-8');

        code_editor(project_open_active, file_open_active);

        navigate_main_back();
    } else {
        // Save Previous Code
        editor_value = we.getValue();
        fs.writeFileSync(filepath_open_active, editor_value, 'utf-8');

        // Append New Code
        var project = project_open_active;
        var filename = $$(this).attr('data-file');
        file_open_active = filename;

        code_editor(project, filename);
    }
});

function code_editor(project, filename) {
    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project);
    var dir_project_www = path.join(dir_project, 'www/');
    var filepath = null;
    var filelang = null;
    var fileext = null;

    var filename_raw = filename;
    var filename_split = filename_raw.split('.');
    fileext = filename_split.length - 1;

    $$(document).find('#page-title').html(filename_raw);
    $$(document).find('#btn-save').attr('data-project', project);

    if (filename_raw === 'index.html' ||
        filename_raw === 'main.js' ||
        filename_raw === 'package.json' ||
        filename_raw === 'custom.css' ||
        filename_raw === 'framework7-icons.css' ||
        filename_raw === 'framework7.bundle.css' ||
        filename_raw === 'framework7.bundle.min.css' ||
        filename_raw === 'framework7.bundle.rtl.css' ||
        filename_raw === 'framework7.bundle.rtl.min.css' ||
        filename_raw === 'framework7.css' ||
        filename_raw === 'framework7.min.css' ||
        filename_raw === 'framework7.rtl.css' ||
        filename_raw === 'framework7.rtl.min.css' ||
        filename_raw === 'constant.js' ||
        filename_raw === 'init.js' ||
        filename_raw === 'listener.js' ||
        filename_raw === 'routes.js' ||
        filename_raw === '404.html' ||
        filename_raw === 'about.html' ||
        filename_raw === 'home.html') {
        $$(document).find('#btn-code-remove').hide();
    } else {
        $$(document).find('#btn-code-remove').show();
    }

    $$(document).find('#btn-design-html').attr('data-project', project);
    $$(document).find('#btn-design-html').attr('data-file', filename_raw);

    if (filename_split[fileext] === "html") {
        if (filename_split[0] === "index") {
            filepath = path.join(dir_project_www, filename_raw);
            filelang = 'html';

            $$(document).find('#btn-design-html').hide();
        } else {
            filepath = path.join(dir_project_www, 'pages');
            filepath = path.join(filepath, filename_raw);
            filelang = 'html';

            $$(document).find('#btn-design-html').show();
        }

        $$(document).find('.btn-snippet-js').hide();
    } else if (filename_split[fileext] === "js") {
        if (filename_split[0] === "main") {
            filepath = path.join(dir_project, filename_raw);
            filelang = 'javascript';
        } else {
            filepath = path.join(dir_project_www, 'js_app');
            filepath = path.join(filepath, filename_raw);
            filelang = 'javascript';
        }

        $$(document).find('#btn-design-html').hide();
        $$(document).find('.btn-snippet-js').show();
    } else if (filename_split[fileext] === "css") {
        filepath = path.join(dir_project_www, 'css');
        filepath = path.join(filepath, filename_raw);
        filelang = 'css';

        $$(document).find('#btn-design-html').hide();
        $$(document).find('.btn-snippet-js').hide();
    } else if (filename_split[fileext] === "json") {
        if (filename_split[0] === "package") {
            filepath = path.join(dir_project, filename_raw);
            filelang = 'json';
        }

        $$(document).find('#btn-design-html').hide();
        $$(document).find('.btn-snippet-js').hide();
    }

    filepath_open_active = filepath;

    fs.readFile(path.join(filepath), 'utf-8', (err, code_data) => {
        app.preloader.show();

        if (err) {
            app.preloader.hide();
            console.log(err);
            return;
        } else {
            app.preloader.hide();
            we.setValue(code_data);
            me.setModelLanguage(me.getModels()[0], filelang);
        }
    });
}

// $$(document).on('click', '#btn-code-save', function() {
//     var editor_value = we.getValue();
//     fs.writeFileSync(filepath_open_active, editor_value, 'utf-8');
//     app.toast.create({
//         text: 'File Saved',
//         position: 'center',
//         closeTimeout: 2000
//     }).open();
// });

$$(document).on('click', '#btn-code-remove', function() {
    app.dialog.create({
        title: 'Information',
        text: 'Remove This File <span>' + file_open_active + ' </span>?',
        buttons: [{
            text: '<span>cancel</span>'
        }, {
            text: '<span>Ok</span>',
            onClick: function() {
                fs.unlink(path.join(filepath_open_active), function(err) {
                    if (err) {
                        console.log(err);
                        window.location.reload();
                    } else {
                        list_html(project_open_active);
                        list_js(project_open_active);
                        list_css(project_open_active);
                        list_other(project_open_active);

                        code_editor(project_open_active, 'index.html');
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

    var position = we.getPosition();
    var text = we.getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "if (variable === 0) {\n" +
        "\tresult = false;\n" +
        "}";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-if-else', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "if (variable === 0) {\n" +
        "\tresult = false;\n" +
        "} else {\n" +
        "\tresult = true;\n" +
        "}";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-if-else-if', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "if (variable === 0) {\n" +
        "\tresult = false;\n" +
        "} else if (variable === 1){\n" +
        "\tresult = true;\n" +
        "}";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-page-init', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "$$(document).on('page:init', '.page[data-name=\"your_page_name\"]', function(callback) {\n" +
        "\tconsole.log(callback.detail.route.params);\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-page-reinit', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "$$(document).on('page:reinit', '.page[data-name=\"your_page_name\"]', function(callback) {\n" +
        "\tconsole.log(callback.detail.route.params);\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-page-beforein', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "$$(document).on('page:beforein', '.page[data-name=\"your_page_name\"]', function(callback) {\n" +
        "\tconsole.log(callback.detail.route.params);\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-page-afterin', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "$$(document).on('page:afterin', '.page[data-name=\"your_page_name\"]', function(callback) {\n" +
        "\tconsole.log(callback.detail.route.params);\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-page-beforeout', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "$$(document).on('page:beforeout', '.page[data-name=\"your_page_name\"]', function(callback) {\n" +
        "\tconsole.log(callback.detail.route.params);\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-page-afterout', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "$$(document).on('page:afterout', '.page[data-name=\"your_page_name\"]', function(callback) {\n" +
        "\tconsole.log(callback.detail.route.params);\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-page-afterin-preloader', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
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
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-page-afterin-progress', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
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
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-page-afterin-progress-multi', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
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
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-page-afterin-dialog-preloader', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
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
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-page-afterin-dialog-progress', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
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
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-selector-click', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "$$(document).on('click', '#selector_id_or_class', function () {\n" +
        "\tapp.dialog.alert('click');\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-selector-change', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "$$(document).on('change', '#selector_id_or_class', function () {\n" +
        "\tapp.dialog.alert('change');\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-selector-keyup', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "$$(document).on('keyup', '#selector_id_or_class', function () {\n" +
        "\tapp.dialog.alert('keyup');\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-selector-keydown', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "$$(document).on('keydown', '#selector_id_or_class', function () {\n" +
        "\tapp.dialog.alert('keydown');\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-notifications-full-layout', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
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
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-notifications-close-button', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
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
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-notifications-click-close', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
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
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-toast-top', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
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
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-toast-bottom', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
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
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-toast-center', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
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
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-toast-center-icon', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
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
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-toast-close-button', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
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
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-toast-custom-close-button', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
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
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-dialog-alert', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "app.dialog.alert('Description', 'Title');";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-dialog-confirmation', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "app.dialog.confirm('Are you feel good today?', function() {\n" +
        "\tapp.dialog.alert('Yes');\n" +
        "}, function() {\n" +
        "\tapp.dialog.alert('No');\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-dialog-prompt', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "app.dialog.prompt('What is your name?', function(name) {\n" +
        "\tapp.dialog.alert('Ok, your name is ' + name);\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-dialog-horizontal', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
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
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-dialog-vertical', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
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
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-dialog-login', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "app.dialog.login('Enter your username and password', function(username, password) {\n" +
        "\tapp.dialog.alert('Thank you!<br>Username:' + username + '<br>Password:' + password);\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-dialog-password', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "app.dialog.password('Enter your username and password', function(password) {\n" +
        "\tapp.dialog.alert('Thank you!<br>Password:' + password);\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-dialog-preloader', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "app.dialog.preloader('Title');\n" +
        "setTimeout(function() {\n" +
        "\tapp.dialog.close();\n" +
        "}, 3000);";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-dialog-progress', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "app.dialog.progress('Title');\n" +
        "setTimeout(function() {\n" +
        "\tapp.dialog.close();\n" +
        "}, 3000);";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-dialog-progress-percent', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
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
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});