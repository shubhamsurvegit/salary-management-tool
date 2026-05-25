type ErrorMessageProps = {
  message: string;
};

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <p className="ui-state ui-state--error" role="alert">
      {message}
    </p>
  );
}
