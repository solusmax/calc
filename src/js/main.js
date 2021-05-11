import 'focus-visible';
import { enableJs } from './util';
import { generateButtons, BUTTONS_LAYOUT } from './buttons.js';
import { renderButtons, setButtonsListeners, setInputListeners } from './render.js';
import { fitInputContent } from './input.js';

const Buttons = generateButtons();

enableJs();

renderButtons(Buttons, BUTTONS_LAYOUT);
setButtonsListeners(Buttons);

fitInputContent();
setInputListeners();
