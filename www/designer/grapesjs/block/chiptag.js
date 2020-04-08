blockManager.add('layout chip', {
    label: 'Layout Chip',
    attributes: {
        class: 'fa fa-square',
        title: 'Layout Chip'
    },
    content: '<div class="block-title">Chips Tags</div>' +
        '    <div class="block block-strong">' +
        '        <div class="chip">' +
        '          <div class="chip-label">Default Chip</div>' +
        '        </div>' +
        '    </div>',
    category: {
        label: 'Chips Tags',
        open: false
    }
});

blockManager.add('chip teks', {
    label: 'Chip Teks',
    attributes: {
        class: 'fa fa-square',
        title: 'Chip Teks'
    },
    content: '        <div class="chip">' +
        '          <div class="chip-label">Default Chip</div>' +
        '        </div>',
    category: {
        label: 'Chips Tags',
        open: false
    }
});

blockManager.add('chip icon', {
    label: 'Chip Icon',
    attributes: {
        class: 'fa fa-square',
        title: 'Chip Icon'
    },
    content: '        <div class="chip">' +
        '           <div class="chip-media bg-color-blue">' +
        '               <i class="material-icons">add_circle</i>' +
        '           </div>' +
        '           <div class="chip-label">Add Contact</div>' +
        '        </div>',
    category: {
        label: 'Chips Tags',
        open: false
    }
});

blockManager.add('chip contact', {
    label: 'Chip Contact',
    attributes: {
        class: 'fa fa-square',
        title: 'Chip Contact'
    },
    content: '<div class="chip">' +
        '    <div class="chip-media"><img src="http://lorempixel.com/64/64/people/9/"/></div>' +
        '    <div class="chip-label">Adam Smith</div>' +
        '</div>' +
        '<div class="chip">' +
        '    <div class="chip-media bg-color-pink">J</div>' +
        '    <div class="chip-label">Jennifer</div>' +
        '</div>',
    category: {
        label: 'Chips Tags',
        open: false
    }
});

blockManager.add('chip deleteable', {
    label: 'Chip Deleteable',
    attributes: {
        class: 'fa fa-square',
        title: 'Chip Deleteable'
    },
    content: '<div class="chip">' +
        '    <div class="chip-label">One More Chip</div><a href="#" class="chip-delete"></a>' +
        '</div>' +
        '<div class="chip">' +
        '    <div class="chip-media bg-color-pink">J</div>' +
        '    <div class="chip-label">Jennifer</div><a href="#" class="chip-delete"></a>' +
        '</div>' +
        '<div class="chip">' +
        '    <div class="chip-media"><img src="http://lorempixel.com/64/64/people/9/"/></div>' +
        '    <div class="chip-label">Adam Smith</div><a href="#" class="chip-delete"></a>' +
        '</div>',
    category: {
        label: 'Chips Tags',
        open: false
    }
});

blockManager.add('chip color', {
    label: 'Chip Color',
    attributes: {
        class: 'fa fa-square',
        title: 'Chip Color'
    },
    content: '<div class="chip color-green">' +
        '    <div class="chip-label">Green Chip</div>' +
        '</div>',
    category: {
        label: 'Chips Tags',
        open: false
    }
});