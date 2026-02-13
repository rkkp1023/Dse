interface colorProps {
  hexCode: string;
  width?: string;
  height?: string;
}

export function Color({
  hexCode,
  width = '1rem',
  height = '1rem',
}: Readonly<colorProps>) {
  const className = `dse-width-${width} dse-height-${height}`;
  return (
    <div
      className={className}
      style={{ backgroundColor: hexCode, width: width, height: height }}
    ></div>
  );
}
