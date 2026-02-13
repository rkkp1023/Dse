interface ButtonProps {
  label: string;
}
export function Button({ label }: Readonly<ButtonProps>) {
  return <button className="dse-btn-container">{label}</button>;
}
