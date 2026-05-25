type LoadingProps = {
  label?: string;
};

export function Loading({ label = 'Loading…' }: LoadingProps) {
  return (
    <p className="ui-state ui-state--loading" role="status">
      {label}
    </p>
  );
}
