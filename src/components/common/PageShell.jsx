export default function PageShell({ children, className = "" }) {
  return <div className={`space-y-5 ${className}`}>{children}</div>;
}
