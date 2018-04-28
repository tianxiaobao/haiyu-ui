var myApp = angular.module("myApp", [
	'ui.router',
	'oc.lazyLoad',
	'ngAnimate',
	'ui.bootstrap',
	'ngCookies'
]);
layer.config({
    extend: ['/skin/moon/style.css'],
    skin: 'layer-ext-moon'
});