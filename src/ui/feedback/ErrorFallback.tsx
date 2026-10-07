import type { ReactNode } from "react";

import Button from "../buttons/Button";

interface ErrorFallbackProps {
  error?: Error;
  resetErrorBoundary?: () => void;
  children?: ReactNode;
}

const ErrorFallback = ({ error, resetErrorBoundary, children }: ErrorFallbackProps) => {
  return (
    <main className="h-screen bg-jonas-grey-50 flex items-center justify-center p-12">
      <div className="bg-jonas-grey-0 border border-jonas-grey-100 p-12 flex-[0_1_96rem] text-center">
        <h1 className="mb-4">Something went wrong 😢</h1>
        <p className="font-mono mb-8 text-jonas-grey-500">
          {error?.message || "An unexpected error occurred"}
        </p>
        {children || (
          resetErrorBoundary && (
            <Button onClick={resetErrorBoundary} variant="primary">
              Try again
            </Button>
          )
        )}
      </div>
    </main>
  );
};

export default ErrorFallback;

