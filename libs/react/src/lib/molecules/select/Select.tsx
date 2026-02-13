import { useEffect, useRef, useState } from 'react';
import { Text } from '../../atoms/Text/Text.js';
import React from 'react';

const KeyCode = {
  // Navigation
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',

  // Action/Functional
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  SPACE: 'Space',
  BACKSPACE: 'Backspace',
  TAB: 'Tab',
  DELETE: 'Delete',

  // Modifiers
  SHIFT_LEFT: 'ShiftLeft',
  SHIFT_RIGHT: 'ShiftRight',
  CTRL_LEFT: 'ControlLeft',
  ALT_LEFT: 'AltLeft',
  META_LEFT: 'MetaLeft', // Cmd (Mac) or Win (Windows) // Alphanumeric Example
  A: 'KeyA',
  S: 'KeyS',
  D: 'KeyD',
  W: 'KeyW',
};

interface SelectOption {
  label: string;
  value: string;
}

interface RenderOptionProps {
  isSelected: boolean;
  option: SelectOption;
  getOptionRecommendedProps: (overrideProps?: Object) => Object;
}

interface SelectProps {
  onOptionSelect?: (option: SelectOption, optionIndex: number) => void;
  options?: SelectOption[];
  label?: string;
  renderOption?: (props: RenderOptionProps) => React.ReactNode;
}

const getPrevOptionIndex = (
  currentIndex: number | null,
  options: Array<SelectOption>
) => {
  if (currentIndex === null) {
    return 0;
  }
  if (currentIndex === 0) {
    return options.length - 1;
  }
  return currentIndex - 1;
};

const getNextOptionIndex = (
  currentIndex: number | null,
  options: Array<SelectOption>
) => {
  if (currentIndex === null) {
    return 0;
  }
  if (currentIndex === options.length - 1) {
    return 0;
  }
  return currentIndex + 1;
};

export function Select({
  options = [],
  label = 'Select option',
  onOptionSelect: handler,
  renderOption,
}: Readonly<SelectProps>) {
  const labelRef = useRef<HTMLButtonElement>(null);
  const [optionRefs, setOptionRefs] = useState<
    React.RefObject<HTMLLIElement | null>[]
  >([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null);
  const [overlayTop, setOverlayTop] = useState<number>(0);

  const onOptionSelected = (option: SelectOption, optionIndex: number) => {
    if (handler) {
      handler(option, optionIndex);
    }
    setSelectedIndex(optionIndex);
    setIsOpen(false);
  };

  const onLabelClick = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    setOverlayTop((labelRef.current?.offsetHeight || 0) + 10);
  }, [labelRef.current?.offsetHeight]);

  let selectedOption = null;
  if (selectedIndex !== null) {
    selectedOption = options[selectedIndex];
  }

  const highlightOption = (index: number | null) => {
    setHighlightedIndex(index);
  };

  const onButtonKeyDown: React.KeyboardEventHandler = (event) => {
    event.preventDefault();
    if ([KeyCode.SPACE, KeyCode.UP, KeyCode.DOWN].includes(event.code)) {
      setIsOpen(true);
      if (event.code === KeyCode.SPACE || event.code === KeyCode.DOWN) {
        highlightOption(0);
      }
      // if (event.code === KeyCode.UP) {
      //   highlightOption(options.length - 1);
      // }
    }
  };

  useEffect(() => {
    setOptionRefs(options.map(() => React.createRef<HTMLLIElement>()));
  }, [options.length]);

  useEffect(() => {
    if (highlightedIndex !== null && isOpen) {
      const ref = optionRefs[highlightedIndex];
      if (ref && ref.current) {
        ref.current.focus();
      }
    }
  }, [isOpen, highlightedIndex]);

  const onOptionKeyDown: React.KeyboardEventHandler = (event) => {
    event.preventDefault();

    if (event.code === KeyCode.ESCAPE) {
      setIsOpen(false);
      return;
    }

    if (event.code === KeyCode.DOWN) {
      highlightOption(getNextOptionIndex(highlightedIndex, options));
    }

    if (event.code === KeyCode.UP) {
      highlightOption(getPrevOptionIndex(highlightedIndex, options));
    }
    if (event.code === KeyCode.ENTER) {
      onOptionSelected(options[highlightedIndex!], highlightedIndex!);
    }
  };

  return (
    <div className="dse-select">
      <button
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        ref={labelRef}
        className="dse-select__label"
        onKeyDown={onButtonKeyDown}
        onClick={() => onLabelClick()}
      >
        <span>{selectedOption === null ? label : selectedOption.label}</span>
        <svg
          width="1rem"
          height="1rem"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={`dse-select__caret ${
            isOpen ? 'dse-select__caret--open' : 'dse-select__caret--closed'
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m19.5 8.25-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>
      {isOpen ? (
        <ul
          role="listbox"
          style={{ top: overlayTop }}
          className="dse-select__overlay"
        >
          {options.map((option, index) => {
            const isSelected = selectedIndex === index;
            const isHighlighted = highlightedIndex === index;

            const ref = optionRefs[index];
            const renderOptionProps = {
              isSelected,
              option,
              getOptionRecommendedProps: (overrideProps = {}) => {
                return {
                  ref,
                  role: 'menuitemradio',
                  'aria-label': option.label,
                  'aria-checked': isSelected ? true : undefined,
                  onKeyDown: onOptionKeyDown,
                  tabIndex: isHighlighted ? -1 : 0,
                  onMouseEnter: () => setHighlightedIndex(index),
                  onMouseLeave: () => setHighlightedIndex(null),
                  className: `dse-select__option
                    ${isSelected ? 'dse-select__option--selected' : ''}
                    ${isHighlighted ? 'dse-select__option--highlighted' : ''}`,

                  onClick: () => onOptionSelected(option, index),
                  ...overrideProps,
                };
              },
            };

            if (renderOption) {
              return renderOption(renderOptionProps);
            }

            return (
              <li
                key={option.value}
                {...renderOptionProps.getOptionRecommendedProps()}
              >
                <Text>{option.label}</Text>

                {isSelected ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="1rem"
                    height="1rem"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m4.5 12.75 6 6 9-13.5"
                    />
                  </svg>
                ) : null}
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
