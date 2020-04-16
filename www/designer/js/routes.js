routes = [{
        name: 'home',
        path: '/',
        url: './designer/pages/home.html',
        options: {
            animate: false,
        }
    },
    {
        name: 'designer',
        path: '/designer/:project/:filename/',
        url: './designer/pages/designer.html'
    },
    {
        name: 'project',
        path: '/project/:name/',
        url: './designer/pages/project.html'
    },
    {
        name: 'editor_html_index',
        path: '/editor_html_index/:project/:filename/',
        url: './designer/pages/editor_html_index.html'
    },
    {
        name: 'editor_html',
        path: '/editor_html/:project/:filename/',
        url: './designer/pages/editor_html.html'
    },
    {
        name: 'editor_js',
        path: '/editor_js/:project/:filename/',
        url: './designer/pages/editor_js.html'
    },
    {
        name: 'editor_js_main',
        path: '/editor_js_main/:project/:filename/',
        url: './designer/pages/editor_js_main.html'
    },
    {
        name: 'editor_js_package',
        path: '/editor_js_package/:project/:filename/',
        url: './designer/pages/editor_js_package.html'
    },
    {
        name: 'editor_css',
        path: '/editor_css/:project/:filename/',
        url: './designer/pages/editor_css.html'
    },
    {
        path: '(.*)',
        url: './designer/pages/404.html'
    }
];