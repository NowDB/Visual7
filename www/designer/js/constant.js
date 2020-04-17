var localStorage = require('localStorage');
const electron = require('electron');
const { ipcRenderer } = require('electron');
const remote = electron.remote;
const { dialog } = electron.remote;
const BrowserWindow = electron.remote.BrowserWindow;
const path = require('path');
const url = require('url');
const fs = require('fs');
const fse = require('fs-extra');
const os = require('os');
const mkdirp = require('mkdirp');
const pretty = require('pretty');
const spawn = require('child_process').spawn;
const prompt = require('electron-prompt');
const editorLoader = require('../node_modules/monaco-editor/min/vs/loader.js');
const editorRequire = editorLoader.require;

var file_open_active = '';
var project_open_active = '';
// UI Designer
var editor = null;
var blockManager = null;
// Code Editor
var me = null;
var we = null;
// NowDB Data Manager
var progress_nowdb = 0;
var dialog_nowdb = null;

fs.readdir(path.join(os.homedir(), 'Visual7/'), (err, dir) => {
    if (err) {
        var dir = path.join(os.homedir(), 'Visual7/');
        fs.mkdirSync(dir);
    }
});

var mkdir = function(dir) {
    // making directory without exception if exists
    try {
        fs.mkdirSync(dir, 0755);
    } catch (e) {
        if (e.code != "EEXIST") {
            throw e;
        }
    }
};

var rmdir = function(dir) {
    if (path.existsSync(dir)) {
        var list = fs.readdirSync(dir);
        for (var i = 0; i < list.length; i++) {
            var filename = path.join(dir, list[i]);
            var stat = fs.statSync(filename);

            if (filename == "." || filename == "..") {
                // pass these files
            } else if (stat.isDirectory()) {
                // rmdir recursively
                rmdir(filename);
            } else {
                // rm fiilename
                fs.unlinkSync(filename);
            }
        }
        fs.rmdirSync(dir);
    } else {
        console.warn("warn: " + dir + " not exists");
    }
};

var copyDir = function(src, dest) {
    mkdir(dest);
    var files = fs.readdirSync(src);
    for (var i = 0; i < files.length; i++) {
        var current = fs.lstatSync(path.join(src, files[i]));
        if (current.isDirectory()) {
            copyDir(path.join(src, files[i]), path.join(dest, files[i]));
        } else if (current.isSymbolicLink()) {
            var symlink = fs.readlinkSync(path.join(src, files[i]));
            fs.symlinkSync(symlink, path.join(dest, files[i]));
        } else {
            copy(path.join(src, files[i]), path.join(dest, files[i]));
        }
    }
};

var copy = function(src, dest) {
    var oldFile = fs.createReadStream(src);
    var newFile = fs.createWriteStream(dest);
    oldFile.pipe(newFile);
};