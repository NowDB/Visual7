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

                        list_html();
                        list_js();
                        list_css();
                        list_other();
                    }
                });
            }
        }],
        verticalButtons: false,
        animate: false
    }).open();
});