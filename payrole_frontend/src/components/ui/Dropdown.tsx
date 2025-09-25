import React, { useState, useRef, useEffect } from 'react';
import type { BaseComponentProps, DropdownItem } from '../../types';

interface DropdownProps extends BaseComponentProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  width?: 'auto' | 'full' | string;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'left',
  width = 'auto',
  disabled = false,
  className = '',
  id,
  testId,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleItemClick = (item: DropdownItem) => {
    if (!item.disabled) {
      item.onClick();
      setIsOpen(false);
    }
  };

  const alignClasses = {
    left: 'left-0',
    right: 'right-0',
  };

  const widthClasses = {
    auto: 'w-auto min-w-[12rem]',
    full: 'w-full',
  };

  const dropdownClasses = [
    'relative inline-block text-left',
    className,
  ].filter(Boolean).join(' ');

  const menuClasses = [
    'absolute z-50 mt-2 bg-white rounded-md shadow-lg border border-gray-200',
    'focus:outline-none',
    alignClasses[align],
    typeof width === 'string' && (width === 'auto' || width === 'full') 
      ? widthClasses[width as 'auto' | 'full']
      : '',
  ].filter(Boolean).join(' ');

  const menuStyle = typeof width === 'string' && width !== 'auto' && width !== 'full' 
    ? { width } 
    : {};

  return (
    <div
      ref={dropdownRef}
      className={dropdownClasses}
      id={id}
      data-testid={testId}
      {...props}
    >
      {/* Trigger */}
      <div onClick={handleToggle} className="cursor-pointer">
        {trigger}
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          className={menuClasses}
          style={menuStyle}
          role="menu"
          aria-orientation="vertical"
        >
          <div className="py-1">
            {items.map((item, index) => {
              if (item.divider) {
                return (
                  <div
                    key={`divider-${index}`}
                    className="border-t border-gray-200 my-1"
                  />
                );
              }

              return (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  disabled={item.disabled}
                  className={`
                    w-full text-left px-4 py-2 text-sm
                    flex items-center space-x-2
                    ${item.disabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                    transition-colors duration-150
                  `}
                  role="menuitem"
                >
                  {item.icon && (
                    <span className="flex-shrink-0">
                      {item.icon}
                    </span>
                  )}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
