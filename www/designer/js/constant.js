var localStorage = require('localStorage');
const electron = require('electron');
const { ipcRenderer } = require('electron');
const remote = electron.remote;
const { dialog } = electron.remote;
const BrowserWindow = electron.remote.BrowserWindow;
const path = require('path');
const url = require('url');
const request = require('request');
// const fs = require('fs');
const fs = require('fs-extra');
const os = require('os');
const mkdirp = require('mkdirp');
const pretty = require('pretty');
const spawn = require('child_process').spawn;
const prompt = require('electron-prompt');
const editorLoader = require('../node_modules/monaco-editor/min/vs/loader.js');
const editorRequire = editorLoader.require;
const pty = require('node-pty');
const { Terminal } = require('xterm');
const { FitAddon } = require('xterm-addon-fit');
const beautify = require('beautify');
const shell = require('electron').shell;

let term = null;
let ptyProcess = null;
let termEditor = null;
let ptyProcessEditor = null;

let file_open_active = '';
let filepath_open_active = '';
let project_open_active = '';
let editor_value = '';

// UI Designer
let editor = null;
let blockManager = null;

// Code Editor
let me = null;
let we = null;

// NowDB Data Manager
let progress_nowdb = 0;
let dialog_nowdb = null;

fs.readdir(path.join(os.homedir(), 'Visual7/'), (err, dir) => {
    if (err) {
        var dir = path.join(os.homedir(), 'Visual7/');
        fs.mkdirSync(dir);
    }
});