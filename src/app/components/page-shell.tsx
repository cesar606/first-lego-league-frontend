import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type PageShellProps = {
  eyebrow: string;
  title: string;
  description?: string;
  children: ReactNode;
  heroAside?: ReactNode;
  className?: string;
  bannerClassName?: string;
  panelClassName?: string;
};

export default function PageShell({
  eyebrow,
  title,
  description,
  children,
  heroAside,
  className,
  bannerClassName,
  panelClassName,
}: Readonly<PageShellProps>) {
  return (
    <div className={cn("app-frame", className)}>
      <main className="page-shell">
        <section className={cn("page-banner", bannerClassName)}>
          <div className={cn("page-banner-grid", heroAside && "page-banner-grid-split")}>
            <div className="space-y-5">
              <div className="page-eyebrow">{eyebrow}</div>
              <h1 className="page-title">{title}</h1>
              {description ? <p className="page-description">{description}</p> : null}
            </div>
            {heroAside ? <div className="hero-stage">{heroAside}</div> : null}
          </div>
        </section>
        <section className={cn("page-panel mt-4", panelClassName)}>{children}</section>
      </main>
    </div>
  );
}
