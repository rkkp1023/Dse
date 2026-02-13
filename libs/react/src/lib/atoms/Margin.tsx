interface MarginProps {
  space?: string;
  children?: React.ReactNode;
}

export function Margin({ space, children }: Readonly<MarginProps>) {
  const className = space ? `dse-margin-${space}` : '';
  return <div className={className}>{children}</div>;
}
