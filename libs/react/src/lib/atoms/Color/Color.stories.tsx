import { Meta, StoryObj } from '@storybook/react-vite';
import { Color } from './Color';

const meta = {
  component: Color,
  tags: ['autodocs'],
} satisfies Meta<typeof Color>;

export default meta;

type Story = StoryObj<typeof meta>;

export const common: Story = {
  args: {
    hexCode: '#000000',
  },
};

export const customDimension: Story = {
  args: {
    hexCode: '#0369a1',
    height: '2rem',
    width: '2rem',
  },
};
