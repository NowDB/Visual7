document.addEventListener('keydown', function(event) {
    if (event.code == 'KeyS' && (event.ctrlKey || event.metaKey)) {
        var editor_html = editor.getHtml();
        var html = pretty(editor_html);

        if (file_open_active === '') {
            prompt({
                title: 'Save File',
                label: 'Filename',
                inputAttrs: {
                    type: 'text'
                },
                type: 'input'
            }).then((filename) => {
                if (filename === null) {
                    //Do Nothing
                } else if (filename === ' ' || filename === '') {
                    alert('Please Type Filename');
                } else {
                    lower_filename = filename.toLowerCase();
                    sanitize_filename = lower_filename.replace(/ /g, "_");
                    if (sanitize_filename.slice(-5) === '.html') {
                        fs.writeFileSync(path.join(__dirname, 'pages/' + sanitize_filename), html, 'utf-8');
                        file_open_active = sanitize_filename;
                        alert('Saved');
                    } else {
                        fs.writeFileSync(path.join(__dirname, 'pages/' + sanitize_filename + '.html'), html, 'utf-8');
                        file_open_active = sanitize_filename;
                        alert('Saved');
                    }
                }
            }).catch(console.error);
        } else {
            fs.writeFileSync(path.join(__dirname, 'pages/' + file_open_active), html, 'utf-8');
            alert('Saved');
        }

        window.localStorage.clear();
    }
});

command.add('undo', {
    run: function(editor, sender) {
        sender.set('active', 0);
        editor.UndoManager.undo(1);
    }
});

command.add('redo', {
    run: function(editor, sender) {
        sender.set('active', 0);
        editor.UndoManager.redo(1);
    }
});

command.add('set-device-desktop', {
    run: function(editor) {
        editor.setDevice('Desktop');
    }
});

command.add('set-device-tablet', {
    run: function(editor) {
        editor.setDevice('Tablet');
    }
});

command.add('set-device-mobile', {
    run: function(editor) {
        editor.setDevice('Mobile portrait');
    }
});

command.add('clean-all', {
    run: function(editor, sender) {
        sender && sender.set('active', false);
        if (confirm('Are you sure to clean the canvas?')) {
            var comps = editor.DomComponents.clear();
            setTimeout(function() {
                localStorage.clear()
            }, 0)
        }
    }
});

command.add('new', {
    run: function(editor, sender) {
        sender && sender.set('active', false);
        var comps = editor.DomComponents.clear();
        setTimeout(function() {
            localStorage.clear()
        }, 0)

        file_open_active = '';
    }
});

command.add('open-vscode', {
    run: function(editor, sender) {
        sender && sender.set('active', false);

        spawn('cmd.exe', ['/c', 'code ' + path.join(__dirname)]);
    }
});

command.add('save-code', {
    run: function(editor, btn) {
        btn.set('active', false);

        var editor_html = editor.getHtml();
        var html = pretty(editor_html, { ocd: true });

        if (file_open_active === '') {
            prompt({
                title: 'Save File',
                label: 'Filename',
                inputAttrs: {
                    type: 'text'
                },
                type: 'input'
            }).then((filename) => {
                if (filename === null) {
                    //Do Nothing
                } else if (filename === ' ' || filename === '') {
                    alert('Please Type Filename');
                } else {
                    lower_filename = filename.toLowerCase();
                    sanitize_filename = lower_filename.replace(/ /g, "_");
                    if (sanitize_filename.slice(-5) === '.html') {
                        fs.writeFileSync(path.join(__dirname, 'pages/' + sanitize_filename), html, 'utf-8');
                        file_open_active = sanitize_filename;
                        alert('Saved');
                    } else {
                        fs.writeFileSync(path.join(__dirname, 'pages/' + sanitize_filename + '.html'), html, 'utf-8');
                        file_open_active = sanitize_filename;
                        alert('Saved');
                    }
                }
            }).catch(console.error);
        } else {
            fs.writeFileSync(path.join(__dirname, 'pages/' + file_open_active), html, 'utf-8');
            alert('Saved');
        }

        window.localStorage.clear();
    }
});

command.add('open-file', {
    run: function(editor, btn) {
        btn.set('active', false);

        var html = editor.getHtml();

        fs.readdir(path.join(__dirname, 'pages/'), (err, dir) => {
            if (dir.length === 0) {
                //Do Nothing
            } else {
                var fileList = {};
                for (var i = 0; i < dir.length; i++) {
                    let fileName = dir[i];
                    fileList[fileName] = fileName;
                }
                prompt({
                    title: 'Open File',
                    label: 'Filename',
                    type: 'select',
                    selectOptions: fileList
                }).then((r) => {
                    if (r === null) {
                        //Do Nothing
                    } else {
                        fs.readFile(path.join(__dirname, 'pages/' + r), 'utf-8', (err, data) => {
                            if (err) {
                                console.log(err);
                                return;
                            }
                            file_open_active = r;
                            editor.setComponents(data);
                        })
                    }
                }).catch(console.error);
            }
        });
    }
});