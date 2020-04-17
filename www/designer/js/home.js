/**
 * Welcome
 */

$$(document).on('click', '#btn-reload', function() {
    app.preloader.show();

    window.location.reload();
});

$$(document).on('page:afterin', '.page[data-name="home"]', function(e) {
    panel_left_morph();
});

/**
 * Project
 */

$$(document).on('click', '#btn-application-new-electron', function() {
    app.dialog.prompt('Name', 'Create New Project', function(fileName) {
        app.dialog.progress('Preparing Assets');

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

                    list_project();

                    app.dialog.close();

                    if (os.platform() === "darwin") {
                        app.dialog.create({
                            title: '<span class="text-color-red">Manual Install</span>',
                            text: 'Please go to <span class="text-color-black">' + dir_project + '</span> using terminal and continue with <br/><span class="text-color-black">npm i -D electron@latest --unsafe-perm=true</span> and continue with <br/><span class="text-color-black">npm install</span>',
                            buttons: [{
                                text: '<span class="text-color-teal">Ok</span>'
                            }],
                            verticalButtons: false,
                            animate: false
                        }).open();
                    } else {
                        var shell = require('shelljs');

                        shell.cd(dir_project);

                        app.dialog.progress('Running npm install');

                        shell.exec('npm install', function(code, stdout, stderr) {
                            shell.chmod('-R', 777, 'www/');
                            shell.cd(os.homedir());
                            app.dialog.close();
                        });
                    }
                } else {
                    app.dialog.create({
                        title: '<span class="text-color-red">Failed</span>',
                        text: 'Project Exist',
                        buttons: [{
                            text: '<span class="text-color-teal">Ok</span>'
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
                    $$(document).find('#list-file-project').append(
                        '<li id="btn-project-open" data-project="' + dir[i] + '">' +
                        '   <div class="item-content item-link">' +
                        '       <div class="item-inner">' +
                        '           <div class="item-title">' + dir[i] + '</div>' +
                        '       </div>' +
                        '   </div>' +
                        '</li>');
                }
            }
        }
    });
}

$$(document).on('click', '#btn-project-open', function() {
    var project = $$(this).attr('data-project');
    project_open_active = project;
    navigate_left_to('/project/' + project + '/');
});

$$(document).on('page:afterin', '.page[data-name="project"]', function(callback) {
    var project = callback.detail.route.params.name;

    $$(document).find('#project-name').html(project);
    $$(document).find('#btn-code-editor-html-index').attr('data-project', project);
    $$(document).find('#btn-code-editor-js-main').attr('data-project', project);
    $$(document).find('#btn-code-editor-js-package').attr('data-project', project);

    list_html(project);
    list_js(project);
    list_css(project);
    list_other(project);
});

$$(document).on('click', '#btn-app-run', function() {
    app.dialog.progress('Opening Your App');

    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project_open_active);

    setTimeout(function() {
        if (os.platform() === "darwin") {
            app.dialog.close();

            app.dialog.create({
                title: '<span class="text-color-red">Manual Run Electron</span>',
                text: 'Please go to <span class="text-color-black">' + dir_project + '</span> using terminal and continue with <br/><span class="text-color-black">electron .</span>',
                buttons: [{
                    text: '<span class="text-color-teal">Ok</span>'
                }],
                verticalButtons: false,
                animate: false
            }).open();
        } else {
            var shell = require('shelljs');

            shell.cd(dir_project);
            shell.exec('electron .');
            shell.cd(os.homedir());

            app.dialog.close();
        }
    }, 10);
});

/**
 * Index HTML
 */

$$(document).on('click', '#btn-code-editor-html-index', function() {
    var project = $$(this).attr('data-project');
    var filename = $$(this).attr('data-file');

    navigate_main_to('/editor_html_index/' + project + '/' + filename + '/', false, false, false, true, true, false);
});

$$(document).on('page:afterin', '.page[data-name="editor_html_index"]', function(callback) {
    panel_left_morph();

    var project = callback.detail.route.params.project;
    var filename = callback.detail.route.params.filename;
    file_open_active = filename;

    $$(document).find('#page-title').html(filename);
    $$(document).find('#btn-save-html-index').attr('data-project', project);

    self.module = undefined;

    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project);
    var dir_project_www = path.join(dir_project, 'www/');

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
    var project = $$(this).attr('data-project');

    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project);
    var dir_project_www = path.join(dir_project, 'www/');

    var editor_html = we.getValue();
    fs.writeFileSync(path.join(dir_project_www, file_open_active), editor_html, 'utf-8');
    app.toast.create({
        text: 'File Saved',
        position: 'center',
        closeTimeout: 2000
    }).open();
});

/**
 * Main JS
 */

$$(document).on('click', '#btn-code-editor-js-main', function() {
    var project = $$(this).attr('data-project');
    var filename = $$(this).attr('data-file');

    navigate_main_to('/editor_js_main/' + project + '/' + filename + '/', false, false, false, true, true, false);
});

$$(document).on('page:afterin', '.page[data-name="editor_js_main"]', function(callback) {
    panel_left_morph();

    var project = callback.detail.route.params.project;
    var filename = callback.detail.route.params.filename;
    file_open_active = filename;

    $$(document).find('#page-title').html(filename);
    $$(document).find('#btn-save-js-main').attr('data-project', project);

    self.module = undefined;

    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project);

    fs.readFile(path.join(dir_project, filename), 'utf-8', (err, code_data) => {
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

$$(document).on('click', '#btn-save-js-main', function() {
    var project = $$(this).attr('data-project');

    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project);

    var editor_js = we.getValue();
    fs.writeFileSync(path.join(dir_project, file_open_active), editor_js, 'utf-8');
    app.toast.create({
        text: 'File Saved',
        position: 'center',
        closeTimeout: 2000
    }).open();
});

/**
 * Package json
 */

$$(document).on('click', '#btn-code-editor-js-package', function() {
    var project = $$(this).attr('data-project');
    var filename = $$(this).attr('data-file');

    navigate_main_to('/editor_js_package/' + project + '/' + filename + '/', false, false, false, true, true, false);
});

$$(document).on('page:afterin', '.page[data-name="editor_js_package"]', function(callback) {
    panel_left_morph();

    var project = callback.detail.route.params.project;
    var filename = callback.detail.route.params.filename;
    file_open_active = filename;

    $$(document).find('#page-title').html(filename);
    $$(document).find('#btn-save-js-package').attr('data-project', project);

    self.module = undefined;

    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project);

    fs.readFile(path.join(dir_project, filename), 'utf-8', (err, code_data) => {
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
                        language: 'json'
                    });
                });

                app.preloader.hide();
            });
        }
    });
});

$$(document).on('click', '#btn-save-js-package', function() {
    var project = $$(this).attr('data-project');

    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project);

    var editor_js = we.getValue();
    fs.writeFileSync(path.join(dir_project, file_open_active), editor_js, 'utf-8');
    app.toast.create({
        text: 'File Saved',
        position: 'center',
        closeTimeout: 2000
    }).open();
});


/**
 * HTML
 */

function list_html(project) {
    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project);
    var dir_project_www = path.join(dir_project, 'www/');

    fs.readdir(path.join(dir_project_www, 'pages/'), (err, dir) => {
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
                        '               <i title="UI Designer" class="material-icons" id="btn-design-html" data-project="' + project + '" data-file="' + fileName + '" style="cursor: pointer;margin-right:10px;">web</i>' +
                        '               <i title="Code Editor" class="material-icons" id="btn-code-editor-html" data-project="' + project + '" data-file="' + fileName + '" style="cursor: pointer;">code</i>' +
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
                        '               <i title="UI Designer" class="material-icons" id="btn-design-html" data-project="' + project + '" data-file="' + fileName + '" style="cursor: pointer;margin-right:10px;">web</i>' +
                        '               <i title="Code Editor" class="material-icons" id="btn-code-editor-html" data-project="' + project + '" data-file="' + fileName + '" style="cursor: pointer;">code</i>' +
                        '           </div>' +
                        '       </div>' +
                        '   </div>' +
                        '</li>');
                }
            }
        }
    });
}

$$(document).on('click', '#btn-code-editor-html', function() {
    var project = $$(this).attr('data-project');
    var filename = $$(this).attr('data-file');

    navigate_main_to('/editor_html/' + project + '/' + filename + '/', false, false, false, true, true, false);
});

$$(document).on('page:afterin', '.page[data-name="editor_html"]', function(callback) {
    panel_left_morph();

    var project = callback.detail.route.params.project;
    var filename = callback.detail.route.params.filename;
    file_open_active = filename;

    $$(document).find('#page-title').html(filename);
    $$(document).find('#btn-save-html').attr('data-project', project);

    self.module = undefined;

    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project);
    var dir_project_www = path.join(dir_project, 'www/');

    fs.readFile(path.join(dir_project_www, 'pages/' + filename), 'utf-8', (err, code_data) => {
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
                        language: 'html'
                    });
                });

                app.preloader.hide();
            });
        }
    });
});

$$(document).on('click', '#btn-save-html', function() {
    var project = $$(this).attr('data-project');

    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project);
    var dir_project_www = path.join(dir_project, 'www/');

    var editor_html = we.getValue();
    fs.writeFileSync(path.join(dir_project_www, 'pages/' + file_open_active), editor_html, 'utf-8');
    app.toast.create({
        text: 'File Saved',
        position: 'center',
        closeTimeout: 2000
    }).open();
});

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
        } else {
            fs.writeFileSync(path.join(dir_project_www, 'pages/' + fileName), '', 'utf-8');
        }

        list_html(project_open_active);
    });
});

$$(document).on('click', '#btn-remove-html', function() {
    var fileName = $$(this).attr('data-file');

    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project_open_active);
    var dir_project_www = path.join(dir_project, 'www/');

    app.dialog.create({
        title: 'Information',
        text: 'Remove This File <span class="text-color-red">' + fileName + ' </span>?',
        buttons: [{
            text: '<span class="text-color-red">cancel</span>'
        }, {
            text: '<span class="text-color-teal">Ok</span>',
            onClick: function() {
                fs.unlink(path.join(dir_project_www, 'pages/' + fileName), function(err) {
                    if (err) return console.log(err);
                    list_html(project_open_active);

                    navigate_main_to('/');
                });
            }
        }],
        verticalButtons: false,
        animate: false
    }).open();
});

/**
 * JS
 */

function list_js(project) {
    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project);
    var dir_project_www = path.join(dir_project, 'www/');

    fs.readdir(path.join(dir_project_www, 'js_app/'), (err, dir) => {
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
                        '               <i title="Code Editor" class="material-icons" id="btn-code-editor-js" data-project="' + project + '" data-file="' + fileName + '" style="cursor: pointer;">code</i>' +
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
                        '               <i title="Code Editor" class="material-icons" id="btn-code-editor-js" data-project="' + project + '" data-file="' + fileName + '" style="cursor: pointer;">code</i>' +
                        '           </div>' +
                        '        </div>' +
                        '   </div>' +
                        '</li>');
                }
            }
        }
    });
}

$$(document).on('click', '#btn-code-editor-js', function() {
    var project = $$(this).attr('data-project');
    var filename = $$(this).attr('data-file');

    navigate_main_to('/editor_js/' + project + '/' + filename + '/', false, false, false, true, true, false);
});

$$(document).on('page:afterin', '.page[data-name="editor_js"]', function(callback) {
    panel_left_morph();

    var project = callback.detail.route.params.project;
    var filename = callback.detail.route.params.filename;
    file_open_active = filename;

    $$(document).find('#page-title').html(filename);
    $$(document).find('#btn-save-js').attr('data-project', project);

    self.module = undefined;

    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project);
    var dir_project_www = path.join(dir_project, 'www/');

    fs.readFile(path.join(dir_project_www, 'js_app/' + filename), 'utf-8', (err, code_data) => {
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
    var project = $$(this).attr('data-project');

    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project);
    var dir_project_www = path.join(dir_project, 'www/');

    var editor_js = we.getValue();
    fs.writeFileSync(path.join(dir_project_www, 'js_app/' + file_open_active), editor_js, 'utf-8');
    app.toast.create({
        text: 'File Saved',
        position: 'center',
        closeTimeout: 2000
    }).open();
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
        } else {
            fs.writeFileSync(path.join(dir_project_www, 'js_app/' + fileName), '', 'utf-8');
        }

        list_js(project_open_active);
    });
});

$$(document).on('click', '#btn-remove-js', function() {
    var fileName = $$(this).attr('data-file');

    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project_open_active);
    var dir_project_www = path.join(dir_project, 'www/');

    app.dialog.create({
        title: 'Information',
        text: 'Remove This File <span class="text-color-red">' + fileName + ' </span>?',
        buttons: [{
            text: '<span class="text-color-red">cancel</span>'
        }, {
            text: '<span class="text-color-teal">Ok</span>',
            onClick: function() {
                fs.unlink(path.join(dir_project_www, 'js_app/' + fileName), function(err) {
                    if (err) return console.log(err);
                    list_js(project_open_active);

                    navigate_main_to('/');
                });
            }
        }],
        verticalButtons: false,
        animate: false
    }).open();
});

/**
 * CSS
 */

function list_css(project) {
    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project);
    var dir_project_www = path.join(dir_project, 'www/');

    fs.readdir(path.join(dir_project_www, 'css/'), (err, dir) => {
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
                        '               <i title="Code Editor" class="material-icons" id="btn-code-editor-css" data-project="' + project + '" data-file="' + fileName + '" style="cursor: pointer;">code</i>' +
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
                        '               <i title="Code Editor" class="material-icons" id="btn-code-editor-css" data-project="' + project + '" data-file="' + fileName + '" style="cursor: pointer;">code</i>' +
                        '           </div>' +
                        '        </div>' +
                        '   </div>' +
                        '</li>');
                }
            }
        }
    });
}

$$(document).on('click', '#btn-code-editor-css', function() {
    var project = $$(this).attr('data-project');
    var filename = $$(this).attr('data-file');

    navigate_main_to('/editor_css/' + project + '/' + filename + '/', false, false, false, true, true, false);
});

$$(document).on('page:afterin', '.page[data-name="editor_css"]', function(callback) {
    panel_left_morph();

    var project = callback.detail.route.params.project;
    var filename = callback.detail.route.params.filename;
    file_open_active = filename;

    $$(document).find('#page-title').html(filename);
    $$(document).find('#btn-save-css').attr('data-project', project);

    self.module = undefined;

    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project);
    var dir_project_www = path.join(dir_project, 'www/');

    fs.readFile(path.join(dir_project_www, 'css/' + filename), 'utf-8', (err, code_data) => {
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
                        language: 'css'
                    });
                });

                app.preloader.hide();
            });
        }
    });
});

$$(document).on('click', '#btn-save-css', function() {
    var project = $$(this).attr('data-project');

    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project);
    var dir_project_www = path.join(dir_project, 'www/');

    var editor_css = we.getValue();
    fs.writeFileSync(path.join(dir_project_www, 'css/' + file_open_active), editor_css, 'utf-8');
    app.toast.create({
        text: 'File Saved',
        position: 'center',
        closeTimeout: 2000
    }).open();
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
        } else {
            fs.writeFileSync(path.join(dir_project_www, 'css/' + fileName), '', 'utf-8');
        }

        list_css(project_open_active);
    });
});

$$(document).on('click', '#btn-remove-css', function() {
    var fileName = $$(this).attr('data-file');

    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project_open_active);
    var dir_project_www = path.join(dir_project, 'www/');

    app.dialog.create({
        title: 'Information',
        text: 'Remove This File <span class="text-color-red">' + fileName + ' </span>?',
        buttons: [{
            text: '<span class="text-color-red">cancel</span>'
        }, {
            text: '<span class="text-color-teal">Ok</span>',
            onClick: function() {
                fs.unlink(path.join(dir_project_www, 'css/' + fileName), function(err) {
                    if (err) return console.log(err);
                    list_css(project_open_active);

                    navigate_main_to('/');
                });
            }
        }],
        verticalButtons: false,
        animate: false
    }).open();
});

/**
 * Other
 */

function list_other(project) {
    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project);
    var dir_project_www = path.join(dir_project, 'www/');

    fs.readdir(path.join(dir_project_www, 'file/'), (err, dir) => {
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

$$(document).on('click', '#btn-create-file', function() {
    var dir_visual7 = path.join(os.homedir(), 'Visual7/');
    var dir_project = path.join(dir_visual7, project_open_active);
    var dir_project_www = path.join(dir_project, 'www/');

    dialog.showOpenDialog(function(fileName) {
        if (fileName === undefined) {
            app.dialog.alert("No file selected");
        } else {
            readFile(fileName[0]);
        }
    });

    function readFile(filepath) {
        let namefile = filepath.replace(/^.*[\\\/]/, '');

        fse.copy(filepath, path.join(dir_project_www, 'file/' + namefile), err => {
            if (err) return console.error(err)
            list_other(project_open_active);
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
        text: 'Remove This File <span class="text-color-red">' + fileName + ' </span>?',
        buttons: [{
            text: '<span class="text-color-red">cancel</span>'
        }, {
            text: '<span class="text-color-teal">Ok</span>',
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
        } else if (page_current.split('/')[1] === "editor_js_main") {
            var editor_js = we.getValue();
            fs.writeFileSync(path.join(dir_project, file_open_active), editor_js, 'utf-8');
        } else if (page_current.split('/')[1] === "editor_js_package") {
            var editor_js = we.getValue();
            fs.writeFileSync(path.join(dir_project, file_open_active), editor_js, 'utf-8');
        } else {
            if (file_open_active === 'index.html') {
                var editor_html = we.getValue();
                fs.writeFileSync(path.join(dir_project_www, file_open_active), editor_html, 'utf-8');
            } else {
                var file_type = file_open_active.split('.');
                if (file_type[1] === "html") {
                    var editor_html = we.getValue();
                    fs.writeFileSync(path.join(dir_project_www, 'pages/' + file_open_active), editor_html, 'utf-8');
                } else if (file_type[1] === "js") {
                    var editor_js = we.getValue();
                    fs.writeFileSync(path.join(dir_project_www, 'js_app/' + file_open_active), editor_js, 'utf-8');
                } else if (file_type[1] === "css") {
                    var editor_css = we.getValue();
                    fs.writeFileSync(path.join(dir_project_www, 'css/' + file_open_active), editor_css, 'utf-8');
                }
            }
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

    navigate_main_to('/designer/' + project + '/' + fileName + '/', true, false, false, false, true, false);
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