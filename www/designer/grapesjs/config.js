const spawn = require('child_process').spawn;
const path = require('path');
const os = require('os');
const fs = require('fs');
const prompt = require('electron-prompt');
const pretty = require('pretty');

var file_open_active = '';

var editor = grapesjs.init({
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

var blockManager = editor.BlockManager;

var command = editor.Commands;

var panel = editor.Panels;

panel.getPanels().reset([{
    id: 'options',
    buttons: [{
        id: 'save-code',
        className: 'fa fa-save',
        command: 'save-code',
        attributes: {
            title: 'Save File'
        }
    }, {
        id: 'undo',
        className: 'fa fa-undo',
        command: e => e.runCommand('core:undo'),
        attributes: {
            title: 'Undo'
        }
    }, {
        id: 'redo',
        className: 'fa fa-repeat',
        command: e => e.runCommand('core:redo'),
        attributes: {
            title: 'Redo'
        }
    }, {
        id: 'sw-visibility',
        command: 'sw-visibility',
        className: 'fa fa-object-group',
        attributes: {
            title: 'Show Elements'
        }
    }, {
        id: 'clean-all',
        className: 'fa fa-trash',
        command: 'clean-all',
        attributes: {
            title: 'Clear Canvas'
        }
    }, {
        id: 'preview',
        context: 'preview',
        command: e => e.runCommand('preview'),
        className: 'fa fa-eye',
        attributes: {
            title: 'Preview'
        }
    }, {
        id: 'export-template',
        className: 'fa fa-code',
        command: e => e.runCommand('export-template'),
        attributes: {
            title: 'Code'
        }
    }]
}, {
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
            title: 'Configs'
        }
    }]
}]);

editor.Panels.addPanel({
    id: 'switcher_panel',
    visible: true,
    buttons: [{
        id: 'deviceDesktop',
        command: 'set-device-desktop',
        className: 'fa fa-desktop',
        attributes: { 'title': 'Desktop' },
    }, {
        id: 'deviceTablet',
        command: 'set-device-tablet',
        className: 'fa fa-tablet',
        attributes: { 'title': 'Tablet' },
    }, {
        id: 'deviceMobile',
        command: 'set-device-mobile',
        className: 'fa fa-mobile',
        attributes: { 'title': 'Mobile' },
        active: 1
    }],
});

fs.readFile(path.join(__dirname, 'temp.html'), 'utf-8', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }

    document.getElementById('page-title').innerHTML = data;

    fs.readFile(path.join(__dirname, 'pages/' + data), 'utf-8', (err, cb_data) => {
        if (err) {
            console.log(err);
            return;
        }
        editor.setComponents(cb_data);
    });

    file_open_active = data;
});