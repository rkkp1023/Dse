import { Meta, StoryObj } from '@storybook/react-vite';
import { Select } from './Select';

const meta = {
  // 👇 The component you're working on
  component: Select,
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;

// 👇 Type helper to reduce boilerplate
type Story = StoryObj<typeof meta>;

const options = [
  {
    label: 'Strick Black',
    value: 'black',
  },
  {
    label: 'Strick White',
    value: 'white',
  },
  {
    label: 'Strick Blue',
    value: 'blue',
  },
  {
    label: 'Strick Pink',
    value: 'pink',
  },
];

// 👇 A story named Primary that renders `<Button primary label="Button" />`
export const common: Story = {
  args: {
    options: options,
    label: 'Select option',
    onOptionSelect: () => {},
  },
};

export const renderOption: Story = {
  args: {
    options: options,
    renderOption: ({ getOptionRecommendedProps, option }) => {
      return <span {...getOptionRecommendedProps()}>{option.value}</span>;
    },
  },
};

export const customLabel: Story = {
  args: {
    options: options,
    label: 'Custom label',
  },
};
