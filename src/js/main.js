import 'focus-visible';
import { generateButtons, BUTTONS_LAYOUT } from './buttons.js';
import {
  renderButtons,
  setButtonsListeners,
  setInputListeners,
} from './render.js';
import { fitInputContent } from './input.js';

const Buttons = generateButtons();

renderButtons(Buttons, BUTTONS_LAYOUT);
setButtonsListeners(Buttons);

fitInputContent();
setInputListeners();
