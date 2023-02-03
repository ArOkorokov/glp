// Подключение плагина из node_modules
import SimpleBar from 'simplebar';
// Подключение стилей node_modules
import 'simplebar/dist/simplebar.css';

// Добавляем блок в атрибут data-simplebar

// Также можно инициализировать следующим кодом,используя настройки
/*
if (document.querySelectorAll('[data-simplebar]').length) {
	document.querySelectorAll('[data-simplebar]').forEach(scrollBlock => {
		new SimpleBar(scrollBlock, {
			autoHide: false
		});
	});
}
*/