routes = [{
        name: 'home',
        path: '/',
        url: './pages/home.html',
        options: {
            animate: false,
        }
    },
    {
        name: 'about',
        path: '/about/',
        url: './pages/about.html'
    },
    {
        path: '(.*)',
        url: './pages/404.html'
    }
];