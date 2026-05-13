import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";

type ServiceMarkdownProps = {
  markdown: string;
  className?: string;
};

const components: Components = {
  h2: ({ children, ...props }) => (
    <h2
      className="mt-8 text-xl font-semibold tracking-tight first:mt-0"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mt-6 text-lg font-semibold tracking-tight" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="mt-3 leading-relaxed text-muted-foreground" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul
      className="mt-3 list-inside list-disc space-y-2 text-muted-foreground"
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      className="mt-3 list-inside list-decimal space-y-2 text-muted-foreground"
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-medium text-foreground" {...props}>
      {children}
    </strong>
  ),
  a: ({ href, children, ...props }) => {
    const external =
      typeof href === "string" &&
      (href.startsWith("http://") || href.startsWith("https://"));
    return (
      <a
        href={href}
        className="font-medium text-saffron underline-offset-4 hover:underline"
        rel={external ? "noopener noreferrer" : undefined}
        target={external ? "_blank" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },
};

export function ServiceMarkdown({ markdown, className }: ServiceMarkdownProps) {
  return (
    <div className={className}>
      <ReactMarkdown components={components}>{markdown}</ReactMarkdown>
    </div>
  );
}
