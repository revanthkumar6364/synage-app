// resources/js/app.js

import './bootstrap';
import Alpine from 'alpinejs';
import * as bootstrap from 'bootstrap';

// Make Alpine and Bootstrap available globally
window.Alpine = Alpine;
window.bootstrap = bootstrap;

Alpine.start();
