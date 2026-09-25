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
              a: ({ href, children }) => (
                <a href={href} rel="noopener noreferrer">
                  {children}
                </a>
              ),
            }
      }
    >
      {children}
    </Markdown>
  </div>
);
