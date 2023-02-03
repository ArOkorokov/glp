// модуль параллакса мышью
// (c)"Хмурый Кот"
// Документация: 

// Подключение функционала "чертоги фрилансера"
import { isMobile, FLS } from "../files/functions.js";
import { flsModules } from "../files/modules.js";

/*

Предмету, который будет двигаться за мышью, указать атрибут data-prlx-mouse.

// =========
Если требуется дополнительная настройка - указать

Атрибут											значение по-умолчанию
-------------------------------------------------------------------------------------------------------------------
data-prlx-cx="коефіцієнт_х"					100							значение больше – меньше процент сдвига
data-prlx-cy="коефіцієнт_y"					100							значение больше – меньше процент сдвига
data-prlx-dxr																		против осі X
data-prlx-dyr																		против осі Y
data-prlx-a="швидкість_анімації"				50								большее значение – больше скорость

// =========

Если нужно считывать движение мыши в блоке-отце – поэтому отцу указать атрибут data-prlx-mouse-wrapper


Если в параллакс картинка - растянуть ее на >100%. 
Пример:
	width: 130%;
	height: 130%;
	top: -15%;
	left: -15%;
*/
class MousePRLX {
	constructor(props, data = null) {
		let defaultConfig = {
			init: true,
			logging: true,
		}
		this.config = Object.assign(defaultConfig, props);
		if (this.config.init) {
			const paralaxMouse = document.querySelectorAll('[data-prlx-mouse]');
			if (paralaxMouse.length) {
				this.paralaxMouseInit(paralaxMouse);
				this.setLogging(`Прокинувся, стежу за об'єктами: (${paralaxMouse.length})`);
			} else {
				this.setLogging('Немає жодного обєкта. Сплю...zzZZZzZZz...');
			}
		}
	}
	paralaxMouseInit(paralaxMouse) {
		paralaxMouse.forEach(el => {
			const paralaxMouseWrapper = el.closest('[data-prlx-mouse-wrapper]');

			// Коеф. X 
			const paramСoefficientX = el.dataset.prlxCx ? +el.dataset.prlxCx : 100;
			// Коеф. У 
			const paramСoefficientY = el.dataset.prlxCy ? +el.dataset.prlxCy : 100;
			// Напр. Х
			const directionX = el.hasAttribute('data-prlx-dxr') ? -1 : 1;
			// Напр. У
			const directionY = el.hasAttribute('data-prlx-dyr') ? -1 : 1;
			// плавность анимации
			const paramAnimation = el.dataset.prlxA ? +el.dataset.prlxA : 50;


			// объявление переменных
			let positionX = 0, positionY = 0;
			let coordXprocent = 0, coordYprocent = 0;

			setMouseParallaxStyle();

			// Проверяю наличие отца, в котором будет считываться положение мыши
			if (paralaxMouseWrapper) {
				mouseMoveParalax(paralaxMouseWrapper);
			} else {
				mouseMoveParalax();
			}

			function setMouseParallaxStyle() {
				const distX = coordXprocent - positionX;
				const distY = coordYprocent - positionY;
				positionX = positionX + (distX * paramAnimation / 1000);
				positionY = positionY + (distY * paramAnimation / 1000);
				el.style.cssText = `transform: translate3D(${directionX * positionX / (paramСoefficientX / 10)}%,${directionY * positionY / (paramСoefficientY / 10)}%,0);`;
				requestAnimationFrame(setMouseParallaxStyle);
			}
			function mouseMoveParalax(wrapper = window) {
				wrapper.addEventListener("mousemove", function (e) {
					const offsetTop = el.getBoundingClientRect().top + window.scrollY;
					if (offsetTop >= window.scrollY || (offsetTop + el.offsetHeight) >= window.scrollY) {
						// Получение ширины и высоты блока
						const parallaxWidth = window.innerWidth;
						const parallaxHeight = window.innerHeight;
						// Ноль посередине
						const coordX = e.clientX - parallaxWidth / 2;
						const coordY = e.clientY - parallaxHeight / 2;
						// Получаем проценты
						coordXprocent = coordX / parallaxWidth * 100;
						coordYprocent = coordY / parallaxHeight * 100;
					}
				});
			}
		});
	}
	// логинг в консоль
	setLogging(message) {
		this.config.logging ? FLS(`[PRLX Mouse]: ${message}`) : null;
	}
}
// Запускаем и добавляем в объект модулей
flsModules.mousePrlx = new MousePRLX({});



