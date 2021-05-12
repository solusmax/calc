import { calcBinary, calcUnary } from './calc.js';
import { addSymbolToInput, setInputValueToOpposite, removeLastSymbolInInput, setInputToDefault, clearCurrentEntry } from './input.js';
import { getConstantCaseFromKebabCase } from './util';

export const BUTTONS_LAYOUT = `"reciprocal  clear-entry  clear              backspace"
                               "power-2     power-3      square-root        divide"
                               "digit-7     digit-8      digit-9            multiplication"
                               "digit-4     digit-5      digit-6            minus"
                               "digit-1     digit-2      digit-3            plus"
                               "opposite    digit-0      decimal-separator  equals"`;

const BUTTON_CSS_CLASS = 'button';
const PARENT_BLOCK_CSS_CLASS = 'controls';

const Operations = new Set([
  {
    id: 'plus',
    label: '+',
    shortcuts: ['+'],
    fn: calcBinary.bind(null, '+'),
  },
  {
    id: 'minus',
    label: '−',
    shortcuts: ['-'],
    fn: calcBinary.bind(null, '-'),
  },
  {
    id: 'divide',
    label: '÷',
    shortcuts: ['/'],
    fn: calcBinary.bind(null, '/'),
  },
  {
    id: 'multiplication',
    label: '×',
    shortcuts: ['*'],
    fn: calcBinary.bind(null, '*'),
  },
  {
    id: 'decimal-separator',
    label: '.',
    shortcuts: ['.', ','],
    fn: addSymbolToInput.bind(null, '.'),
  },
  {
    id: 'opposite',
    label: '+/−',
    shortcuts: ['F9'],
    fn: setInputValueToOpposite,
  },
  {
    id: 'equals',
    label: '=',
    shortcuts: ['Enter', '='],
    fn: calcBinary.bind(null, '='),
  },
  {
    id: 'clear',
    label: 'C',
    shortcuts: ['Escape'],
    fn: setInputToDefault,
  },
  {
    id: 'clear-entry',
    label: 'CE',
    shortcuts: ['Delete'],
    fn: clearCurrentEntry,
  },
  {
    id: 'backspace',
    label: '←',
    shortcuts: ['Backspace'],
    fn: removeLastSymbolInInput,
  },
  {
    id: 'reciprocal',
    label: '1/x',
    shortcuts: ['r', 'R'],
    fn: calcUnary.bind(null, 'reciprocal'),
  },
  {
    id: 'power-2',
    label: `x<sup class="${BUTTON_CSS_CLASS}__sup">2</sup>`,
    shortcuts: ['q', 'Q'],
    fn: calcUnary.bind(null, 'power-2'),
  },
  {
    id: 'power-3',
    label: `x<sup class="${BUTTON_CSS_CLASS}__sup">3</sup>`,
    shortcuts: ['#'],
    fn: calcUnary.bind(null, 'power-3'),
  },
  {
    id: 'square-root',
    label: '√x',
    shortcuts: ['@'],
    fn: calcUnary.bind(null, 'square-root'),
  },
]);

const DIGITS = new Array(10).fill().map((__, index) => String(index));

DIGITS.forEach((digit) => {
  Operations.add({
    id: `digit-${digit}`,
    label: digit,
    shortcuts: [digit],
    classAttribute: `${PARENT_BLOCK_CSS_CLASS}__digit ${PARENT_BLOCK_CSS_CLASS}__digit-${digit} ${PARENT_BLOCK_CSS_CLASS}__${BUTTON_CSS_CLASS} ${BUTTON_CSS_CLASS} ${BUTTON_CSS_CLASS}--digit`,
    fn: addSymbolToInput.bind(null, digit),
  });
});

class Button {
  constructor(operation) {
    const { id, label, shortcuts, classAttribute, fn } = operation;

    this.id = id;
    this.label = label;
    this.shortcuts = shortcuts ?? [];
    this.classAttribute = classAttribute ?? `${PARENT_BLOCK_CSS_CLASS}__${this.id} ${PARENT_BLOCK_CSS_CLASS}__${BUTTON_CSS_CLASS} ${BUTTON_CSS_CLASS} ${BUTTON_CSS_CLASS}--${this.id}`;
    this.fn = fn ?? null;
  }
}

export const generateButtons = () => {
  const buttons = {};

  for (const operation of Operations) {
    const { id } = operation;

    buttons[getConstantCaseFromKebabCase(id)] = new Button(operation);
  }

  return buttons;
};

export const disableButtonsExceptClear = () => {
  const buttons = document.querySelector('.controls').querySelectorAll('.button');

  buttons.forEach((button) => {
    switch (button.id) {
      case 'clear':
      case 'clear-entry':
        break;
      default:
        button.disabled = true;
    }
  });
};

export const enableAllButtons = () => {
  const buttons = document.querySelector('.controls').querySelectorAll('.button');

  buttons.forEach((button) => {
    button.disabled = false;
  });
};
