$$(document).on('click', '#btn-reload', function() {
    app.preloader.show();

    window.location.reload();
});

file_list_html();
file_list_js();
file_list_css();
file_list_other();

function file_list_html() {
    fs.readdir(path.join(__dirname, 'pages/'), (err, dir) => {
        $$(document).find('#list-file-html').empty();
        $$(document).find('#list-file-html').append(
            '<li style="color: rgba(0, 0, 0, 0.54);background-color: #f4f4f4;cursor: pointer;" id="btn-create-html">' +
            '   <div class="item-content">' +
            '       <div class="item-inner">' +
            '           <div class="item-title text-color-teal">pages/</div>' +
            '           <div class="item-after"><i class="material-icons text-color-deeporange">add</i></div>' +
            '       </div>' +
            '   </div>' +
            '</li>');
        if (dir.length === 0) {
            //Do Nothing
        } else {
            for (var i = 0; i < dir.length; i++) {
                let fileName = dir[i];
                if (fileName === '404.html' || fileName === 'about.html' || fileName === 'home.html') {
                    $$(document).find('#list-file-html').append(
                        '<li>' +
                        '   <div class="item-content">' +
                        '       <div class="item-media"><i class="material-icons text-color-gray">delete</i></div>' +
                        '       <div class="item-inner">' +
                        '           <div class="item-title">' + fileName + '</div>' +
                        '           <div class="item-after">' +
                        '               <i title="UI Designer" class="material-icons" id="btn-design-html" data-file="' + fileName + '" style="cursor: pointer;margin-right:10px;">web</i>' +
                        '               <i title="Code Editor" class="material-icons" id="btn-code-html-2" data-file="' + fileName + '" style="cursor: pointer;">code</i>' +
                        '           </div>' +
                        '       </div>' +
                        '   </div>' +
                        '</li>');
                } else {
                    $$(document).find('#list-file-html').append(
                        '<li>' +
                        '   <div class="item-content">' +
                        '       <div class="item-media"><i class="material-icons text-color-red" id="btn-remove-html" data-file="' + fileName + '" style="cursor: pointer;">delete</i></div>' +
                        '       <div class="item-inner">' +
                        '           <div class="item-title">' + fileName + '</div>' +
                        '           <div class="item-after">' +
                        '               <i title="UI Designer" class="material-icons" id="btn-design-html" data-file="' + fileName + '" style="cursor: pointer;margin-right:10px;">web</i>' +
                        '               <i title="Code Editor" class="material-icons" id="btn-code-html-2" data-file="' + fileName + '" style="cursor: pointer;">code</i>' +
                        '           </div>' +
                        '       </div>' +
                        '   </div>' +
                        '</li>');
                }
            }
        }
    });
}

function file_list_js() {
    fs.readdir(path.join(__dirname, 'js_app/'), (err, dir) => {
        $$(document).find('#list-file-js').empty();
        $$(document).find('#list-file-js').append(
            '<li style="color: rgba(0, 0, 0, 0.54);background-color: #f4f4f4;cursor: pointer;" id="btn-create-js">' +
            '   <div class="item-content">' +
            '       <div class="item-inner">' +
            '           <div class="item-title text-color-teal">js_app/</div>' +
            '           <div class="item-after"><i class="material-icons text-color-deeporange">add</i></div>' +
            '       </div>' +
            '   </div>' +
            '</li>');
        if (dir.length === 0) {
            //Do Nothing
        } else {
            for (var i = 0; i < dir.length; i++) {
                let fileName = dir[i];
                if (fileName === 'constant.js' || fileName === 'init.js' || fileName === 'listener.js' || fileName === 'routes.js') {
                    $$(document).find('#list-file-js').append(
                        '<li>' +
                        '   <div class="item-content">' +
                        '       <div class="item-media"><i class="material-icons text-color-gray">delete</i></div>' +
                        '       <div class="item-inner">' +
                        '           <div class="item-title">' + fileName + '</div>' +
                        '           <div class="item-after">' +
                        '               <i title="Code Editor" class="material-icons" id="btn-code-js-2" data-file="' + fileName + '" style="cursor: pointer;">code</i>' +
                        '           </div>' +
                        '        </div>' +
                        '   </div>' +
                        '</li>');
                } else {
                    $$(document).find('#list-file-js').append(
                        '<li>' +
                        '   <div class="item-content">' +
                        '       <div class="item-media"><i class="material-icons text-color-red" id="btn-remove-js" data-file="' + fileName + '" style="cursor: pointer;">delete</i></div>' +
                        '       <div class="item-inner">' +
                        '           <div class="item-title">' + fileName + '</div>' +
                        '           <div class="item-after">' +
                        '               <i title="Code Editor" class="material-icons" id="btn-code-js-2" data-file="' + fileName + '" style="cursor: pointer;">code</i>' +
                        '           </div>' +
                        '        </div>' +
                        '   </div>' +
                        '</li>');
                }
            }
        }
    });
}

function file_list_css() {
    fs.readdir(path.join(__dirname, 'css/'), (err, dir) => {
        $$(document).find('#list-file-css').empty();
        $$(document).find('#list-file-css').append(
            '<li style="color: rgba(0, 0, 0, 0.54);background-color: #f4f4f4;cursor: pointer;" id="btn-create-css">' +
            '   <div class="item-content">' +
            '       <div class="item-inner">' +
            '           <div class="item-title text-color-teal">css/</div>' +
            '           <div class="item-after"><i class="material-icons text-color-deeporange">add</i></div>' +
            '       </div>' +
            '   </div>' +
            '</li>');
        if (dir.length === 0) {
            //Do Nothing
        } else {
            for (var i = 0; i < dir.length; i++) {
                let fileName = dir[i];
                if (fileName === 'framework7-icons.css' || fileName === 'framework7.bundle.css' || fileName === 'framework7.bundle.min.css' || fileName === 'framework7.bundle.rtl.css' || fileName === 'framework7.bundle.rtl.min.css' || fileName === 'framework7.css' || fileName === 'framework7.min.css' || fileName === 'framework7.rtl.css' || fileName === 'framework7.rtl.min.css' || fileName === 'custom.css') {
                    $$(document).find('#list-file-css').append(
                        '<li>' +
                        '   <div class="item-content">' +
                        '       <div class="item-media"><i class="material-icons text-color-gray">delete</i></div>' +
                        '       <div class="item-inner">' +
                        '           <div class="item-title">' + fileName + '</div>' +
                        '           <div class="item-after">' +
                        // '               <i title="Code Editor" class="material-icons" id="btn-code-css" data-file="' + fileName + '" style="cursor: pointer;">code</i>' +
                        '               <i title="Code Editor" class="material-icons" id="btn-code-css-2" data-file="' + fileName + '" style="cursor: pointer;">code</i>' +
                        '           </div>' +
                        '        </div>' +
                        '   </div>' +
                        '</li>');
                } else {
                    $$(document).find('#list-file-css').append(
                        '<li>' +
                        '   <div class="item-content">' +
                        '       <div class="item-media"><i class="material-icons text-color-red" id="btn-remove-css" data-file="' + fileName + '" style="cursor: pointer;">delete</i></div>' +
                        '       <div class="item-inner">' +
                        '           <div class="item-title">' + fileName + '</div>' +
                        '           <div class="item-after">' +
                        // '               <i title="Code Editor" class="material-icons" id="btn-code-css" data-file="' + fileName + '" style="cursor: pointer;">code</i>' +
                        '               <i title="Code Editor" class="material-icons" id="btn-code-css-2" data-file="' + fileName + '" style="cursor: pointer;">code</i>' +
                        '           </div>' +
                        '        </div>' +
                        '   </div>' +
                        '</li>');
                }
            }
        }
    });
}

function file_list_other() {
    fs.readdir(path.join(__dirname, 'file/'), (err, dir) => {
        $$(document).find('#list-file-other').empty();
        $$(document).find('#list-file-other').append(
            '<li style="color: rgba(0, 0, 0, 0.54);background-color: #f4f4f4;cursor: pointer;" id="btn-create-file">' +
            '   <div class="item-content">' +
            '       <div class="item-inner">' +
            '           <div class="item-title text-color-teal">file/</div>' +
            '           <div class="item-after"><i class="material-icons text-color-deeporange">add</i></div>' +
            '       </div>' +
            '   </div>' +
            '</li>');
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
            }
        }
    });
}

$$(document).on('page:afterin', '.page[data-name="home"]', function(e) {
    panel_left_morph();
});

$$(document).on('click', '#btn-app-run', function() {
    let runWindow

    runWindow = new BrowserWindow({
        width: 400,
        height: 650,
        frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        },
        icon: path.join(__dirname, '/www/img/256x256.png')
    });

    runWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
});

$$(document).on('click', '#btn-app-run-debug', function() {
    let runWindow

    runWindow = new BrowserWindow({
        width: 400,
        height: 650,
        frame: false,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        },
        icon: path.join(__dirname, '/www/img/256x256.png')
    });

    runWindow.webContents.openDevTools({ mode: 'detach' });

    runWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));
});

$$(document).on('click', '#btn-create-html', function() {
    app.dialog.prompt('Filename', 'New HTML File', function(fileName) {
        fileType = fileName.split('.');
        if (fileType[1] !== 'html') {
            app.dialog.alert('Allow .html only', 'Information');
        } else if (fileType === null) {
            fs.writeFileSync(path.join(__dirname, 'pages/' + fileName + '.html'), '', 'utf-8');
        } else {
            fs.writeFileSync(path.join(__dirname, 'pages/' + fileName), '', 'utf-8');
        }
        file_list_html();
        file_list_js();
        file_list_css();
        file_list_other();
    });
});

$$(document).on('click', '#btn-create-js', function() {
    app.dialog.prompt('Filename', 'New Javascript File', function(fileName) {
        fileType = fileName.split('.');
        if (fileType[1] !== 'js') {
            app.dialog.alert('Allow .js only', 'Information');
        } else if (fileType === null) {
            fs.writeFileSync(path.join(__dirname, 'js_app/' + fileName + '.js'), '', 'utf-8');
        } else {
            fs.writeFileSync(path.join(__dirname, 'js_app/' + fileName), '', 'utf-8');
        }
        file_list_html();
        file_list_js();
        file_list_css();
        file_list_other();
    });
});

$$(document).on('click', '#btn-create-css', function() {
    app.dialog.prompt('Filename', 'New CSS File', function(fileName) {
        fileType = fileName.split('.');
        if (fileType[1] !== 'css') {
            app.dialog.alert('Allow .css only', 'Information');
        } else if (fileType === null) {
            fs.writeFileSync(path.join(__dirname, 'css/' + fileName + '.js'), '', 'utf-8');
        } else {
            fs.writeFileSync(path.join(__dirname, 'css/' + fileName), '', 'utf-8');
        }
        file_list_html();
        file_list_js();
        file_list_css();
        file_list_other();
    });
});

$$(document).on('click', '#btn-create-file', function() {
    dialog.showOpenDialog(function(fileName) {
        if (fileName === undefined) {
            app.dialog.alert("No file selected");
        } else {
            readFile(fileName[0]);
        }
    });

    function readFile(filepath) {
        fs.readFile(filepath, 'utf-8', (err, data) => {
            if (err) {
                alert("An error ocurred reading the file :" + err.message)
                return
            }
            let namefile = filepath.replace(/^.*[\\\/]/, '');
            fs.writeFileSync(path.join(__dirname, 'file/' + namefile), data, 'utf-8');
            file_list_html();
            file_list_js();
            file_list_css();
            file_list_other();
        })
    }
});

$$(document).on('click', '#btn-code-html-index', function() {
    var fileName = $$(this).attr('data-file');

    navigate_main_to('/editor_html_index/' + fileName + '/', false, false, false, true, true, false);
});

$$(document).on('page:afterin', '.page[data-name="editor_html_index"]', function(callback) {
    panel_left_morph();

    var filename = callback.detail.route.params.filename;
    file_open_active = filename;

    $$(document).find('#page-title').html(filename);

    self.module = undefined;

    fs.readFile(path.join(__dirname, filename), 'utf-8', (err, code_data) => {
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
                    monaco.editor.defineTheme(callback.base, {
                        base: callback.base,
                        inherit: true,
                        rules: [callback.rules],
                        colors: callback.colors
                    });
                    monaco.editor.setTheme(callback.base);

                    window.editor = monaco.editor.create(document.getElementById('container'), {
                        value: [code_data].join('\n'),
                        language: 'html'
                    });
                });

                app.preloader.hide();
            });
        }
    });
});

$$(document).on('click', '#btn-save-html-index', function() {
    var editor_html = we.getValue();
    fs.writeFileSync(path.join(__dirname, file_open_active), editor_html, 'utf-8');
    app.dialog.create({
        title: 'Information',
        text: 'File Saved',
        buttons: [{
            text: '<span class="text-color-teal">Ok</span>',
        }],
        verticalButtons: false,
        animate: false
    }).open();
});

$$(document).on('click', '#btn-code-html-2', function() {
    var fileName = $$(this).attr('data-file');

    navigate_main_to('/editor_html/' + fileName + '/', false, false, false, true, true, false);
});

$$(document).on('page:afterin', '.page[data-name="editor_html"]', function(callback) {
    panel_left_morph();

    var filename = callback.detail.route.params.filename;
    file_open_active = filename;

    $$(document).find('#page-title').html(filename);

    self.module = undefined;

    fs.readFile(path.join(__dirname, 'pages/' + filename), 'utf-8', (err, code_data) => {
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
                    monaco.editor.defineTheme(callback.base, {
                        base: callback.base,
                        inherit: true,
                        rules: [callback.rules],
                        colors: callback.colors
                    });
                    monaco.editor.setTheme(callback.base);

                    window.editor = monaco.editor.create(document.getElementById('container'), {
                        value: [code_data].join('\n'),
                        language: 'html'
                    });
                });

                app.preloader.hide();
            });
        }
    });
});

$$(document).on('click', '#btn-save-html', function() {
    var editor_html = we.getValue();
    fs.writeFileSync(path.join(__dirname, 'pages/' + file_open_active), editor_html, 'utf-8');
    app.dialog.create({
        title: 'Information',
        text: 'File Saved',
        buttons: [{
            text: '<span class="text-color-teal">Ok</span>',
        }],
        verticalButtons: false,
        animate: false
    }).open();
});

$$(document).on('click', '#btn-code-js-2', function() {
    var fileName = $$(this).attr('data-file');

    navigate_main_to('/editor_js/' + fileName + '/', false, false, false, true, true, false);
});

$$(document).on('page:afterin', '.page[data-name="editor_js"]', function(callback) {
    panel_left_morph();

    var filename = callback.detail.route.params.filename;
    file_open_active = filename;

    $$(document).find('#page-title').html(filename);

    self.module = undefined;

    fs.readFile(path.join(__dirname, 'js_app/' + filename), 'utf-8', (err, code_data) => {
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
                        value: [code_data].join('\n'),
                        language: 'javascript'
                    });
                });

                app.preloader.hide();
            });
        }
    });
});

$$(document).on('click', '#btn-save-js', function() {
    var editor_js = we.getValue();
    fs.writeFileSync(path.join(__dirname, 'js_app/' + file_open_active), editor_js, 'utf-8');
    app.dialog.create({
        title: 'Information',
        text: 'File Saved',
        buttons: [{
            text: '<span class="text-color-teal">Ok</span>',
        }],
        verticalButtons: false,
        animate: false
    }).open();
});

$$(document).on('click', '#btn-code-css-2', function() {
    var fileName = $$(this).attr('data-file');

    navigate_main_to('/editor_css/' + fileName + '/', false, false, false, true, true, false);
});

$$(document).on('page:afterin', '.page[data-name="editor_css"]', function(callback) {
    panel_left_morph();

    var filename = callback.detail.route.params.filename;
    file_open_active = filename;

    $$(document).find('#page-title').html(filename);

    self.module = undefined;

    fs.readFile(path.join(__dirname, 'css/' + filename), 'utf-8', (err, code_data) => {
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
                    monaco.editor.defineTheme(callback.base, {
                        base: callback.base,
                        inherit: true,
                        rules: [callback.rules],
                        colors: callback.colors
                    });
                    monaco.editor.setTheme(callback.base);

                    window.editor = monaco.editor.create(document.getElementById('container'), {
                        value: [code_data].join('\n'),
                        language: 'css'
                    });
                });

                app.preloader.hide();
            });
        }
    });
});

$$(document).on('click', '#btn-save-css', function() {
    var editor_js = we.getValue();
    fs.writeFileSync(path.join(__dirname, 'css/' + file_open_active), editor_js, 'utf-8');
    app.dialog.create({
        title: 'Information',
        text: 'File Saved',
        buttons: [{
            text: '<span class="text-color-teal">Ok</span>',
        }],
        verticalButtons: false,
        animate: false
    }).open();
});

$$(document).on('click', '#btn-remove-html', function() {
    var fileName = $$(this).attr('data-file');

    app.dialog.create({
        title: 'Information',
        text: 'Remove This File <span class="text-color-red">' + fileName + ' </span>?',
        buttons: [{
            text: '<span class="text-color-red">cancel</span>'
        }, {
            text: '<span class="text-color-teal">Ok</span>',
            onClick: function() {
                fs.unlink(path.join(__dirname, 'pages/' + fileName), function(err) {
                    if (err) return console.log(err);
                    file_list_html();
                    file_list_js();
                    file_list_css();
                    file_list_other();

                    navigate_main_to('/');
                });
            }
        }],
        verticalButtons: false,
        animate: false
    }).open();
});

$$(document).on('click', '#btn-remove-js', function() {
    var fileName = $$(this).attr('data-file');

    app.dialog.create({
        title: 'Information',
        text: 'Remove This File <span class="text-color-red">' + fileName + ' </span>?',
        buttons: [{
            text: '<span class="text-color-red">cancel</span>'
        }, {
            text: '<span class="text-color-teal">Ok</span>',
            onClick: function() {
                fs.unlink(path.join(__dirname, 'js_app/' + fileName), function(err) {
                    if (err) return console.log(err);
                    file_list_html();
                    file_list_js();
                    file_list_css();
                    file_list_other();

                    navigate_main_to('/');
                });
            }
        }],
        verticalButtons: false,
        animate: false
    }).open();
});

$$(document).on('click', '#btn-remove-css', function() {
    var fileName = $$(this).attr('data-file');

    app.dialog.create({
        title: 'Information',
        text: 'Remove This File <span class="text-color-red">' + fileName + ' </span>?',
        buttons: [{
            text: '<span class="text-color-red">cancel</span>'
        }, {
            text: '<span class="text-color-teal">Ok</span>',
            onClick: function() {
                fs.unlink(path.join(__dirname, 'css/' + fileName), function(err) {
                    if (err) return console.log(err);
                    file_list_html();
                    file_list_js();
                    file_list_css();
                    file_list_other();

                    navigate_main_to('/');
                });
            }
        }],
        verticalButtons: false,
        animate: false
    }).open();
});

$$(document).on('click', '#btn-remove-other', function() {
    var fileName = $$(this).attr('data-file');

    app.dialog.create({
        title: 'Information',
        text: 'Remove This File <span class="text-color-red">' + fileName + ' </span>?',
        buttons: [{
            text: '<span class="text-color-red">cancel</span>'
        }, {
            text: '<span class="text-color-teal">Ok</span>',
            onClick: function() {
                fs.unlink(path.join(__dirname, 'file/' + fileName), function(err) {
                    if (err) return console.log(err);
                    file_list_html();
                    file_list_js();
                    file_list_css();
                    file_list_other();
                });
            }
        }],
        verticalButtons: false,
        animate: false
    }).open();
});

$$(document).on('click', '#btn-app-nowdb', function() {
    var executablePath = null;

    if (app.device.os === "windows") {
        var executablePath = path.join(__dirname, 'nowdb/NowDB Data Manager-1.1.0.exe');
        fs.stat(executablePath, function fsStat(err, stats) {
            if (err) {
                app.dialog.create({
                    title: 'Information',
                    text: 'NowDB Data Manager is Not Available',
                    buttons: [{
                        text: '<span class="text-color-red">Later</span>'
                    }, {
                        text: '<span class="text-color-teal">Download</span>',
                        onClick: function() {
                            downloadNowDB("https://github.com/taufiksu/NowDB-Data-Manager-Release/raw/master/NowDB%20Data%20Manager%201.1.0.exe", path.join(__dirname, 'nowdb/NowDB Data Manager-1.1.0.exe'));
                        }
                    }],
                    verticalButtons: false,
                    animate: false
                }).open();
            } else {
                var child = require('child_process').execFile;
                child(executablePath, function(err, data) {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    console.log(data.toString());
                });
            }
        });
    } else if (app.device.os === "macos") {
        var executablePath = path.join(__dirname, 'nowdb/NowDB Data Manager-1.1.0.dmg');
        fs.stat(executablePath, function fsStat(err, stats) {
            if (err) {
                app.dialog.create({
                    title: 'Information',
                    text: 'NowDB Data Manager is Not Available',
                    buttons: [{
                        text: '<span class="text-color-red">Later</span>'
                    }, {
                        text: '<span class="text-color-teal">Download</span>',
                        onClick: function() {
                            downloadNowDB("https://github.com/taufiksu/NowDB-Data-Manager-Release/raw/master/NowDB%20Data%20Manager-1.1.0.dmg", path.join(__dirname, 'nowdb/NowDB Data Manager-1.1.0.dmg'));
                        }
                    }],
                    verticalButtons: false,
                    animate: false
                }).open();
            } else {
                var child = require('child_process').execFile;
                child(executablePath, function(err, data) {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    console.log(data.toString());
                });
            }
        });
    } else {
        var executablePath = path.join(__dirname, 'nowdb/NowDB Data Manager-1.1.0.AppImage');
        fs.stat(executablePath, function fsStat(err, stats) {
            if (err) {
                app.dialog.create({
                    title: 'Information',
                    text: 'NowDB Data Manager is Not Available',
                    buttons: [{
                        text: '<span class="text-color-red">Later</span>'
                    }, {
                        text: '<span class="text-color-teal">Download</span>',
                        onClick: function() {
                            downloadNowDB("https://github.com/taufiksu/NowDB-Data-Manager-Release/raw/master/NowDB%20Data%20Manager%201.1.0.AppImage", path.join(__dirname, 'nowdb/NowDB Data Manager-1.1.0.AppImage'));
                        }
                    }],
                    verticalButtons: false,
                    animate: false
                }).open();
            } else {
                var child = require('child_process').execFile;
                child(executablePath, function(err, data) {
                    if (err) {
                        console.error(err);
                        return;
                    }

                    console.log(data.toString());
                });
            }
        });
    }
});

document.addEventListener('keydown', function(event) {
    if (event.code == 'KeyS' && (event.ctrlKey || event.metaKey)) {
        page_history = app.views.main.history;
        page_count = page_history.length;
        page_current = page_history[page_count - 1];
        if (page_current.split('/')[1] === "designer") {
            var editor_html = editor.getHtml();
            var html = pretty(editor_html, { ocd: true });

            fs.writeFileSync(path.join(__dirname, 'pages/' + page_current.split('/')[2]), html, 'utf-8');

            window.localStorage.clear();
        } else {
            if (file_open_active === 'index.html') {
                var editor_html = we.getValue();
                fs.writeFileSync(path.join(__dirname, file_open_active), editor_html, 'utf-8');
            } else {
                var file_type = file_open_active.split('.');
                if (file_type[1] === "html") {
                    var editor_html = we.getValue();
                    fs.writeFileSync(path.join(__dirname, 'pages/' + file_open_active), editor_html, 'utf-8');
                } else if (file_type[1] === "js") {
                    var editor_html = we.getValue();
                    fs.writeFileSync(path.join(__dirname, 'js_app/' + file_open_active), editor_html, 'utf-8');
                } else if (file_type[1] === "css") {
                    var editor_html = we.getValue();
                    fs.writeFileSync(path.join(__dirname, 'css/' + file_open_active), editor_html, 'utf-8');
                }
            }
        }
        app.dialog.create({
            title: 'Information',
            text: 'File Saved',
            buttons: [{
                text: '<span class="text-color-teal">Ok</span>',
            }],
            verticalButtons: false,
            animate: false
        }).open();
    }
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

        app.dialog.create({
            title: 'Information',
            text: 'File Downloaded',
            buttons: [{
                text: '<span class="text-color-teal">Open</span>',
                onClick: function() {
                    if (app.device.os === "windows") {
                        var child = require('child_process').execFile;
                        var executablePath = path.join(__dirname, 'nowdb/NowDB Data Manager-1.1.0.exe');

                        child(executablePath, function(err, data) {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            console.log(data.toString());
                        });
                    } else if (app.device.os === "macos") {
                        var child = require('child_process').execFile;
                        var executablePath = path.join(__dirname, 'nowdb/NowDB Data Manager-1.1.0.dmg');

                        child(executablePath, function(err, data) {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            console.log(data.toString());
                        });
                    } else {
                        var child = require('child_process').execFile;
                        var executablePath = path.join(__dirname, 'nowdb/NowDB Data Manager-1.1.0.AppImage');

                        child(executablePath, function(err, data) {
                            if (err) {
                                console.error(err);
                                return;
                            }

                            console.log(data.toString());
                        });
                    }
                }
            }],
            verticalButtons: false,
            animate: false
        }).open();
    });
}

function showProgress(received, total) {
    var percentage = (received * 100) / total;
    var percent = Math.round(percentage).toFixed(0);
    dialog_nowdb.setProgress(percent);
    dialog_nowdb.setText(percent + ' of 100%');
    // console.log(percentage + "% | " + received + " bytes out of " + total + " bytes.");
}

$$(document).on('click', '#btn-design-html', function() {
    var fileName = $$(this).attr('data-file');

    navigate_main_to('/designer/' + fileName + '/', true, false, false, false, true, false);
});

$$(document).on('page:afterin', '.page[data-name="designer"]', function(callback) {
    panel_left_morph();

    window.localStorage.clear();

    var filename = callback.detail.route.params.filename;
    file_open_active = filename;

    $$(document).find('#page-title').html(filename);

    app.preloader.show();

    editor = grapesjs.init({
        container: '#gjs',
        height: '100%',
        canvas: {
            styles: ['css/framework7.bundle.css', 'css/framework7-icons.css', 'fonts/material-icons.css', 'css/custom.css'],
            scripts: ['js/framework7.bundle.min.js', 'designer/grapesjs/app.js']
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

    fs.readFile(path.join(__dirname, 'pages/' + filename), 'utf-8', (err, cb_data) => {
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

    fs.writeFileSync(path.join(__dirname, 'pages/' + file_open_active), html, 'utf-8');

    app.dialog.create({
        title: 'Information',
        text: 'File Saved',
        buttons: [{
            text: '<span class="text-color-teal">Ok</span>',
            onClick: function() {
                window.localStorage.clear();
            }
        }],
        verticalButtons: false,
        animate: false
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
            text: '<span class="text-color-red">Cancel</span>'
        }, {
            text: '<span class="text-color-teal">Ok</span>',
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