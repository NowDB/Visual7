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

    term.setOption('theme', { background: '#1e1e1e' });

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

                    // Depedencies (F7 and Other)
                    copyDir(path.join(__dirname, 'css/'), path.join(dir_project_www, 'css/'));
                    copyDir(path.join(__dirname, 'fonts/'), path.join(dir_project_www, 'fonts/'));
                    copyDir(path.join(__dirname, 'img/'), path.join(dir_project_www, 'img/'));
                    copyDir(path.join(__dirname, 'js/'), path.join(dir_project_www, 'js/'));
                    copy(path.join(__dirname, 'LICENSE'), path.join(dir_project_www, 'LICENSE'));

                    if (os.platform() === "darwin") {
                        copyDir(path.join(__dirname, '../build/'), path.join(dir_project, 'build/'));
                    }

                    // Template
                    copy(path.join(path.join(path.join(__dirname, 'sample/'), 'basic/'), 'index.html'), path.join(dir_project_www, 'index.html'));
                    copy(path.join(path.join(path.join(__dirname, 'sample/'), 'basic/'), 'main.js'), path.join(dir_project, 'main.js'));
                    copy(path.join(path.join(path.join(__dirname, 'sample/'), 'basic/'), 'package.json'), path.join(dir_project, 'package.json'));
                    copyDir(path.join(path.join(path.join(__dirname, 'sample/'), 'basic/'), 'js_app/'), path.join(dir_project_www, 'js_app/'));
                    copyDir(path.join(path.join(path.join(__dirname, 'sample/'), 'basic/'), 'pages/'), path.join(dir_project_www, 'pages/'));

                    // Finilization
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
            editor_value = editor.getHtml();
            editor_value = pretty(editor_value, { ocd: true });

            fs.writeFileSync(path.join(dir_project_www, 'pages/' + file_open_active), editor_value, 'utf-8');

            code_editor(project_open_active, file_open_active);

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