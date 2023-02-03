import LazyLoad from "vanilla-lazyload";

// работаем с объектами классами ._lazy
const lazyMedia = new LazyLoad({
	elements_selector: '[data-src],[data-srcset]',
	class_loaded: '_lazy-loaded',
	use_native: true
});

// обновить модуль
//lazyMedia.update();