import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import Markdown from "react-markdown";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { isAxiosError } from "axios";
import { Section, PageTransition } from "@/components/ui";
import { blogService, type ApiBlogPost } from "@/services/blog.service";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";

export const BlogPostPage = () => {
  const { slug } = useParams();
  const { resolvedTheme } = useThemeStore();
  const [post, setPost] = useState<ApiBlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setPost(null);
    setError(null);
    blogService
      .getBySlug(slug || "")
      .then((response) => {
        if (!active) return;
        if (!response.success || !response.data?.post) throw new Error("Article not found");
        setPost(response.data.post);
      })
      .catch((error: unknown) => {
        if (active)
          setError(
            isAxiosError(error) && error.response?.status === 404
              ? "Article not found"
              : "Unable to load this article. Please try again.",
          );
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug, retry]);

  return (
    <PageTransition>
      <Section background={resolvedTheme === "dark" ? "dark" : "white"}>
        <div
          className={cn(
            "mx-auto max-w-3xl [overflow-wrap:anywhere]",
            resolvedTheme === "dark" ? "text-gray-200" : "text-gray-800",
          )}
        >
          <Link to="/blog" className="mb-8 inline-flex items-center gap-2 text-sm">
            <ArrowLeft className="h-4 w-4" /> All articles
          </Link>
          {isLoading ? (
            <p role="status">Loading article...</p>
          ) : error ? (
            <div role="alert">
              <h1 className="mb-4 text-2xl font-bold">{error}</h1>
              <button type="button" onClick={() => setRetry(retry + 1)} className="underline">
                Retry
              </button>
            </div>
          ) : (
            post && (
              <article>
                <p className="mb-3 text-sm font-medium text-emerald-600">{post.category}</p>
                <h1 className="mb-6 text-3xl leading-tight font-bold md:text-4xl">{post.title}</h1>
                <div className="mb-8 flex flex-wrap items-center gap-4 text-sm">
                  <span>{post.author?.name || "ComES"}</span>
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readTime} min read
                  </span>
                </div>
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="mb-8 max-h-[32rem] w-full rounded-lg object-contain"
                  />
                )}
                <div className="space-y-5 leading-relaxed [&_a]:text-emerald-600 [&_a]:underline [&_blockquote]:border-l-2 [&_blockquote]:pl-4 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:text-2xl [&_h2]:font-bold [&_h3]:text-xl [&_h3]:font-semibold [&_img]:max-w-full [&_li]:my-2 [&_ol]:list-decimal [&_ol]:pl-6 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-black/5 [&_pre]:p-4 [&_ul]:list-disc [&_ul]:pl-6">
                  <Markdown>{post.content}</Markdown>
                </div>
                {!!post.tags?.length && (
                  <div className="mt-10 flex flex-wrap gap-2 border-t border-current/10 pt-5">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            )
          )}
        </div>
      </Section>
    </PageTransition>
  );
};
