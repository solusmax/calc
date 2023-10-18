import { throttle } from 'lodash';
import {
  arrayToSpaceSeparatedString,
  getConstantCaseFromKebabCase,
} from './util.js';
import { fitInputContent } from './input.js';

const ioInputNode = document.querySelector('.input__field');
const controlsNode = document.querySelector('.controls');

const generateButtonTemplate = (button) => {
  const { id, label, classAttribute } = button;

  return `<button class="${classAttribute}" id="${id}" type="button" tabindex="-1" style="grid-area: ${id}">${label}</button>`;
};

export const renderButtons = (buttons, buttonsLayout) => {
  const addedButtons = [];
  let buttonsFragment = '';

  for (const key of Object.keys(buttons)) {
    const button = buttons[key];
    const buttonId = button.id;

    buttonsFragment += generateButtonTemplate(button);
    addedButtons.push(buttonId);
  }

  controlsNode.style.gridTemplateAreas = buttonsLayout;
  ioInputNode.htmlFor = arrayToSpaceSeparatedString(addedButtons);
  controlsNode.insertAdjacentHTML('beforeend', buttonsFragment);
};

const onControlsClick = (buttons) => {
  return (evt) => {
    if (evt.target !== undefined && evt.target !== controlsNode) {
      evt.preventDefault();

      const buttonKey = getConstantCaseFromKebabCase(evt.target.id);
      const buttonFunction = buttons[buttonKey].fn;

      buttonFunction();
    }
  };
};

const onKeydown = (buttons) => {
  return (evt) => {
    for (const key of Object.keys(buttons)) {
      if (!evt.ctrlKey && !evt.altKey) {
        const button = buttons[key];
        const buttonFunction = button.fn;
        const buttonShortcuts = button.shortcuts;

        for (const buttonShortcut of buttonShortcuts) {
          if (evt.key === buttonShortcut) {
            evt.preventDefault();
            buttonFunction();
            return;
          }
        }
      }
    }
  };
};

export const setButtonsListeners = (buttons) => {
  controlsNode.addEventListener('click', onControlsClick(buttons));
  window.addEventListener('keydown', onKeydown(buttons));
};

const onInputResize = () => {
  fitInputContent();
};

export const setInputListeners = () => {
  window.addEventListener('resize', throttle(onInputResize, 50));
};
