import { NavLink } from "react-router";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { useStudentStore } from "@/store/studentStore";
import { useAuthStore } from "@/store/authStore";
import { useThemeStore } from "@/store/themeStore";
import { cn } from "@/utils";

export const DashboardSwitch = () => {
  const { student, isAuthenticated } = useStudentStore();
  const { user, isAuthenticated: adminAuthenticated } = useAuthStore();
  const { resolvedTheme } = useThemeStore();
  if (
    !isAuthenticated ||
    !student ||
    (student.role !== "admin" && !(adminAuthenticated && user?.role === "admin"))
  )
    return null;

  return (
    <nav
      aria-label="Dashboard switch"
      className={cn(
        "mb-5 grid w-full max-w-xs grid-cols-2 gap-1 rounded-lg border p-1 text-sm",
        resolvedTheme === "dark" ? "border-slate-700 bg-slate-900" : "border-gray-200 bg-white",
      )}
    >
      {[
        { to: "/student/dashboard", label: "Student", icon: GraduationCap },
        { to: "/admin", label: "Admin", icon: ShieldCheck },
      ].map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            cn(
              "flex min-h-10 items-center justify-center gap-2 rounded-md px-3 py-2 font-medium transition-colors",
              isActive
                ? "bg-blue-600 text-white"
                : resolvedTheme === "dark"
                  ? "text-gray-300 hover:bg-slate-800"
                  : "text-gray-600 hover:bg-gray-100",
            )
          }
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
