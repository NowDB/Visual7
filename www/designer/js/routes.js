routes = [{
        name: 'home',
        path: '/',
        url: './designer/pages/home.html',
        options: {
            animate: false,
        }
    },
    {
        name: 'about',
        path: '/about/',
        url: './designer/pages/about.html'
    },
    {
        path: '(.*)',
        url: './designer/pages/404.html'
    }
];