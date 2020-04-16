$$(document).on('click', '#btn-close', function() {
    var window = remote.getCurrentWindow();
    window.close();
});

$$(document).on('click', '#btn-minimize', function() {
    var window = remote.getCurrentWindow();
    window.minimize();
});

window.onresize = function() {
    panel_left_morph();
};

var panel_left_morph = function() {
    if (window.innerWidth >= 700) {
        panel_left.open();
        $$(document).find('#btn-panel-left').hide();
    } else if (window.innerWidth < 700) {
        panel_left.close();
        $$(document).find('#btn-panel-left').show();
    }
}

var navigate_main_back = function() {
    page_history = app.views.main.history;
    page_count = page_history.length;
    page_current = page_history[page_count - 1];
    page_previous = page_history[page_count - 2];

    app.views.main.router.back();
}

var navigate_main_to = function(path, reloadCurrent = false, reloadPrevious = false, reloadAll = false, clearPreviousHistory = false, ignoreCache = false, animate = false) {
    app.views.main.router.navigate(path, {
        reloadCurrent: reloadCurrent,
        reloadPrevious: reloadPrevious,
        reloadAll: reloadAll,
        clearPreviousHistory: clearPreviousHistory,
        ignoreCache: ignoreCache,
        animate: animate,
    });
}

var navigate_left_back = function() {
    page_history = app.views[0].history;
    page_count = page_history.length;
    page_current = page_history[page_count - 1];
    page_previous = page_history[page_count - 2];

    app.views[0].router.back();
}

var navigate_left_to = function(path, reloadCurrent = false, reloadPrevious = false, reloadAll = false, clearPreviousHistory = false, ignoreCache = false, animate = false) {
    app.views[0].router.navigate(path, {
        reloadCurrent: reloadCurrent,
        reloadPrevious: reloadPrevious,
        reloadAll: reloadAll,
        clearPreviousHistory: clearPreviousHistory,
        ignoreCache: ignoreCache,
        animate: animate,
    });
}

function loadTheme(theme) {
    var path = '../node_modules/monaco-themes/themes/' + theme + '.json';
    return fetch(path).then(r => r.json()).then(data => {
        return data;
    });
}

function uriFromPath(_path) {
    var pathName = path.resolve(_path).replace(/\\/g, '/');
    if (pathName.length > 0 && pathName.charAt(0) !== '/') {
        pathName = '/' + pathName;
    }
    return encodeURI('file://' + pathName);
}