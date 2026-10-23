import Markdown from "react-markdown";

export const EventDescription = ({
  children,
  preview = false,
}: {
  children: string;
  preview?: boolean;
}) => (
  <div
    className={
      preview
        ? "line-clamp-2 [overflow-wrap:anywhere]"
        : "space-y-4 leading-relaxed [overflow-wrap:anywhere] [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:border-current/30 [&_blockquote]:pl-4 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:whitespace-pre-wrap [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-black/5 [&_pre]:p-4 [&_ul]:list-disc [&_ul]:pl-6"
    }
  >
    <Markdown
      skipHtml
      disallowedElements={["img"]}
      components={
        preview
          ? {
              p: ({ children }) => <span>{children} </span>,
              h1: ({ children }) => <span>{children} </span>,
              h2: ({ children }) => <span>{children} </span>,
              h3: ({ children }) => <span>{children} </span>,
              h4: ({ children }) => <span>{children} </span>,
              h5: ({ children }) => <span>{children} </span>,
              h6: ({ children }) => <span>{children} </span>,
              ul: ({ children }) => <span>{children}</span>,
              ol: ({ children }) => <span>{children}</span>,
              li: ({ children }) => <span>{children} </span>,
              blockquote: ({ children }) => <span>{children}</span>,
              pre: ({ children }) => <span>{children}</span>,
              a: ({ children }) => <span>{children}</span>,
            }
          : {
              h1: ({ children }) => <h3>{children}</h3>,
              h2: ({ children }) => <h3>{children}</h3>,
              a: ({ href, children }) => {
                let targetHref = href;
                if (
                  (targetHref === "https://example.com" || targetHref === "http://example.com") &&
                  typeof children === "string" &&
                  children.includes(".") &&
                  !children.includes(" ")
                ) {
                  targetHref = children;
                }

                const rawHref = targetHref?.trim() || "";
                const lowerHref = rawHref.toLowerCase();

                // Block dangerous pseudo-protocols
                if (
                  lowerHref.startsWith("javascript:") ||
                  lowerHref.startsWith("data:") ||
                  lowerHref.startsWith("vbscript:")
                ) {
                  return <span>{children}</span>;
                }

                let normalizedHref = rawHref;
                if (rawHref.startsWith("//")) {
                  normalizedHref = `https:${rawHref}`;
                } else if (
                  rawHref &&
                  !lowerHref.startsWith("http://") &&
                  !lowerHref.startsWith("https://") &&
                  !lowerHref.startsWith("mailto:") &&
                  !lowerHref.startsWith("tel:") &&
                  !rawHref.startsWith("#") &&
                  !rawHref.startsWith("/")
                ) {
                  normalizedHref = `https://${rawHref}`;
                }

                const isExternal =
                  normalizedHref.toLowerCase().startsWith("http://") ||
                  normalizedHref.toLowerCase().startsWith("https://");

                return (
                  <a
                    href={normalizedHref}
                    target={isExternal ? "_blank" : undefined}
                    rel={isExternal ? "noopener noreferrer" : undefined}
                  >
                    {children}
                  </a>
                );
              },
            }
      }
    >
      {children}
    </Markdown>
  </div>
);
