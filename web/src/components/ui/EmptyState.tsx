type EmptyStateProps = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="ui-state ui-state--empty">
      <p className="ui-state__title">{title}</p>
      {description ? <p className="ui-state__description">{description}</p> : null}
    </div>
  );
}
