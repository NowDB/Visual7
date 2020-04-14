var $$ = Dom7;

var app = new Framework7({
    root: '#app',
    id: 'com.app.myproject',
    name: 'MyProject',
    theme: 'md',
    routes: routes,
    touch: {
        fastclick: true,
        materialRipple: false
    }
});

var view_left = app.views.create('#view-left', {
    url: '/'
});

var view_main = app.views.create('#view-main', {
    url: '/'
});

var panel_left = app.panel.create({
    el: '.panel-left',
    resizable: true,
    visibleBreakpoint: 700
});