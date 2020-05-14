$$(document).on('page:init', '.page[data-name="editor"]', function(callback) {
    panel_left_morph();
});

$$(document).on('click', '#btn-code-editor', function() {
    active_file_name = $$(this).attr('data-file');
    active_file_name_replace = active_file_name.split(".").join("_");
    active_file_dir = $$(this).attr('data-dir');
    active_file_type = $$(this).attr('data-type');

    if (active_file_dir === "root") {
        if (active_file_name === "index.html") {
            active_file_path = path.join(active_dir_project_www, active_file_name);
        } else if (active_file_name === "main.js" || active_file_name === "package.json") {
            active_file_path = path.join(active_dir_project, active_file_name);
        }
    } else {
        active_file_path = path.join(active_dir_project_www, active_file_dir);
        active_file_path = path.join(active_file_path, active_file_name);
    }

    func_tab_open();
    func_tab_toolbar(active_file_name, active_file_type);
});

$$(document).on('click', '.tab-link', function() {
    active_tab_file = $$(this).attr('data-file');
    active_tab_file_replace = $$(this).attr('data-replace');
    active_tab_file_type = $$(this).attr('data-type');
    active_tab_file_dir = $$(this).attr('data-dir');
    active_tab_file_path = $$(this).attr('data-path');

    func_tab_toolbar(active_tab_file, active_tab_file_type);
});

$$(document).on('click', '#btn-code-close', function() {
    var file = $$(this).attr('data-file');
    var file_replace = $$(this).attr('data-replace');
    var file_path = $$(this).attr('data-path');

    func_file_save(file, file_path);
    func_tab_open_sibling(file_replace);
    func_tab_close(file_replace);
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

func_tab_open = function() {
    $$(document).find('.tab-link').removeClass('tab-link-active');
    $$(document).find('.page-content').removeClass('tab-active');

    $$(document).find('#tab-link-' + active_file_name_replace).remove();
    $$(document).find('#tab-' + active_file_name_replace).remove();

    $$(document).find('#tab-link-editor').append('<a id="tab-link-' + active_file_name_replace + '" class="tab-link tab-link-active" href="#tab-' + active_file_name_replace + '" data-file="' + active_file_name + '" data-replace="' + active_file_name_replace + '" data-type="' + active_file_type + '" data-path="' + active_file_path + '" data-dir="' + active_file_dir + '" data-project="' + active_project + '">' +
        '   <span style="padding-bottom:4px;font-size:small;">' + active_file_name + '</span>' +
        '   <i id="btn-code-close" data-file="' + active_file_name + '" data-replace="' + active_file_name_replace + '" data-type="' + active_file_type + '" data-path="' + active_file_path + '" data-dir="' + active_file_dir + '" data-project="' + active_project + '" class="material-icons no-margin no-padding" style="font-size:small;">close</i>' +
        '</a>');
    $$(document).find('#tab-editor').append('<div id="tab-' + active_file_name_replace + '" class="page-content tab tab-active"><div style="height:100%;overflow-y: hidden;" id="editor-' + active_file_name_replace + '"></div></div>');

    app.preloader.show();

    fs.readFile(active_file_path, 'utf-8', (err, code_data) => {
        if (err) {
            app.preloader.hide();
            return;
        } else {
            editorRequire.config({
                baseUrl: uriFromPath(path.join(__dirname, '../node_modules/monaco-editor/min'))
            });

            editorRequire(['vs/editor/editor.main'], function() {
                me = monaco.editor;
                we[active_file_name] = window.editor;

                loadTheme('Monokai').then(function(callback) {
                    me.defineTheme(callback.base, {
                        base: callback.base,
                        inherit: true,
                        rules: [callback.rules],
                        colors: callback.colors
                    });
                    me.setTheme(callback.base);

                    we[active_file_name] = me.create(document.getElementById('editor-' + active_file_name_replace), {
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
                        language: active_file_type
                    });
                });

                app.preloader.hide();
            });
        }
    });
}

func_tab_close = function(file_replace) {
    $$(document).find('#tab-link-' + file_replace).remove();
    $$(document).find('#tab-' + file_replace).remove();
}

func_file_save = function(file, file_path) {
    app.preloader.show();

    setTimeout(function() {
        var editor_value = we[file].getValue();
        fs.writeFileSync(file_path, editor_value, 'utf-8');

        app.preloader.hide();
    }, 10);
}

func_tab_open_sibling = function(file_replace) {
    var siblings = $$(document).find("#tab-link-" + file_replace).siblings().attr('data-file');
    if (siblings !== undefined) {
        var file_replace_siblings = siblings.split(".").join("_");
        app.tab.show('#tab-' + file_replace_siblings);
    }
}

func_tab_toolbar = function(file, file_type) {
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

    $$(document).find('#btn-design-html').attr('data-project', active_project);
    $$(document).find('#btn-design-html').attr('data-file', file);

    var filename_split = file.split('.');

    if (file_type === "html") {
        if (filename_split[0] === "index") {
            $$(document).find('#btn-design-html').hide();
        } else {
            $$(document).find('#btn-design-html').show();
        }
        $$(document).find('.btn-snippet-js').hide();
    } else if (file_type === "javascript") {
        $$(document).find('#btn-design-html').hide();
        $$(document).find('.btn-snippet-js').show();
    } else if (file_type === "css") {
        $$(document).find('#btn-design-html').hide();
        $$(document).find('.btn-snippet-js').hide();
    } else if (file_type === "json") {
        $$(document).find('#btn-design-html').hide();
        $$(document).find('.btn-snippet-js').hide();
    }
}