type TableShellProps = {
  children: React.ReactNode;
};

export function TableShell({ children }: TableShellProps) {
  return <div className="table-shell">{children}</div>;
}
