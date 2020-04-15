var localStorage = require('localStorage');
const { ipcRenderer } = require('electron');
const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;
const remote = require('electron').remote;
const { dialog } = electron.remote;
const request = require('request');
const path = require('path');
const url = require('url');
const fs = require('fs');
const spawn = require('child_process').spawn;
const os = require('os');
const prompt = require('electron-prompt');
const pretty = require('pretty');
const editorLoader = require('../node_modules/monaco-editor/min/vs/loader.js');
const editorRequire = editorLoader.require;

var editor = null;
var blockManager = null;
var file_open_active = '';

var me = null;
var we = null;

var progress_nowdb = 0;
var dialog_nowdb = null;