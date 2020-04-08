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
                        '               <i title="Code Editor" class="material-icons" id="btn-code-html" data-file="' + fileName + '" style="cursor: pointer;">code</i>' +
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
                        '               <i title="Code Editor" class="material-icons" id="btn-code-html" data-file="' + fileName + '" style="cursor: pointer;">code</i>' +
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
                        '               <i title="Code Editor" class="material-icons" id="btn-code-js" data-file="' + fileName + '" style="cursor: pointer;">code</i>' +
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
                        '               <i title="Code Editor" class="material-icons" id="btn-code-js" data-file="' + fileName + '" style="cursor: pointer;">code</i>' +
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
                        '               <i title="Code Editor" class="material-icons" id="btn-code-css" data-file="' + fileName + '" style="cursor: pointer;">code</i>' +
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
                        '               <i title="Code Editor" class="material-icons" id="btn-code-css" data-file="' + fileName + '" style="cursor: pointer;">code</i>' +
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

$$(document).on('page:afterin', '.page[data-name="home"]', function() {
    app.preloader.show();

    setTimeout(function() {
        file_list_html();
        file_list_js();
        file_list_css();
        file_list_other();

        app.preloader.hide();
    }, 10);
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

$$(document).on('click', '#btn-design-html', function() {
    var fileName = $$(this).attr('data-file');

    let loadpage

    loadpage = new BrowserWindow({
        width: (window.screen.width * 90) / 100,
        height: (window.screen.height * 90) / 100,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        },
        icon: path.join(__dirname, 'img/favicon.png')
    })

    loadpage.loadURL(url.format({
        pathname: path.join(__dirname, 'designer.html'),
        protocol: 'file:',
        slashes: true
    }))

    fs.writeFileSync(path.join(__dirname, 'temp.html'), fileName, 'utf-8');
});

$$(document).on('click', '#btn-code-html', function() {
    var fileName = $$(this).attr('data-file');

    let loadpage

    loadpage = new BrowserWindow({
        width: (window.screen.width * 90) / 100,
        height: (window.screen.height * 90) / 100,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        },
        icon: path.join(__dirname, 'img/favicon.png')
    })

    loadpage.loadURL(url.format({
        pathname: path.join(__dirname, 'editor_html.html'),
        protocol: 'file:',
        slashes: true
    }))

    fs.writeFileSync(path.join(__dirname, 'temp.html'), fileName, 'utf-8');
});

$$(document).on('click', '#btn-code-html-index', function() {
    var fileName = $$(this).attr('data-file');

    let loadpage

    loadpage = new BrowserWindow({
        width: (window.screen.width * 90) / 100,
        height: (window.screen.height * 90) / 100,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        },
        icon: path.join(__dirname, 'img/favicon.png')
    })

    loadpage.loadURL(url.format({
        pathname: path.join(__dirname, 'editor_html_index.html'),
        protocol: 'file:',
        slashes: true
    }))

    fs.writeFileSync(path.join(__dirname, 'temp.html'), fileName, 'utf-8');
});

$$(document).on('click', '#btn-code-js', function() {
    var fileName = $$(this).attr('data-file');

    let loadpage

    loadpage = new BrowserWindow({
        width: (window.screen.width * 90) / 100,
        height: (window.screen.height * 90) / 100,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        },
        icon: path.join(__dirname, 'img/favicon.png')
    })

    loadpage.loadURL(url.format({
        pathname: path.join(__dirname, 'editor_js.html'),
        protocol: 'file:',
        slashes: true
    }))

    fs.writeFileSync(path.join(__dirname, 'temp.html'), fileName, 'utf-8');
});

$$(document).on('click', '#btn-code-css', function() {
    var fileName = $$(this).attr('data-file');

    let loadpage

    loadpage = new BrowserWindow({
        width: (window.screen.width * 90) / 100,
        height: (window.screen.height * 90) / 100,
        resizable: false,
        webPreferences: {
            nodeIntegration: true
        },
        icon: path.join(__dirname, 'img/favicon.png')
    })

    loadpage.loadURL(url.format({
        pathname: path.join(__dirname, 'editor_css.html'),
        protocol: 'file:',
        slashes: true
    }))

    fs.writeFileSync(path.join(__dirname, 'temp.html'), fileName, 'utf-8');
});

$$(document).on('click', '#btn-remove-html', function() {
    var fileName = $$(this).attr('data-file');

    app.dialogapp.dialog.create({
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
                            downloadNowDB("https://github.com/taufiksu/nowdb-data-manager-release/raw/master/NowDB%20Data%20Manager%201.1.0.exe", path.join(__dirname, 'nowdb/NowDB Data Manager-1.1.0.exe'));
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
                            downloadNowDB("https://github.com/taufiksu/nowdb-data-manager-release/raw/master/NowDB%20Data%20Manager%201.1.0.dmg", path.join(__dirname, 'nowdb/NowDB Data Manager-1.1.0.dmg'));
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
                            downloadNowDB("https://github.com/taufiksu/nowdb-data-manager-release/raw/master/NowDB%20Data%20Manager%201.1.0.AppImage", path.join(__dirname, 'nowdb/NowDB Data Manager-1.1.0.AppImage'));
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

var progress_nowdb = 0;
var dialog_nowdb = null;

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