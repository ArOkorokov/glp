// Подключаем функционал "чертоги фрилансера"
import { isMobile, FLS } from "./functions.js";
// подключение списка активных модулей
import { flsModules } from "./modules.js";

// подключение из node_modules
import tippy from 'tippy.js';

// Подключение стилей из src/scss/libs
import "../../scss/libs/tippy.scss";
// Подключение стилей из node_modules
//import 'tippy.js/dist/tippy.css';

// Запускаем и добавляем в объект модули
flsModules.tippy = tippy('[data-tippy-content]', {

});