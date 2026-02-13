import { FontSize } from '@rkkp1023/foundation';

export interface TextProps {
  size?: string;
  children: React.ReactNode;
}

export function Text({ size = FontSize.base, children }: Readonly<TextProps>) {
  const className = `dse-text dse-text-${size}`;

  return <span className={className}>{children}</span>;
}
