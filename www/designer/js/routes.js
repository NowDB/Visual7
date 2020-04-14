routes = [{
        name: 'home',
        path: '/',
        url: './designer/pages/home.html',
        options: {
            animate: false,
        }
    },
    {
        name: 'editor_html_index',
        path: '/editor_html_index/:filename/',
        url: './designer/pages/editor_html_index.html'
    },
    {
        name: 'editor_html',
        path: '/editor_html/:filename/',
        url: './designer/pages/editor_html.html'
    },
    {
        name: 'editor_js',
        path: '/editor_js/:filename/',
        url: './designer/pages/editor_js.html'
    },
    {
        name: 'editor_css',
        path: '/editor_css/:filename/',
        url: './designer/pages/editor_css.html'
    },
    {
        name: 'designer',
        path: '/designer/:filename/',
        url: './designer/pages/designer.html'
    },
    {
        path: '(.*)',
        url: './designer/pages/404.html'
    }
];