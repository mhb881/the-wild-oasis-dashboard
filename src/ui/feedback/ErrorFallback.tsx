import { useRouteError } from "react-router";

import Button from "../buttons/Button";
import Heading from "../data-display/Heading";

function ErrorFallbackUI({
  errorMessage,
  onReset,
}: {
  errorMessage: string;
  onReset: () => void;
}) {
  return (
    <main className="flex h-screen items-center justify-center bg-gray-50 p-12 dark:bg-gray-900">
      <div className="flex-[0_1_96rem] rounded-xl border border-gray-200 bg-white p-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-800">
        <Heading as="h1" className="mb-4">
          Something went wrong 🧐
        </Heading>
        <p className="mb-8 font-['Sono'] break-words text-gray-500 dark:text-gray-400">
          {errorMessage}
        </p>
        <Button size="lg" onClick={onReset}>
          Try again
        </Button>
      </div>
    </main>
  );
}

// 供 React Router 的 errorElement 使用
export default function RouteErrorFallback() {
  const routeError = useRouteError();
  const errorMessage =
    routeError instanceof Error
      ? routeError.message
      : typeof routeError === "string"
        ? routeError
        : (routeError as { statusText?: string; message?: string })?.message ||
          (routeError as { statusText?: string })?.statusText ||
          "An unexpected error occurred";

  return (
    <ErrorFallbackUI
      errorMessage={errorMessage}
      onReset={() => window.location.replace("/")}
    />
  );
}
