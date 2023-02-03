import { isMobile } from "../files/functions.js";
import { flsModules } from "../files/modules.js";

/*
	data-fp - оболочка
	data-fp-section - секции

	переход на определённый сайт
	fpage.switchingSection(id);

	Встановлення z-index
	fPage.init();
	fPage.destroy();
	fPage.setZIndex();

	id активного слайда
	fPage.activeSectionId
	Активний слайд
	fPage.activeSection

	События
	fpinit
	fpdestroy
	fpswitching
*/

// Клас FullPage
export class FullPage {
	constructor(element, options) {
		let config = {
			//===============================
			// Селектор, на котором не работает событие свайпа/колеса
			noEventSelector: '[data-no-event]',
			//===============================
			// Настройка оболочки
			// класс при инициализации слайдера
			classInit: 'fp-init',
			// Класс для враппера в момент пролистывания
			wrapperAnimatedClass: 'fp-switching',
			//===============================
			// Настройка секции
			// СЕЛЕКТОР для секции
			selectorSection: '[data-fp-section]',
			// Клас для активной секции
			activeClass: 'active-section',
			// Класс для Предыдущей секции
			previousClass: 'previous-section',
			// Класс для следующей секции
			nextClass: 'next-section',
			// id начально активного класса
			idActiveSection: 0,
			//===============================
			// другие настройки
			// Свайп мышью
			// touchSimulator: false,
			//===============================
			// Эффекты
			// Эффукты: fade, cards, slider
			mode: element.dataset.fpEffect ? element.dataset.fpEffect : 'slider',
			//===============================
			// Булеты
			// Активация буллетов
			bullets: element.hasAttribute('data-fp-bullets') ? true : false,
			// класс оболочки буллетов
			bulletsClass: 'fp-bullets',
			// Класс буллета
			bulletClass: 'fp-bullet',
			// Класс активного буллета
			bulletActiveClass: 'fp-bullet-active',
			//===============================
			// события
			// события сотворения
			onInit: function () { },
			// Событие перелистывания секции
			onSwitching: function () { },
			// события разрушения плагина
			onDestroy: function () { },
		}
		this.options = Object.assign(config, options);
		// Родительский элемент
		this.wrapper = element;
		this.sections = this.wrapper.querySelectorAll(this.options.selectorSection);
		// Активный слайд
		this.activeSection = false;
		this.activeSectionId = false;
		// Предыдущий слайд
		this.previousSection = false;
		this.previousSectionId = false;
		// Следующий слайд
		this.nextSection = false;
		this.nextSectionId = false;
		// оболочка буллетов
		this.bulletsWrapper = false;
		// Вспомогательная переменная
		this.stopEvent = false;
		if (this.sections.length) {
			// Инициализация элементов
			this.init();
		}
	}
	//===============================
	// Начальная инициализация
	init() {
		if (this.options.idActiveSection > (this.sections.length - 1)) return
		// Расставляем ID
		this.setId();
		this.activeSectionId = this.options.idActiveSection;
		// Присвоение классов с разными эффектами
		this.setEffectsClasses();
		// Установка классов
		this.setClasses();
		// восстановление стилей
		this.setStyle();
		// Восстановление буллетов
		if (this.options.bullets) {
			this.setBullets();
			this.setActiveBullet(this.activeSectionId);
		}
		// Восстановления событий
		this.events();
		// Устанавливаем init класс
		setTimeout(() => {
			document.documentElement.classList.add(this.options.classInit);
			// Создание кастомного события
			this.options.onInit(this);
			document.dispatchEvent(new CustomEvent("fpinit", {
				detail: {
					fp: this
				}
			}));
		}, 0);
	}
	//===============================
	// Удаление
	destroy() {
		// Удаление событий
		this.removeEvents();
		// Удаление классов в секциях
		this.removeClasses();
		// Удаление класса инициализации
		document.documentElement.classList.remove(this.options.classInit);
		// Удаление класса анимации
		this.wrapper.classList.remove(this.options.wrapperAnimatedClass);
		// Удаление класса эффектов
		this.removeEffectsClasses();
		// Удаление z-index у секций
		this.removeZIndex();
		// Выделения стилей
		this.removeStyle();
		// Выделение ID
		this.removeId();
		// Создание кастомного события
		this.options.onDestroy(this);
		document.dispatchEvent(new CustomEvent("fpdestroy", {
			detail: {
				fp: this
			}
		}));
	}
	//===============================
	// установка ID для секции
	setId() {
		for (let index = 0; index < this.sections.length; index++) {
			const section = this.sections[index];
			section.setAttribute('data-fp-id', index);
		}
	}
	//===============================
	// Удаление ID секции
	removeId() {
		for (let index = 0; index < this.sections.length; index++) {
			const section = this.sections[index];
			section.removeAttribute('data-fp-id');
		}
	}
	//===============================
	//Функция установки классов для первой, активной и следующей секций
	setClasses() {
		// Сохранение id для ПРЕДЫДУЩЕГО слайда (если таковой есть)
		this.previousSectionId = (this.activeSectionId - 1) >= 0 ?
			this.activeSectionId - 1 : false;

		// Сохранение id для СЛЕДУЮЩЕГО слайда (если таковой есть)
		this.nextSectionId = (this.activeSectionId + 1) < this.sections.length ?
			this.activeSectionId + 1 : false;

		// Установка класса и присвоение элемента для активного слайда
		this.activeSection = this.sections[this.activeSectionId];
		this.activeSection.classList.add(this.options.activeClass);

		// Установка класса и присвоение элемента для ПРЕДЫДУЩЕГО слайда
		if (this.previousSectionId !== false) {
			this.previousSection = this.sections[this.previousSectionId];
			this.previousSection.classList.add(this.options.previousClass);
		} else {
			this.previousSection = false;
		}

		// Установка класса и присвоение элемента для СЛЕДУЮЩЕГО слайда
		if (this.nextSectionId !== false) {
			this.nextSection = this.sections[this.nextSectionId];
			this.nextSection.classList.add(this.options.nextClass);
		} else {
			this.nextSection = false;
		}
	}
	//===============================
	// Присвоение классов с разными эффектами
	removeEffectsClasses() {
		switch (this.options.mode) {
			case 'slider':
				this.wrapper.classList.remove('slider-mode');
				break;

			case 'cards':
				this.wrapper.classList.remove('cards-mode');
				this.setZIndex();
				break;

			case 'fade':
				this.wrapper.classList.remove('fade-mode');
				this.setZIndex();
				break;

			default:
				break;
		}
	}
	//===============================
	// Присвоение классов с разными эффектами
	setEffectsClasses() {
		switch (this.options.mode) {
			case 'slider':
				this.wrapper.classList.add('slider-mode');
				break;

			case 'cards':
				this.wrapper.classList.add('cards-mode');
				this.setZIndex();
				break;

			case 'fade':
				this.wrapper.classList.add('fade-mode');
				this.setZIndex();
				break;

			default:
				break;
		}
	}
	//===============================
	//Блокировка направлений скролла
	//===============================
	// Функция установки стилей
	setStyle() {
		switch (this.options.mode) {
			case 'slider':
				this.styleSlider();
				break;

			case 'cards':
				this.styleCards();
				break;

			case 'fade':
				this.styleFade();
				break;
			default:
				break;
		}
	}
	// slider-mode
	styleSlider() {
		for (let index = 0; index < this.sections.length; index++) {
			const section = this.sections[index];
			if (index === this.activeSectionId) {
				section.style.transform = 'translate3D(0,0,0)';
			} else if (index < this.activeSectionId) {
				section.style.transform = 'translate3D(0,-100%,0)';
			} else if (index > this.activeSectionId) {
				section.style.transform = 'translate3D(0,100%,0)';
			}
		}
	}
	// cards mode
	styleCards() {
		for (let index = 0; index < this.sections.length; index++) {
			const section = this.sections[index];
			if (index >= this.activeSectionId) {
				section.style.transform = 'translate3D(0,0,0)';
			} else if (index < this.activeSectionId) {
				section.style.transform = 'translate3D(0,-100%,0)';
			}
		}
	}
	// fade style 
	styleFade() {
		for (let index = 0; index < this.sections.length; index++) {
			const section = this.sections[index];
			if (index === this.activeSectionId) {
				section.style.opacity = '1';
				section.style.visibility = 'visible';
			} else {
				section.style.opacity = '0';
				section.style.visibility = 'hidden';
			}
		}
	}
	//===============================
	// Удаление стилей
	removeStyle() {
		for (let index = 0; index < this.sections.length; index++) {
			const section = this.sections[index];
			section.style.opacity = '';
			section.style.visibility = '';
			section.style.transform = '';
		}
	}
	//===============================
	// Функция проверки полностью ли прокручен элемент
	checkScroll(yCoord, element) {
		this.goScroll = false;

		// Есть ли элемент и готов ли к работе
		if (!this.stopEvent && element) {
			this.goScroll = true;
			// Если высота секции не равна высоте окна
			if (this.haveScroll(element)) {
				this.goScroll = false;
				const position = Math.round(element.scrollHeight - element.scrollTop);
				// Проверка на то, полностью ли прокручена секция
				if (
					((Math.abs(position - element.scrollHeight) < 2) && yCoord <= 0) ||
					((Math.abs(position - element.clientHeight) < 2) && yCoord >= 0)
				) {
					this.goScroll = true;
				}
			}
		}
	}
	//===============================
	// Проверка высоты
	haveScroll(element) {
		return element.scrollHeight !== window.innerHeight
	}
	//===============================
	// Установление классов
	removeClasses() {
		for (let index = 0; index < this.sections.length; index++) {
			const section = this.sections[index];
			section.classList.remove(this.options.activeClass);
			section.classList.remove(this.options.previousClass);
			section.classList.remove(this.options.nextClass);
		}
	}
	//===============================
	// Сборщик событий
	events() {
		this.events = {
			// Колесо мыши
			wheel: this.wheel.bind(this),

			// Свайп
			touchdown: this.touchDown.bind(this),
			touchup: this.touchUp.bind(this),
			touchmove: this.touchMove.bind(this),
			touchcancel: this.touchUp.bind(this),

			// Конец анимации
			transitionEnd: this.transitionend.bind(this),

			// Клик для буллетов
			click: this.clickBullets.bind(this),
		}
		if (isMobile.iOS()) {
			document.addEventListener('touchmove', (e) => {
				e.preventDefault();
			});
		}
		this.setEvents();
	}
	setEvents() {
		// событие колеса мыши
		this.wrapper.addEventListener('wheel', this.events.wheel);
		// событие наведения на икрат
		this.wrapper.addEventListener('touchstart', this.events.touchdown);
		// событие клика по булетам
		if (this.options.bullets && this.bulletsWrapper) {
			this.bulletsWrapper.addEventListener('click', this.events.click);
		}
	}
	removeEvents() {
		this.wrapper.removeEventListener('wheel', this.events.wheel);
		this.wrapper.removeEventListener('touchdown', this.events.touchdown);
		this.wrapper.removeEventListener('touchup', this.events.touchup);
		this.wrapper.removeEventListener('touchcancel', this.events.touchup);
		this.wrapper.removeEventListener('touchmove', this.events.touchmove);
		if (this.bulletsWrapper) {
			this.bulletsWrapper.removeEventListener('click', this.events.click);
		}
	}
	//===============================
	// функция клика по буллетам
	clickBullets(e) {
		// Нажатый булет
		const bullet = e.target.closest(`.${this.options.bulletClass}`);
		if (bullet) {
			// Массив всех буллетов
			const arrayChildren = Array.from(this.bulletsWrapper.children);

			// id нажатого буллета
			const idClickBullet = arrayChildren.indexOf(bullet)

			// Переключение секции
			this.switchingSection(idClickBullet)
		}
	}
	//===============================
	// установка стилей для буллетов
	setActiveBullet(idButton) {
		if (!this.bulletsWrapper) return
		// Все буллеты
		const bullets = this.bulletsWrapper.children;

		for (let index = 0; index < bullets.length; index++) {
			const bullet = bullets[index];
			if (idButton === index) bullet.classList.add(this.options.bulletActiveClass);
			else bullet.classList.remove(this.options.bulletActiveClass);
		}
	}
	//===============================
	// Функция наведения тач/пера/курсора
	touchDown(e) {
		// Сменно для свайпа
		this._yP = e.changedTouches[0].pageY;
		this._eventElement = e.target.closest(`.${this.options.activeClass}`);
		if (this._eventElement) {
			// Вешаем событие touchmove на touchup
			this._eventElement.addEventListener('touchend', this.events.touchup);
			this._eventElement.addEventListener('touchcancel', this.events.touchup);
			this._eventElement.addEventListener('touchmove', this.events.touchmove);
			// случился тач
			this.clickOrTouch = true;

			//==============================
			if (isMobile.iOS()) {
				if (this._eventElement.scrollHeight !== this._eventElement.clientHeight) {
					if (this._eventElement.scrollTop === 0) {
						this._eventElement.scrollTop = 1;
					}
					if (this._eventElement.scrollTop === this._eventElement.scrollHeight - this._eventElement.clientHeight) {
						this._eventElement.scrollTop = this._eventElement.scrollHeight - this._eventElement.clientHeight - 1;
					}
				}
				this.allowUp = this._eventElement.scrollTop > 0;
				this.allowDown = this._eventElement.scrollTop < (this._eventElement.scrollHeight - this._eventElement.clientHeight);
				this.lastY = e.changedTouches[0].pageY;
			}
			//===============================

		}


	}
	//===============================
	//Событие движения тач/пера/курсора
	touchMove(e) {
		// Получение секции, на которой срабатывает событие
		const targetElement = e.target.closest(`.${this.options.activeClass}`);
		//===============================
		if (isMobile.iOS()) {
			let up = e.changedTouches[0].pageY > this.lastY;
			let down = !up;
			this.lastY = e.changedTouches[0].pageY;
			if (targetElement) {
				if ((up && this.allowUp) || (down && this.allowDown)) {
					e.stopPropagation();
				} else if (e.cancelable) {
					e.preventDefault();
				}
			}
		}
		//===============================
		// Перевірка на завершення анімації та наявність НЕ ПОДІЙНОГО блоку
		if (!this.clickOrTouch || e.target.closest(this.options.noEventSelector)) return
		// Отримання напряму руху
		let yCoord = this._yP - e.changedTouches[0].pageY;
		// Чи дозволено перехід? 
		this.checkScroll(yCoord, targetElement);
		// Перехід
		if (this.goScroll && Math.abs(yCoord) > 20) {
			this.choiceOfDirection(yCoord);
		}
	}
	//===============================
	// Проверка завершения анимации и наличие НЕ СОБЫТИЕГО блока
	touchUp(e) {
		// Удаление событий
		this._eventElement.removeEventListener('touchend', this.events.touchup);
		this._eventElement.removeEventListener('touchcancel', this.events.touchup);
		this._eventElement.removeEventListener('touchmove', this.events.touchmove);
		return this.clickOrTouch = false;
	}
	//===============================
	// Конец срабатывания перехода
	transitionend(e) {
		if (e.target.closest(this.options.selectorSection)) {
			this.stopEvent = false;
			this.wrapper.classList.remove(this.options.wrapperAnimatedClass);
		}
	}
	//===============================
	// событие прокручивания колесом мыши
	wheel(e) {
		// Проверка на наличие НЕ СОБЫТАННОГО блока
		if (e.target.closest(this.options.noEventSelector)) return
		// Получение направления движения
		const yCoord = e.deltaY;
		// Получение секции, на которой срабатывает событие
		const targetElement = e.target.closest(`.${this.options.activeClass}`);
		// Разрешен ли переход? 
		this.checkScroll(yCoord, targetElement);
		// Переход
		if (this.goScroll) this.choiceOfDirection(yCoord);
	}
	//===============================
	// Функция выбора направления
	choiceOfDirection(direction) {
		// Останавливаем работу событий
		this.stopEvent = true;

		// Если слайд крайний, то разрешаем события
		if (((this.activeSectionId === 0) && direction < 0) || ((this.activeSectionId === (this.sections.length - 1)) && direction > 0)) {
			this.stopEvent = false;
		}

		// Установка нужных ID
		if (direction > 0 && this.nextSection !== false) {
			this.activeSectionId = (this.activeSectionId + 1) < this.sections.length ?
				++this.activeSectionId : this.activeSectionId;
		} else if (direction < 0 && this.previousSection !== false) {
			this.activeSectionId = (this.activeSectionId - 1) >= 0 ?
				--this.activeSectionId : this.activeSectionId;
		}

		// Смена слайдов
		if (this.stopEvent) this.switchingSection();
	}
	//===============================
	// Функция переключения слайдов
	switchingSection(idSection = this.activeSectionId) {
		this.activeSectionId = idSection;
		// Установка события окончания воспроизведения анимации
		this.wrapper.classList.add(this.options.wrapperAnimatedClass);
		this.wrapper.addEventListener('transitionend', this.events.transitionEnd);
		// Удаление классов
		this.removeClasses();
		// Смена классов
		this.setClasses();
		// смена стиллей
		this.setStyle();
		// Установка стилей для буллетов
		if (this.options.bullets) this.setActiveBullet(this.activeSectionId);
		// Создание событий
		this.options.onSwitching(this);
		document.dispatchEvent(new CustomEvent("fpswitching", {
			detail: {
				fp: this
			}
		}));
	}
	//===============================
	// Установка буллетов
	setBullets() {
		// Поиск оболочки буллетов
		this.bulletsWrapper = document.querySelector(`.${this.options.bulletsClass}`);

		// Если нет создаём
		if (!this.bulletsWrapper) {
			const bullets = document.createElement('div');
			bullets.classList.add(this.options.bulletsClass);
			this.wrapper.append(bullets);
			this.bulletsWrapper = bullets;
		}

		// Создание буллетов
		if (this.bulletsWrapper) {
			for (let index = 0; index < this.sections.length; index++) {
				const span = document.createElement('span');
				span.classList.add(this.options.bulletClass);
				this.bulletsWrapper.append(span);
			}
		}
	}
	//===============================
	// Z-INDEX
	setZIndex() {
		let zIndex = this.sections.length
		for (let index = 0; index < this.sections.length; index++) {
			const section = this.sections[index];
			section.style.zIndex = zIndex;
			--zIndex;
		}
	}
	removeZIndex() {
		for (let index = 0; index < this.sections.length; index++) {
			const section = this.sections[index];
			section.style.zIndex = ''
		}
	}
}
// Запускаем и добавляем в объект модулей
if (document.querySelector('[data-fp]')) {
	flsModules.fullpage = new FullPage(document.querySelector('[data-fp]'), '');
}
