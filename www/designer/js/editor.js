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
                        value: '\n' + code_data,
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
    var project = project_open_active;
    var filename = $$(this).attr('data-file');
    file_open_active = filename;

    page_history = app.views.main.history;
    page_count = page_history.length;
    page_current = page_history[page_count - 1];

    if (page_current.split('/')[1] === "designer") {
        navigate_main_back();
    }

    code_editor(project, filename);
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

$$(document).on('click', '#btn-code-save', function() {
    var editor_value = we.getValue();
    fs.writeFileSync(filepath_open_active, editor_value, 'utf-8');
    app.toast.create({
        text: 'File Saved',
        position: 'center',
        closeTimeout: 2000
    }).open();
});

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
        "\tconsole.log(callback.detail.route.params)\n" +
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
        "\tconsole.log(callback.detail.route.params)\n" +
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
        "\tconsole.log(callback.detail.route.params)\n" +
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
        "\tconsole.log(callback.detail.route.params)\n" +
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
        "\tconsole.log(callback.detail.route.params)\n" +
        "});";
    splitedText[position.lineNumber - 1] = [lineContent.slice(0, position.column - 1), textToInsert, lineContent.slice(position.column - 1)].join(''); // Append the text exactly at the selected position (position.column -1)
    we.setValue(splitedText.join("\n"));
    we.setPosition(position);
});

$$(document).on('click', '#code-page-out', function() {
    app.popover.close();

    var position = we.getPosition();
    var text = we.getValue(position);
    var splitedText = text.split("\n");
    var lineContent = splitedText[position.lineNumber - 1];
    var textToInsert = "$$(document).on('page:out', '.page[data-name=\"your_page_name\"]', function(callback) {\n" +
        "\tconsole.log(callback.detail.route.params)\n" +
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