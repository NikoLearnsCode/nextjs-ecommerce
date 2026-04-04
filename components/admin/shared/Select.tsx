import React, {useState, useRef, useEffect, forwardRef, useId} from 'react';
import {ChevronDown} from 'lucide-react';

interface Option {
  value: string | number;
  label: string;
}

interface CustomSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: Option[];
  placeholder?: string;
  hasError?: boolean;
  openUpward?: boolean;
  variant?: 'form' | 'compact';
}

const CustomSelect = forwardRef<HTMLSelectElement, CustomSelectProps>(
  (
    {
      options,
      placeholder = 'Choose...',
      className,
      hasError,
      openUpward = false,
      variant = 'form',
      ...props
    },
    ref,
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(props.value || '');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const selectRef = useRef<HTMLDivElement>(null);
    const wasOpenRef = useRef(false);
    const hiddenSelectRef = useRef<HTMLSelectElement>(null);
    const listboxId = useId();

    const selectedOption = options.find((opt) => opt.value == selectedValue);

    useEffect(() => {
      if (props.value !== undefined) {
        setSelectedValue(props.value);
      }
    }, [props.value]);

    useEffect(() => {
      if (!isOpen) {
        setHighlightedIndex(-1);
        wasOpenRef.current = false;
        return;
      }
      if (!wasOpenRef.current) {
        const idx = options.findIndex((o) => o.value == selectedValue);
        setHighlightedIndex(options.length === 0 ? -1 : idx >= 0 ? idx : 0);
      }
      wasOpenRef.current = true;
    }, [isOpen, options, selectedValue]);

    useEffect(() => {
      if (!isOpen || highlightedIndex < 0) return;
      const node = document.getElementById(
        `${listboxId}-opt-${highlightedIndex}`,
      );
      node?.scrollIntoView({block: 'nearest'});
    }, [highlightedIndex, isOpen, listboxId]);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          selectRef.current &&
          !selectRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleTriggerKeyDown = (
      event: React.KeyboardEvent<HTMLDivElement>,
    ) => {
      if (props.disabled) return;

      if (event.key === 'Escape') {
        if (isOpen) {
          event.preventDefault();
          setIsOpen(false);
        }
        return;
      }

      if (!isOpen) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          setIsOpen(true);
          return;
        }
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          setIsOpen(true);
        }
        return;
      }

      const last = options.length - 1;
      if (last < 0) return;

      if (event.key === 'ArrowDown') {
        event.preventDefault();
        setHighlightedIndex((i) => (i < 0 ? 0 : Math.min(last, i + 1)));
        return;
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        setHighlightedIndex((i) => Math.max(0, i < 0 ? 0 : i - 1));
        return;
      }
      if (event.key === 'Home') {
        event.preventDefault();
        setHighlightedIndex(0);
        return;
      }
      if (event.key === 'End') {
        event.preventDefault();
        setHighlightedIndex(last);
        return;
      }
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        const i = highlightedIndex >= 0 ? highlightedIndex : 0;
        const opt = options[i];
        if (opt) handleOptionClick(opt.value);
        return;
      }
      if (event.key === 'Tab') {
        setIsOpen(false);
      }
    };

    const handleOptionClick = (value: string | number) => {
      setSelectedValue(value);
      setIsOpen(false);

      // Trigger onChange on the hidden select
      if (hiddenSelectRef.current) {
        hiddenSelectRef.current.value = String(value);
        const event = new Event('change', {bubbles: true});
        hiddenSelectRef.current.dispatchEvent(event);
      }

      // Trigger props.onChange when provided
      if (props.onChange) {
        const syntheticEvent = {
          target: {
            name: props.name,
            value: String(value),
          },
        } as React.ChangeEvent<HTMLSelectElement>;
        props.onChange(syntheticEvent);
      }
    };

    return (
      <div className='relative'>
        {/* Hidden select for react-hook-form */}
        <select
          {...props}
          ref={(node) => {
            hiddenSelectRef.current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
          }}
          className='sr-only'
          tabIndex={-1}
          value={selectedValue}
          onChange={() => {}} // Handled by custom UI
        >
          <option value=''>{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {/* Custom UI */}
        <div
          ref={selectRef}
          role='combobox'
          aria-expanded={isOpen}
          aria-haspopup='listbox'
          aria-controls={isOpen ? listboxId : undefined}
          aria-activedescendant={
            isOpen && highlightedIndex >= 0 && highlightedIndex < options.length
              ? `${listboxId}-opt-${highlightedIndex}`
              : undefined
          }
          aria-invalid={hasError ? true : undefined}
          tabIndex={props.disabled ? -1 : 0}
          className={`${className} cursor-pointer group relative outline-gray-400  ${variant === 'compact' ? 'text-sm' : 'text-sm'} ${props.disabled ? 'opacity-50 pointer-events-none' : ''}`}
          style={{ outlineOffset: -2 }}
          onClick={() => !props.disabled && setIsOpen(!isOpen)}
          onKeyDown={handleTriggerKeyDown}
        >
          <div
            className={`flex border  items-center justify-between px-3 ${
              variant === 'compact'
                ? `h-8 ${isOpen ? 'border-gray-400' : 'border-gray-300 hover:border-gray-400'}`
                : `h-12 ${isOpen ? 'border-gray-500' : 'border-gray-400/70 group-hover:border-gray-500'}`
            } ${hasError ? 'border-red-500' : ''}`}
          >
            <span
              className={`${selectedOption ? 'text-black' : 'text-gray-500'} group-hover:border-black `}
            >
              {selectedOption ? selectedOption.label : placeholder}
            </span>
            <ChevronDown
              className={`w-5 h-5 text-gray-400 transition-transform group-hover:border-gray-500 ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>

          {isOpen && (
            <div
              id={listboxId}
              role='listbox'
              className={`absolute max-h-64 overflow-y-auto left-0 right-0 z-50 bg-white border text-gray-500 ${
                variant === 'compact' ? 'border-gray-400' : 'border-gray-500'
              } ${
                openUpward
                  ? 'bottom-full -mb-0.5 border-b-0'
                  : 'top-full -mt-1 border-t-0'
              }`}
            >
              {options.map((option, index) => {
                const isSelected = option.value == selectedValue;
                const isHighlighted = index === highlightedIndex;
                return (
                  <div
                    key={option.value}
                    id={`${listboxId}-opt-${index}`}
                    role='option'
                    aria-selected={isSelected}
                    className={`px-3 cursor-pointer hover:text-black hover:bg-gray-100 ${
                      variant === 'compact' ? 'py-1.75' : 'py-3'
                    } ${
                      isHighlighted
                        ? 'bg-gray-200 text-black ring-1 ring-inset ring-gray-400 '
                        : ''
                    }${
                      isSelected && !isHighlighted
                        ? 'bg-gray-100 font-medium text-black '
                        : ''
                    }${isSelected && isHighlighted ? ' font-medium ' : ''}`}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onClick={() => handleOptionClick(option.value)}
                  >
                    {option.label}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  },
);

CustomSelect.displayName = 'CustomSelect';

export default CustomSelect;
