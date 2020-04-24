/**
 * Welcome
 */

panel_left_morph();

var terminal_home = function() {
    term = new Terminal({
        fontFamily: 'Fira Code, Iosevka, monospace',
        fontSize: 12,
        experimentalCharAtlas: 'dynamic'
    });

    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    const terminalElem = document.getElementById('term');
    term.open(terminalElem);

    fitAddon.fit();

    const shell = process.env[os.platform() === 'win32' ? 'COMSPEC' : 'SHELL'];
    ptyProcess = pty.spawn(shell, [], {
        name: 'xterm-color',
        cols: term.cols,
        rows: term.rows,
        cwd: process.cwd(),
        env: process.env
    });

    term.onData(function(data) {
        ptyProcess.write(data);
    });

    term.onResize(function(size) {
        ptyProcess.resize(
            Math.max(size ? size.cols : term.cols, 1),
            Math.max(size ? size.rows : term.rows, 1)
        );
    });

    ptyProcess.on('data', function(data) {
        term.write(data);
    });
}

terminal_home();

$$(document).on('click', '#btn-reload', function() {
    app.preloader.show();

    window.location.reload();
});

$$(document).on('page:afterin', '.page[data-name="home"]', function(e) {
    panel_left_morph();

    var page_height = $$(document).find('.page-content').height();
    $$(document).find('#page-welcome').height(parseInt(page_height));
});

/**
 * Project
 */

$$(document).on('click', '#btn-application-new-electron', function() {
    app.dialog.prompt('Name', 'Create New Project', function(fileName) {
        navigate_main_to('/');

        app.progressbar.show('multi');

        var fileName = fileName.replace(/\s+/g, '_');

        var dir_visual7 = path.join(os.homedir(), 'Visual7/');
        var dir_project = path.join(dir_visual7, fileName);
        var dir_project_www = path.join(dir_project, 'www/');
        var dir_init = path.join(__dirname, 'init/');

        fs.readdir(dir_visual7, (err, dir) => {
            if (err) {
                fs.mkdirSync(dir_visual7);
                create_app();
            } else {
                create_app();
            }
        });

        function create_app() {
            fs.readdir(dir_project, (err, dir) => {
                if (err) {
                    mkdir(dir_project);
                    mkdir(dir_project_www);
                    mkdir(path.join(dir_project_www, 'file/'));

                    copy(path.join(__dirname, 'index.html'), path.join(dir_project_www, 'index.html'));
                    copy(path.join(__dirname, 'LICENSE'), path.join(dir_project_www, 'LICENSE'));
                    copy(path.join(dir_init, 'main.js'), path.join(dir_project, 'main.js'));
                    copy(path.join(dir_init, 'package.json'), path.join(dir_project, 'package.json'));

                    copyDir(path.join(__dirname, 'css/'), path.join(dir_project_www, 'css/'));
                    copyDir(path.join(__dirname, 'fonts/'), path.join(dir_project_www, 'fonts/'));
                    copyDir(path.join(__dirname, 'img/'), path.join(dir_project_www, 'img/'));
                    copyDir(path.join(__dirname, 'js/'), path.join(dir_project_www, 'js/'));
                    copyDir(path.join(__dirname, 'js_app/'), path.join(dir_project_www, 'js_app/'));
                    copyDir(path.join(__dirname, 'pages/'), path.join(dir_project_www, 'pages/'));
                    if (os.platform() === "darwin") {
                        copyDir(path.join(__dirname, '../build/'), path.join(dir_project, 'build/'));
                    }

                    list_project();

                    if (os.platform() === "darwin") {
                        app.progressbar.hide();

                        ptyProcess.write('cd ~\r');
                        ptyProcess.write('cd Visual7\r');
                        ptyProcess.write('cd ' + fileName + '\r');
                        ptyProcess.write('npm install -D electron@latest\r');
                        ptyProcess.write('npm install\r');
                        ptyProcess.write('cd ..');
                        ptyProcess.write('clear\r');
                    } else if (os.platform() === "linux") {
                        app.progressbar.hide();

                        ptyProcess.write('cd ~\r');
                        ptyProcess.write('cd Visual7\r');
                        ptyProcess.write('cd ' + fileName + '\r');
                        ptyProcess.write('npm install -D electron@latest\r');
                        ptyProcess.write('npm install\r');
                        ptyProcess.write('cd ..\r');
                        ptyProcess.write('clear\r');
                    } else {
                        app.progressbar.hide();

                        ptyProcess.write('cd %homepath%\r');
                        ptyProcess.write('cd Visual7\r');
                        ptyProcess.write('cd ' + fileName + '\r');
                        ptyProcess.write('npm install -D electron@latest\r');
                        ptyProcess.write('npm install\r');
                        ptyProcess.write('cd ..\r');
                        ptyProcess.write('cls\r');
                    }
                } else {
                    app.dialog.create({
                        title: '<span>Failed</span>',
                        text: 'Project Exist',
                        buttons: [{
                            text: '<span>Ok</span>'
                        }],
                        verticalButtons: false,
                        animate: false
                    }).open();
                }
            });
        }
    });
});

list_project();

function list_project() {
    fs.readdir(path.join(os.homedir(), 'Visual7/'), (err, dir) => {
        if (err) {
            var dir = path.join(os.homedir(), 'Visual7/');
            fs.mkdirSync(dir);
        } else {
            if (dir.length === 0) {
                //Do Nothing
            } else {
                $$(document).find('#list-file-project').empty();
                for (var i = 0; i < dir.length; i++) {
                    if (dir[i] === "NowDB Data Manager 1.1.0.exe" || dir[i] === "NowDB Data Manager Setup 1.1.0.exe" || dir[i] === "NowDB Data Manager-1.1.0.AppImage" || dir[i] === "NowDB Data Manager-1.1.0.dmg" || dir[i] === ".DS_Store") {
                        // Do Nothing
                    } else {
                        $$(document).find('#list-file-project').append(
                            '<li>' +
                            '   <div class="item-content item-link">' +
                            '       <div class="item-inner" id="btn-project-open" data-project="' + dir[i] + '">' +
                            '           <div class="item-title">' + dir[i] + '</div>' +
                            '       </div>' +
                            '   </div>' +
                            '</li>');
                    }
                }
            }
        }
    });
}

$$(document).on('click', '#btn-project-open', function() {
    var project = $$(this).attr('data-project');
    project_open_active = project;
    navigate_left_to('/project/' + project + '/');
    navigate_main_to('/editor/' + project + '/index.html/');
});

$$(document).on('click', '#btn-project-folder-open', function() {
    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    if (os.platform() === "darwin") {
        const { spawn } = require('child_process');
        let openTerminal = spawn('open', [dir_visual7]);
        openTerminal.on('error', (err) => { console.log(err); });
    } else if (os.platform() === "linux") {
        const { spawn } = require('child_process');
        let openTerminal = spawn('nautilus', [dir_visual7]);
        openTerminal.on('error', (err) => { console.log(err); });
    } else {
        const openExplorer = require('open-file-explorer');
        openExplorer(dir_visual7, err => {
            if (err) {
                console.log(err);
            }
        });
    }
});

$$(document).on('page:afterin', '.page[data-name="project"]', function(callback) {
    var project = callback.detail.route.params.name;

    $$(document).find('#project-name').html(project);
    $$(document).find('#btn-code-editor').attr('data-project', project);

    list_html(project);
    list_js(project);
    list_css(project);
    list_other(project);
});

$$(document).on('click', '#btn-app-run', function() {
    if (os.platform() === "darwin") {
        ptyProcessEditor.write('cd ~\r');
        ptyProcessEditor.write('cd Visual7\r');
        ptyProcessEditor.write('cd ' + project_open_active + '\r');
        ptyProcessEditor.write('electron .\r');
    } else if (os.platform() === "linux") {
        ptyProcessEditor.write('cd ~\r');
        ptyProcessEditor.write('cd Visual7\r');
        ptyProcessEditor.write('cd ' + project_open_active + '\r');
        ptyProcessEditor.write('electron .\r');
    } else {
        ptyProcessEditor.write('cd %homepath%\r');
        ptyProcessEditor.write('cd Visual7\r');
        ptyProcessEditor.write('cd ' + project_open_active + '\r');
        ptyProcessEditor.write('electron .\r');
    }
});

$$(document).on('click', '#btn-app-distribute', function() {
    if (os.platform() === "darwin") {
        ptyProcessEditor.write('cd ~\r');
        ptyProcessEditor.write('cd Visual7\r');
        ptyProcessEditor.write('cd ' + project_open_active + '\r');
        ptyProcessEditor.write('npm run dist\r');
    } else if (os.platform() === "linux") {
        ptyProcessEditor.write('cd ~\r');
        ptyProcessEditor.write('cd Visual7\r');
        ptyProcessEditor.write('cd ' + project_open_active + '\r');
        ptyProcessEditor.write('npm run dist\r');
    } else {
        ptyProcessEditor.write('cd %homepath%\r');
        ptyProcessEditor.write('cd Visual7\r');
        ptyProcessEditor.write('cd ' + project_open_active + '\r');
        ptyProcessEditor.write('npm run dist\r');
    }
});

$$(document).on('click', '#btn-app-dir', function() {
    if (os.platform() === "darwin") {
        ptyProcessEditor.write('cd ~/Visual/' + project_open_active + '\r');
        ptyProcessEditor.write('open .\r');
    } else if (os.platform() === "linux") {
        ptyProcessEditor.write('nautilus ~/Visual7/' + project_open_active + '\r');
    } else {
        ptyProcessEditor.write('cd %homepath%\r');
        ptyProcessEditor.write('cd Visual7\r');
        ptyProcessEditor.write('cd ' + project_open_active + '\r');
        ptyProcessEditor.write('explorer .\r');
    }
});

/**
 * Code Editor
 */

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

        $$(document).find('#btn-snippet-js-logic').hide();
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
        $$(document).find('#btn-snippet-js-logic').show();
    } else if (filename_split[fileext] === "css") {
        filepath = path.join(dir_project_www, 'css');
        filepath = path.join(filepath, filename_raw);
        filelang = 'css';

        $$(document).find('#btn-design-html').hide();
        $$(document).find('#btn-snippet-js-logic').hide();
    } else if (filename_split[fileext] === "json") {
        if (filename_split[0] === "package") {
            filepath = path.join(dir_project, filename_raw);
            filelang = 'json';
        }

        $$(document).find('#btn-design-html').hide();
        $$(document).find('#btn-snippet-js-logic').hide();
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
 * List Project File
 * @param {*} project 
 */

function list_html(project) {
    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project);
    var dir_project_www = path.join(dir_project, 'www/');

    fs.readdir(path.join(dir_project_www, 'pages/'), (err, dir) => {
        $$(document).find('#list-file-html-new').empty();
        if (dir.length === 0) {
            //Do Nothing
        } else {
            for (var i = 0; i < dir.length; i++) {
                let fileName = dir[i];
                if (fileName === '404.html' || fileName === 'about.html' || fileName === 'home.html') {
                    $$(document).find('#list-file-html-new').append(
                        '<div class="treeview-item" id="btn-code-editor" data-project="' + project + '" data-file="' + fileName + '" style="cursor: pointer;">' +
                        '    <div class="treeview-item-root">' +
                        '        <div class="treeview-item-content">' +
                        '            <i class="icon f7-icons">document_text_fill</i>' +
                        '            <div class="treeview-item-label">' + fileName + '</div>' +
                        '        </div>' +
                        '    </div>' +
                        '</div>');
                } else {
                    $$(document).find('#list-file-html-new').append(
                        '<div class="treeview-item" id="btn-code-editor" data-project="' + project + '" data-file="' + fileName + '" style="cursor: pointer;">' +
                        '    <div class="treeview-item-root">' +
                        '        <div class="treeview-item-content">' +
                        '            <i class="icon f7-icons">document_text_fill</i>' +
                        '            <div class="treeview-item-label">' + fileName + '</div>' +
                        '        </div>' +
                        '    </div>' +
                        '</div>');
                }
            }
        }
    });
}

function list_js(project) {
    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project);
    var dir_project_www = path.join(dir_project, 'www/');

    fs.readdir(path.join(dir_project_www, 'js_app/'), (err, dir) => {
        $$(document).find('#list-file-js-new').empty();
        if (dir.length === 0) {
            //Do Nothing
        } else {
            for (var i = 0; i < dir.length; i++) {
                let fileName = dir[i];
                if (fileName === 'constant.js' || fileName === 'init.js' || fileName === 'listener.js' || fileName === 'routes.js') {
                    $$(document).find('#list-file-js-new').append(
                        '<div class="treeview-item" id="btn-code-editor" data-project="' + project + '" data-file="' + fileName + '" style="cursor: pointer;">' +
                        '    <div class="treeview-item-root">' +
                        '        <div class="treeview-item-content">' +
                        '            <i class="icon f7-icons">document_text_fill</i>' +
                        '            <div class="treeview-item-label">' + fileName + '</div>' +
                        '        </div>' +
                        '    </div>' +
                        '</div>');
                } else {
                    $$(document).find('#list-file-js-new').append(
                        '<div class="treeview-item" id="btn-code-editor" data-project="' + project + '" data-file="' + fileName + '" style="cursor: pointer;">' +
                        '    <div class="treeview-item-root">' +
                        '        <div class="treeview-item-content">' +
                        '            <i class="icon f7-icons">document_text_fill</i>' +
                        '            <div class="treeview-item-label">' + fileName + '</div>' +
                        '        </div>' +
                        '    </div>' +
                        '</div>');
                }
            }
        }
    });
}

function list_css(project) {
    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project);
    var dir_project_www = path.join(dir_project, 'www/');

    fs.readdir(path.join(dir_project_www, 'css/'), (err, dir) => {
        $$(document).find('#list-file-css-new').empty();
        if (dir.length === 0) {
            //Do Nothing
        } else {
            for (var i = 0; i < dir.length; i++) {
                let fileName = dir[i];
                if (fileName === 'framework7-icons.css' || fileName === 'framework7.bundle.css' || fileName === 'framework7.bundle.min.css' || fileName === 'framework7.bundle.rtl.css' || fileName === 'framework7.bundle.rtl.min.css' || fileName === 'framework7.css' || fileName === 'framework7.min.css' || fileName === 'framework7.rtl.css' || fileName === 'framework7.rtl.min.css' || fileName === 'custom.css') {
                    $$(document).find('#list-file-css-new').append(
                        '<div class="treeview-item" id="btn-code-editor" data-project="' + project + '" data-file="' + fileName + '" style="cursor: pointer;">' +
                        '    <div class="treeview-item-root">' +
                        '        <div class="treeview-item-content">' +
                        '            <i class="icon f7-icons">document_text_fill</i>' +
                        '            <div class="treeview-item-label">' + fileName + '</div>' +
                        '        </div>' +
                        '    </div>' +
                        '</div>');
                } else {
                    $$(document).find('#list-file-css-new').append(
                        '<div class="treeview-item" id="btn-code-editor" data-project="' + project + '" data-file="' + fileName + '" style="cursor: pointer;">' +
                        '    <div class="treeview-item-root">' +
                        '        <div class="treeview-item-content">' +
                        '            <i class="icon f7-icons">document_text_fill</i>' +
                        '            <div class="treeview-item-label">' + fileName + '</div>' +
                        '        </div>' +
                        '    </div>' +
                        '</div>');
                }
            }
        }
    });
}

function list_other(project) {
    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project);
    var dir_project_www = path.join(dir_project, 'www/');

    fs.readdir(path.join(dir_project_www, 'file/'), (err, dir) => {
        $$(document).find('#list-file-other-new').empty();
        if (dir.length === 0) {
            //Do Nothing
        } else {
            for (var i = 0; i < dir.length; i++) {
                let fileName = dir[i];
                $$(document).find('#list-file-other').append(
                    '<li>' +
                    '    <div class="item-content">' +
                    '       <div class="item-media"><i class="material-icons text-color-red" id="btn-remove-other" data-file="' + fileName + '" style="cursor: pointer;">delete</i></div>' +
                    '       <div class="item-inner">' +
                    '       <div class="item-title">' + fileName + '</div>' +
                    '       </div>' +
                    '    </div>' +
                    '</li>');
                $$(document).find('#list-file-other-new').append(
                    '<div class="treeview-item">' +
                    '    <div class="treeview-item-root">' +
                    '        <div class="treeview-item-content">' +
                    '            <i class="icon f7-icons">document_text_fill</i>' +
                    '            <div class="treeview-item-label">' + fileName + '</div>' +
                    '        </div>' +
                    '    </div>' +
                    '</div>');
            }
        }
    });
}

/**
 * Create File 
 */

$$(document).on('click', '#btn-create-html', function() {
    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project_open_active);
    var dir_project_www = path.join(dir_project, 'www/');

    app.dialog.prompt('Filename', 'New HTML File', function(fileName) {
        fileType = fileName.split('.');
        if (fileType[1] !== 'html') {
            app.dialog.alert('Allow .html only', 'Information');
        } else if (fileType === null) {
            fs.writeFileSync(path.join(dir_project_www, 'pages/' + fileName + '.html'), '', 'utf-8');
            code_editor(project_open_active, fileName + '.html');
        } else {
            fs.writeFileSync(path.join(dir_project_www, 'pages/' + fileName), '', 'utf-8');
            code_editor(project_open_active, fileName);
        }

        list_html(project_open_active);

    });
});

$$(document).on('click', '#btn-create-js', function() {
    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project_open_active);
    var dir_project_www = path.join(dir_project, 'www/');

    app.dialog.prompt('Filename', 'New Javascript File', function(fileName) {
        fileType = fileName.split('.');
        if (fileType[1] !== 'js') {
            app.dialog.alert('Allow .js only', 'Information');
        } else if (fileType === null) {
            fs.writeFileSync(path.join(dir_project_www, 'js_app/' + fileName + '.js'), '', 'utf-8');
            code_editor(project_open_active, fileName + '.js');
        } else {
            fs.writeFileSync(path.join(dir_project_www, 'js_app/' + fileName), '', 'utf-8');
            code_editor(project_open_active, fileName);
        }

        list_js(project_open_active);
    });
});

$$(document).on('click', '#btn-create-css', function() {
    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project_open_active);
    var dir_project_www = path.join(dir_project, 'www/');

    app.dialog.prompt('Filename', 'New CSS File', function(fileName) {
        fileType = fileName.split('.');
        if (fileType[1] !== 'css') {
            app.dialog.alert('Allow .css only', 'Information');
        } else if (fileType === null) {
            fs.writeFileSync(path.join(dir_project_www, 'css/' + fileName + '.js'), '', 'utf-8');
            code_editor(project_open_active, fileName + '.css');
        } else {
            fs.writeFileSync(path.join(dir_project_www, 'css/' + fileName), '', 'utf-8');
            code_editor(project_open_active, fileName);
        }

        list_css(project_open_active);
    });
});

$$(document).on('click', '#btn-create-file', function() {
    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project_open_active);
    var dir_project_www = path.join(dir_project, 'www/');

    if (os.platform() === "darwin") {
        const { spawn } = require('child_process');
        let openTerminal = spawn('open', [dir_project_www]);
        openTerminal.on('error', (err) => { console.log(err); });
    } else if (os.platform() === "linux") {
        const { spawn } = require('child_process');
        let openTerminal = spawn('nautilus', [dir_project_www]);
        openTerminal.on('error', (err) => { console.log(err); });
    } else {
        const openExplorer = require('open-file-explorer');
        openExplorer(dir_project_www, err => {
            if (err) {
                console.log(err);
            }
        });
    }
});

$$(document).on('click', '#btn-remove-other', function() {
    var fileName = $$(this).attr('data-file');

    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project_open_active);
    var dir_project_www = path.join(dir_project, 'www/');

    app.dialog.create({
        title: 'Information',
        text: 'Remove This File <span>' + fileName + ' </span>?',
        buttons: [{
            text: '<span>cancel</span>'
        }, {
            text: '<span>Ok</span>',
            onClick: function() {
                fs.unlink(path.join(dir_project_www, 'file/' + fileName), function(err) {
                    if (err) return console.log(err);
                    list_other(project_open_active);
                });
            }
        }],
        verticalButtons: false,
        animate: false
    }).open();
});

/**
 * Keyboard Binding
 */

document.addEventListener('keydown', function(event) {
    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project_open_active);
    var dir_project_www = path.join(dir_project, 'www/');

    if (event.code == 'KeyS' && (event.ctrlKey || event.metaKey)) {
        page_history = app.views.main.history;
        page_count = page_history.length;
        page_current = page_history[page_count - 1];

        if (page_current.split('/')[1] === "designer") {
            var editor_html = editor.getHtml();
            var html = pretty(editor_html, { ocd: true });

            fs.writeFileSync(path.join(dir_project_www, 'pages/' + file_open_active), html, 'utf-8');

            window.localStorage.clear();
        } else if (page_current.split('/')[1] === "editor") {
            var editor_value = we.getValue();
            fs.writeFileSync(filepath_open_active, editor_value, 'utf-8');
        }

        app.toast.create({
            text: 'File Saved',
            position: 'center',
            closeTimeout: 2000
        }).open();
    }
});

/**
 * UI Designer
 */

$$(document).on('click', '#btn-design-html', function() {
    var project = $$(this).attr('data-project');
    var fileName = $$(this).attr('data-file');

    navigate_main_to('/designer/' + project + '/' + fileName + '/', false, false, false, false, false, false);
});

$$(document).on('page:afterin', '.page[data-name="designer"]', function(callback) {
    panel_left_morph();

    window.localStorage.clear();

    var project = callback.detail.route.params.project;
    var filename = callback.detail.route.params.filename;
    file_open_active = filename;

    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project);
    var dir_project_www = path.join(dir_project, 'www/');

    $$(document).find('#page-title').html(filename);

    app.preloader.show();

    editor = grapesjs.init({
        container: '#gjs',
        height: '100%',
        canvas: {
            styles: [path.join(__dirname, 'css/framework7.bundle.css'), path.join(__dirname, 'css/framework7-icons.css'), path.join(__dirname, 'fonts/material-icons.css'), path.join(dir_project_www, 'css/custom.css')],
            scripts: [path.join(__dirname, 'js/framework7.bundle.min.js'), path.join(__dirname, 'designer/js/init_designer.js')]
        },
        allowScripts: 1
    });

    var config = editor.getConfig();

    config.showDevices = 0;

    editor.setDevice('Mobile portrait');

    var panel = editor.Panels;
    panel.getPanels().reset([{
        id: 'views',
        buttons: [{
            id: 'open-blocks',
            command: 'open-blocks',
            active: true,
            className: 'fa fa-th-large',
            attributes: {
                title: 'Components'
            }
        }, {
            id: 'open-layers',
            command: 'open-layers',
            className: 'fa fa-bars',
            attributes: {
                title: 'Layers'
            }
        }, {
            id: 'open-sm',
            command: 'open-sm',
            className: 'fa fa-paint-brush',
            attributes: {
                title: 'Styles'
            }
        }, {
            id: 'open-tm',
            command: 'open-tm',
            className: 'fa fa-cog',
            attributes: {
                title: 'Configuration'
            }
        }]
    }]);

    blockManager = editor.BlockManager;
    require('./designer/grapesjs/block/button.js');
    require('./designer/grapesjs/block/card.js');
    require('./designer/grapesjs/block/chiptag.js');
    require('./designer/grapesjs/block/fab.js');
    require('./designer/grapesjs/block/form.js');
    require('./designer/grapesjs/block/form_item.js');
    require('./designer/grapesjs/block/form_item_float.js');
    require('./designer/grapesjs/block/grid.js');
    require('./designer/grapesjs/block/grid_no_gap.js');
    require('./designer/grapesjs/block/grid_responsive.js');
    require('./designer/grapesjs/block/layout.js');
    require('./designer/grapesjs/block/list.js');
    require('./designer/grapesjs/block/list_media.js');
    require('./designer/grapesjs/block/list_sortable.js');
    require('./designer/grapesjs/block/list_view_accordion.js');
    require('./designer/grapesjs/block/messages.js');
    require('./designer/grapesjs/block/navbar.js');
    require('./designer/grapesjs/block/popover.js');
    require('./designer/grapesjs/block/progress_bar.js');
    require('./designer/grapesjs/block/range_slider.js');
    require('./designer/grapesjs/block/screen.js');
    require('./designer/grapesjs/block/searchbar.js');
    require('./designer/grapesjs/block/smart_select.js');
    require('./designer/grapesjs/block/stepper.js');
    require('./designer/grapesjs/block/swipeout.js');
    require('./designer/grapesjs/block/swiper.js');
    require('./designer/grapesjs/block/table.js');
    require('./designer/grapesjs/block/table_card.js');
    require('./designer/grapesjs/block/timeline.js');
    require('./designer/grapesjs/block/toolbar.js');
    require('./designer/grapesjs/block/toolbar_bottom_with_badge.js');

    fs.readFile(path.join(dir_project_www, 'pages/' + filename), 'utf-8', (err, cb_data) => {
        if (err) {
            console.log(err);
            return;
        }

        app.preloader.hide();

        editor.setComponents(cb_data);
    });

    delete require.cache[require.resolve('./designer/grapesjs/block/button.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/card.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/chiptag.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/fab.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/form.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/form_item.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/form_item_float.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/grid.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/grid_no_gap.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/grid_responsive.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/layout.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/list.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/list_media.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/list_sortable.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/list_view_accordion.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/messages.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/navbar.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/popover.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/progress_bar.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/range_slider.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/screen.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/searchbar.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/smart_select.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/stepper.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/swipeout.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/swiper.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/table.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/table_card.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/timeline.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/toolbar.js')];
    delete require.cache[require.resolve('./designer/grapesjs/block/toolbar_bottom_with_badge.js')];
});

$$(document).on('click', '#btn-save-design', function() {
    var editor_html = editor.getHtml();
    var html = pretty(editor_html, { ocd: true });

    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project_open_active);
    var dir_project_www = path.join(dir_project, 'www/');

    fs.writeFileSync(path.join(dir_project_www, 'pages/' + file_open_active), html, 'utf-8');

    app.toast.create({
        text: 'File Saved',
        position: 'center',
        closeTimeout: 2000
    }).open();
});

$$(document).on('click', '#btn-design-undo', function() {
    editor.UndoManager.undo(1);
});

$$(document).on('click', '#btn-design-redo', function() {
    editor.UndoManager.redo(1);
});

$$(document).on('click', '#btn-design-clear', function() {
    app.dialog.create({
        title: 'Information',
        text: 'Do you want to clear all design?',
        buttons: [{
            text: '<span>Cancel</span>'
        }, {
            text: '<span>Ok</span>',
            onClick: function() {
                editor.DomComponents.clear();

                window.localStorage.clear();
            }
        }],
        verticalButtons: false,
        animate: false
    }).open();
});

$$(document).on('click', '#btn-design-preview', function() {
    editor.runCommand('preview');
});

$$(document).on('click', '#btn-design-code', function() {
    editor.runCommand('export-template');
});

$$(document).on('click', '#btn-design-computer', function() {
    editor.setDevice('Desktop');
});

$$(document).on('click', '#btn-design-tablet', function() {
    editor.setDevice('Tablet');
});

$$(document).on('click', '#btn-design-smartphone', function() {
    editor.setDevice('Mobile portrait');
});

$$(document).on('click', '#btn-design-outline', function() {
    editor.runCommand('sw-visibility');
    $$(document).find('#btn-design-unoutline').show();
    $$(document).find('#btn-design-outline').hide();
});

$$(document).on('click', '#btn-design-unoutline', function() {
    editor.stopCommand('sw-visibility');
    $$(document).find('#btn-design-unoutline').hide();
    $$(document).find('#btn-design-outline').show();
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

/**
 * NowDB Data Manager
 */

$$(document).on('click', '#btn-nowdb-windows-portable', function() {
    var dir_visual7 = path.join(os.homedir(), 'Visual7/')
    downloadNowDB("https://github.com/NowDB/Data-Manager/blob/master/NowDB%20Data%20Manager%201.1.0.exe?raw=true", path.join(dir_visual7, 'NowDB Data Manager 1.1.0.exe'));
});

$$(document).on('click', '#btn-nowdb-windows-installer', function() {
    var dir_visual7 = path.join(os.homedir(), 'Visual7/')
    downloadNowDB("https://github.com/NowDB/Data-Manager/blob/master/NowDB%20Data%20Manager%20Setup%201.1.0.exe?raw=true", path.join(dir_visual7, 'NowDB Data Manager Setup 1.1.0.exe'));
});

$$(document).on('click', '#btn-nowdb-macos-installer', function() {
    var dir_visual7 = path.join(os.homedir(), 'Visual7/')
    downloadNowDB("https://github.com/NowDB/Data-Manager/blob/master/NowDB%20Data%20Manager-1.1.0.dmg?raw=true", path.join(dir_visual7, 'NowDB Data Manager-1.1.0.dmg'));
});

$$(document).on('click', '#btn-nowdb-linux-portable', function() {
    var dir_visual7 = path.join(os.homedir(), 'Visual7/')
    downloadNowDB("https://github.com/NowDB/Data-Manager/blob/master/NowDB%20Data%20Manager-1.1.0.AppImage?raw=true", path.join(dir_visual7, 'NowDB Data Manager-1.1.0.AppImage'));
});

function downloadNowDB(file_url, targetPath) {
    dialog_nowdb = app.dialog.progress('<i class="material-icons">get_app</i>', progress_nowdb);
    dialog_nowdb.setText('0 of 100%');

    var received_bytes = 0;
    var total_bytes = 0;

    var req = request({
        method: 'GET',
        uri: file_url
    });

    var out = fs.createWriteStream(targetPath);
    req.pipe(out);

    req.on('response', function(data) {
        total_bytes = parseInt(data.headers['content-length']);
    });

    req.on('data', function(chunk) {
        received_bytes += chunk.length;

        showProgress(received_bytes, total_bytes);
    });

    req.on('end', function() {
        dialog_nowdb.close();

        if (os.platform() === "darwin") {
            ptyProcess.write('open ~/Visual7\r');
        } else if (os.platform() === "linux") {
            ptyProcess.write('nautilus ~/Visual7\r');
        } else {
            ptyProcess.write('cd %homepath%\r');
            ptyProcess.write('cd Visual7\r');
            ptyProcess.write('explorer .\r');
        }
    });
}

function showProgress(received, total) {
    var percentage = (received * 100) / total;
    var percent = Math.round(percentage).toFixed(0);
    dialog_nowdb.setProgress(percent);
    dialog_nowdb.setText(percent + ' of 100%');
    // console.log(percentage + "% | " + received + " bytes out of " + total + " bytes.");
}