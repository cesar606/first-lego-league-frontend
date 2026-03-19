import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type AuthPageShellProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export default function AuthPageShell({
  eyebrow,
  title,
  description,
  children,
  className,
}: Readonly<AuthPageShellProps>) {
  return (
    <div className={cn("app-frame", className)}>
      <main className="mx-auto flex min-h-[calc(100vh-7rem)] w-full max-w-3xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <section className="w-full border border-border bg-card">
          <div className="border-b border-border bg-muted px-6 py-5 sm:px-8">
            <div className="page-eyebrow">{eyebrow}</div>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl">
              {title}
            </h1>
            {description ? (
              <p className="mt-3 max-w-xl text-sm leading-7 text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          <div className="px-6 py-6 sm:px-8 sm:py-8">{children}</div>
        </section>
      </main>
    </div>
  );
}
