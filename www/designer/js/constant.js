var localStorage = require('localStorage');
const electron = require('electron');
const { ipcRenderer } = require('electron');
const remote = electron.remote;
const { dialog } = electron.remote;
const BrowserWindow = electron.remote.BrowserWindow;
const request = require('request');
const path = require('path');
const url = require('url');
const fs = require('fs');
const os = require('os');
const spawn = require('child_process').spawn;
const prompt = require('electron-prompt');
const pretty = require('pretty');
const mkdirp = require('mkdirp');
const editorLoader = require('../node_modules/monaco-editor/min/vs/loader.js');
const editorRequire = editorLoader.require;

var file_open_active = '';
// UI Designer
var editor = null;
var blockManager = null;
// Code Editor
var me = null;
var we = null;
// NowDB
var progress_nowdb = 0;
var dialog_nowdb = null;

fs.readdir(path.join(os.homedir(), 'Visual7/'), (err, dir) => {
    if (err) {
        var dir = path.join(os.homedir(), 'Visual7/');
        fs.mkdirSync(dir);
    }
});