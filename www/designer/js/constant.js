var localStorage = require('localStorage');
const electron = require('electron');
const { ipcRenderer } = require('electron');
const remote = electron.remote;
const { dialog } = electron.remote;
const BrowserWindow = electron.remote.BrowserWindow;
const spawn = require('child_process').spawn;
const prompt = require('electron-prompt');
const shell = require('electron').shell;
const https = require('https');
const mkdirp = require('mkdirp');
const pretty = require('pretty');
const pty = require('node-pty');
const fs = require('fs-extra');
const path = require('path');
const url = require('url');
const os = require('os');
const editorLoader = require('../node_modules/monaco-editor/min/vs/loader.js');
const editorRequire = editorLoader.require;
const { Terminal } = require('xterm');
const { FitAddon } = require('xterm-addon-fit');
const beautify = require('beautify');
let term = null;
let ptyProcess = null;
let termEditor = null;
let ptyProcessEditor = null;
let file_open_active = '';
let filepath_open_active = '';
let project_open_active = '';
let tab_link_active = '';
let tab_project_active = '';
let tab_dir_active = '';
let editor_value = '';
// UI Designer
let editor = null;
let blockManager = null;
// Code Editor
let me = null;
var we = [];

fs.readdir(path.join(os.homedir(), 'Visual7/'), (err, dir) => {
    if (err) {
        var dir = path.join(os.homedir(), 'Visual7/');
        fs.mkdirSync(dir);
    }
});