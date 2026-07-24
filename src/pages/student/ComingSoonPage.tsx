import type { LucideIcon } from "lucide-react";
import { ArrowLeft, Award, FileText } from "lucide-react";
import { Link } from "react-router";
import { motion } from "framer-motion";
import { Navbar, Footer } from "@/components/layout";
import { useThemeStore } from "@/store";
import { cn } from "@/utils";

interface ComingSoonPageProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const ComingSoonPage = ({ title, description, icon: Icon }: ComingSoonPageProps) => {
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === "dark";

  return (
    <div
      className={cn(
        "font-comes flex min-h-screen flex-col overflow-x-clip",
        isDark ? "bg-slate-950 text-gray-100" : "bg-gray-50 text-gray-900",
      )}
    >
      <Navbar />
      <main className="flex flex-1 items-center pt-16 md:pt-20">
        <div className="mx-auto w-full max-w-3xl px-4 py-16 sm:px-6">
          <Link
            to="/student/dashboard"
            className={cn(
              "mb-8 inline-flex items-center gap-2 text-sm font-medium transition-colors",
              isDark ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-900",
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-lg border p-8 text-center shadow-sm sm:p-12",
              isDark ? "border-slate-800 bg-slate-900" : "border-gray-200 bg-white",
            )}
          >
            <div
              className={cn(
                "mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-lg",
                isDark ? "bg-blue-500/15 text-blue-400" : "bg-blue-50 text-blue-700",
              )}
            >
              <Icon className="h-7 w-7" />
            </div>
            <p
              className={cn(
                "mb-3 text-sm font-semibold",
                isDark ? "text-blue-400" : "text-blue-700",
              )}
            >
              Coming soon
            </p>
            <h1 className="mb-4 text-3xl font-bold sm:text-4xl">{title}</h1>
            <p
              className={cn(
                "mx-auto max-w-xl leading-relaxed",
                isDark ? "text-gray-400" : "text-gray-600",
              )}
            >
              {description}
            </p>
          </motion.section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export const StudentCertificatesPage = () => (
  <ComingSoonPage
    title="Certificates"
    description="Your earned certificates and downloadable credentials will be available here."
    icon={Award}
  />
);

export const StudentResourcesPage = () => (
  <ComingSoonPage
    title="Learning Resources"
    description="Curated notes, recordings, and technical resources for ComES members are being prepared."
    icon={FileText}
  />
);
