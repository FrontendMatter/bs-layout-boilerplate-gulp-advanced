// Vendor libraries
// jQuery
window.$ = window.jQuery = require('jquery');

// Tether (required by Bootstrap 4)
window.Tether = require('tether');

// Bootstrap 4
require('bootstrap');

// AdminPlus Lite
var BootstrapLayout = require('bootstrap-layout');

// Initialize Sidebars
BootstrapLayout.Sidebar.init();

// Initialize Scrollbars
BootstrapLayout.Scrollable();