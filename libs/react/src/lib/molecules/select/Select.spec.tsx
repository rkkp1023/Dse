import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Select } from './Select.js';

const mockOptions = [
  { label: 'Option 1', value: 'option-1' },
  { label: 'Option 2', value: 'option-2' },
  { label: 'Option 3', value: 'option-3' },
];

describe('Select Component', () => {
  describe('Rendering', () => {
    it('should render with default label', () => {
      render(<Select options={mockOptions} />);
      expect(screen.getByText('Select option')).toBeInTheDocument();
    });

    it('should render with custom label', () => {
      render(<Select options={mockOptions} label="Choose an option" />);
      expect(screen.getByText('Choose an option')).toBeInTheDocument();
    });

    it('should render button with correct ARIA attributes', () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-haspopup', 'listbox');
      expect(button).toHaveAttribute('aria-expanded', 'false');
    });

    it('should not render options overlay when closed', () => {
      render(<Select options={mockOptions} />);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should render caret icon', () => {
      const { container } = render(<Select options={mockOptions} />);
      const svg = container.querySelector('.dse-select__caret');
      expect(svg).toBeInTheDocument();
    });
  });

  describe('Opening and Closing', () => {
    it('should open overlay when button is clicked', () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('should close overlay when button is clicked again', () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      fireEvent.click(button);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should display all options when opened', () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      mockOptions.forEach((option) => {
        expect(screen.getByText(option.label)).toBeInTheDocument();
      });
    });

    it('should apply open class to caret when opened', () => {
      const { container } = render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);

      const caret = container.querySelector('.dse-select__caret--open');
      expect(caret).toBeInTheDocument();
    });
  });

  describe('Option Selection', () => {
    it('should call onOptionSelect when an option is clicked', () => {
      const handleSelect = vi.fn();
      render(<Select options={mockOptions} onOptionSelect={handleSelect} />);

      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('Option 2'));

      expect(handleSelect).toHaveBeenCalledWith(mockOptions[1], 1);
    });

    it('should update label to selected option', () => {
      render(<Select options={mockOptions} />);

      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('Option 2'));

      expect(screen.getByText('Option 2')).toBeInTheDocument();
    });

    it('should close overlay after selection', () => {
      render(<Select options={mockOptions} />);

      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('Option 1'));

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should show checkmark icon for selected option', () => {
      render(<Select options={mockOptions} />);

      fireEvent.click(screen.getByRole('button'));
      const options = screen.getAllByRole('menuitemradio');
      fireEvent.click(options[1]); // Click Option 2

      fireEvent.click(screen.getByRole('button'));

      const selectedOption = screen.getAllByRole('menuitemradio')[1];
      const checkmark = selectedOption.querySelector('svg');
      expect(checkmark).toBeInTheDocument();
    });

    it('should apply selected class to selected option', () => {
      render(<Select options={mockOptions} />);

      fireEvent.click(screen.getByRole('button'));
      const options = screen.getAllByRole('menuitemradio');
      fireEvent.click(options[0]); // Click Option 1

      fireEvent.click(screen.getByRole('button'));

      const selectedOption = screen.getAllByRole('menuitemradio')[0];
      expect(selectedOption).toHaveClass('dse-select__option--selected');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should open overlay on Space key', () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');

      fireEvent.keyDown(button, { code: 'Space' });

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('should open overlay on ArrowDown key', () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');

      fireEvent.keyDown(button, { code: 'ArrowDown' });

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('should open overlay on ArrowUp key', () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');

      fireEvent.keyDown(button, { code: 'ArrowUp' });

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });

    it('should highlight first option on Space or ArrowDown', async () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');

      fireEvent.keyDown(button, { code: 'Space' });

      await waitFor(() => {
        const firstOption = screen.getByText('Option 1').closest('li');
        expect(firstOption).toHaveClass('dse-select__option--highlighted');
      });
    });

    it('should close overlay on Escape key', () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);
      expect(screen.getByRole('listbox')).toBeInTheDocument();

      const option = screen.getByText('Option 1').closest('li');
      fireEvent.keyDown(option!, { code: 'Escape' });

      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });

    it('should navigate down through options with ArrowDown', async () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');

      fireEvent.keyDown(button, { code: 'ArrowDown' });

      await waitFor(() => {
        const firstOption = screen.getByText('Option 1').closest('li');
        expect(firstOption).toHaveClass('dse-select__option--highlighted');
      });

      const firstOption = screen.getByText('Option 1').closest('li');
      fireEvent.keyDown(firstOption!, { code: 'ArrowDown' });

      await waitFor(() => {
        const secondOption = screen.getByText('Option 2').closest('li');
        expect(secondOption).toHaveClass('dse-select__option--highlighted');
      });
    });

    it('should navigate up through options with ArrowUp', async () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');

      fireEvent.keyDown(button, { code: 'ArrowDown' });

      await waitFor(() => {
        const firstOption = screen.getByText('Option 1').closest('li');
        expect(firstOption).toHaveClass('dse-select__option--highlighted');
      });

      const firstOption = screen.getByText('Option 1').closest('li');
      fireEvent.keyDown(firstOption!, { code: 'ArrowUp' });

      await waitFor(() => {
        const lastOption = screen.getByText('Option 3').closest('li');
        expect(lastOption).toHaveClass('dse-select__option--highlighted');
      });
    });

    it('should select option on Enter key', async () => {
      const handleSelect = vi.fn();
      render(<Select options={mockOptions} onOptionSelect={handleSelect} />);
      const button = screen.getByRole('button');

      fireEvent.keyDown(button, { code: 'ArrowDown' });

      await waitFor(() => {
        expect(screen.getByRole('listbox')).toBeInTheDocument();
      });

      const firstOption = screen.getByText('Option 1').closest('li');
      fireEvent.keyDown(firstOption!, { code: 'Enter' });

      expect(handleSelect).toHaveBeenCalledWith(mockOptions[0], 0);
      expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    });
  });

  describe('Mouse Interactions', () => {
    it('should highlight option on mouse enter', () => {
      render(<Select options={mockOptions} />);

      fireEvent.click(screen.getByRole('button'));

      const option = screen.getByText('Option 2').closest('li');
      fireEvent.mouseEnter(option!);

      expect(option).toHaveClass('dse-select__option--highlighted');
    });

    it('should remove highlight on mouse leave', () => {
      render(<Select options={mockOptions} />);

      fireEvent.click(screen.getByRole('button'));

      const option = screen.getByText('Option 2').closest('li');
      fireEvent.mouseEnter(option!);
      expect(option).toHaveClass('dse-select__option--highlighted');

      fireEvent.mouseLeave(option!);
      expect(option).not.toHaveClass('dse-select__option--highlighted');
    });
  });

  describe('Custom Render Option', () => {
    it('should use custom renderOption when provided', () => {
      const customRender = vi.fn(({ option, getOptionRecommendedProps }) => (
        <li {...getOptionRecommendedProps()} data-testid="custom-option">
          Custom: {option.label}
        </li>
      ));

      render(<Select options={mockOptions} renderOption={customRender} />);

      fireEvent.click(screen.getByRole('button'));

      expect(customRender).toHaveBeenCalled();
      expect(screen.getByText('Custom: Option 1')).toBeInTheDocument();
    });

    it('should pass correct props to custom renderOption', () => {
      const customRender = vi.fn(
        ({ isSelected, option, getOptionRecommendedProps }) => (
          <li {...getOptionRecommendedProps()}>
            {option.label} {isSelected ? '✓' : ''}
          </li>
        )
      );

      render(<Select options={mockOptions} renderOption={customRender} />);

      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('Option 2'));

      fireEvent.click(screen.getByRole('button'));

      expect(customRender).toHaveBeenCalledWith(
        expect.objectContaining({
          isSelected: expect.any(Boolean),
          option: expect.any(Object),
          getOptionRecommendedProps: expect.any(Function),
        })
      );
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty options array', () => {
      render(<Select options={[]} />);

      fireEvent.click(screen.getByRole('button'));

      const listbox = screen.queryByRole('listbox');
      expect(listbox).toBeInTheDocument();
      expect(listbox?.children).toHaveLength(0);
    });

    it('should handle single option', () => {
      const singleOption = [{ label: 'Only Option', value: 'only' }];
      render(<Select options={singleOption} />);

      fireEvent.click(screen.getByRole('button'));
      fireEvent.click(screen.getByText('Only Option'));

      expect(screen.getByText('Only Option')).toBeInTheDocument();
    });

    it('should not call onOptionSelect if not provided', () => {
      render(<Select options={mockOptions} />);

      fireEvent.click(screen.getByRole('button'));

      // Should not throw error
      expect(() => {
        fireEvent.click(screen.getByText('Option 1'));
      }).not.toThrow();
    });

    it('should handle rapid open/close', () => {
      render(<Select options={mockOptions} />);
      const button = screen.getByRole('button');

      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);

      expect(screen.getByRole('listbox')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA roles', () => {
      render(<Select options={mockOptions} />);

      fireEvent.click(screen.getByRole('button'));

      expect(screen.getByRole('listbox')).toBeInTheDocument();
      const options = screen.getAllByRole('menuitemradio');
      expect(options).toHaveLength(mockOptions.length);
    });

    it('should set aria-checked on selected option', () => {
      render(<Select options={mockOptions} />);

      fireEvent.click(screen.getByRole('button'));
      const options = screen.getAllByRole('menuitemradio');
      fireEvent.click(options[1]); // Click Option 2

      fireEvent.click(screen.getByRole('button'));

      const selectedOption = screen.getAllByRole('menuitemradio')[1];
      expect(selectedOption).toHaveAttribute('aria-checked', 'true');
    });

    it('should have aria-label on options', () => {
      render(<Select options={mockOptions} />);

      fireEvent.click(screen.getByRole('button'));

      mockOptions.forEach((option) => {
        const optionElement = screen.getByText(option.label).closest('li');
        expect(optionElement).toHaveAttribute('aria-label', option.label);
      });
    });
  });
});
