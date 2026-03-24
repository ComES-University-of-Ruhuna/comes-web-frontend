// ============================================
// ComES Website - Student Registration Page (Redesigned)
// ============================================

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  GraduationCap,
  Phone,
  ArrowRight,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { toast } from "@/store";
import {
  validateRegistrationNo,
  extractBatchFromRegNo,
  studentService,
} from "@/services/student.service";

const ease = [0.25, 0.46, 0.45, 0.94];

interface FormData {
  name: string;
  email: string;
  registrationNo: string;
  contactNo: string;
  password: string;
  passwordConfirm: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  registrationNo?: string;
  contactNo?: string;
  password?: string;
  passwordConfirm?: string;
}

const inputClass =
  "w-full rounded-xl border border-border-d bg-bg-primary py-3 pr-4 pl-10 font-body text-sm text-text-primary placeholder:text-text-muted outline-none transition-colors focus:border-accent-blue";
const labelClass = "mb-2 block font-body text-sm font-medium text-text-secondary";
const iconClass = "absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-text-muted";

export const StudentRegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    registrationNo: "",
    contactNo: "",
    password: "",
    passwordConfirm: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "registrationNo") {
      let formatted = value.toUpperCase();
      if (formatted.length === 2 && !formatted.includes("/")) {
        formatted = formatted + "/";
      } else if (formatted.length === 7 && formatted.charAt(6) !== "/") {
        formatted = formatted.slice(0, 7) + "/" + formatted.slice(7);
      }
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    else if (formData.name.trim().length < 2) newErrors.name = "Name must be at least 2 characters";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) newErrors.email = "Email is required";
    else if (!emailPattern.test(formData.email)) newErrors.email = "Invalid email address";

    const regNoValidation = validateRegistrationNo(formData.registrationNo);
    if (!regNoValidation.valid) newErrors.registrationNo = regNoValidation.error;

    if (formData.contactNo) {
      const phonePattern = /^(\+94|0)?[0-9]{9,10}$/;
      if (!phonePattern.test(formData.contactNo.replace(/\s/g, "")))
        newErrors.contactNo = "Invalid phone number";
    }

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))
      newErrors.password = "Password must contain uppercase, lowercase, and number";

    if (!formData.passwordConfirm) newErrors.passwordConfirm = "Please confirm your password";
    else if (formData.password !== formData.passwordConfirm)
      newErrors.passwordConfirm = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      const data = await studentService.register({
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        registrationNo: formData.registrationNo,
        contactNo: formData.contactNo || undefined,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
      });

      if (data.success) {
        setIsSuccess(true);
        toast.success("Registration successful! Redirecting to login...");
        setFormData({
          name: "",
          email: "",
          registrationNo: "",
          contactNo: "",
          password: "",
          passwordConfirm: "",
        });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(data.message || "Registration failed");
      }
    } catch (err: unknown) {
      const error = err as {
        response?: { data?: { message?: string; errors?: FormErrors } };
        message?: string;
      };
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed. Please try again.";
      const validationErrors = error.response?.data?.errors;
      toast.error(errorMessage);
      if (validationErrors) setErrors(validationErrors);
    } finally {
      setIsLoading(false);
    }
  };

  const batch = extractBatchFromRegNo(formData.registrationNo);

  // Success state
  if (isSuccess) {
    return (
      <div className="theme-force-dark flex min-h-screen items-center justify-center bg-bg-primary p-4">
        <div className="pointer-events-none absolute inset-0">
          <div className="circuit-grid absolute inset-0 opacity-20" />
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full max-w-md rounded-2xl border border-border-d bg-bg-card/80 p-8 text-center backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/20"
          >
            <CheckCircle className="h-10 w-10 text-emerald-400" />
          </motion.div>
          <h2 className="font-display text-text-primary mb-2 text-2xl font-bold">
            Registration Successful!
          </h2>
          <p className="font-body text-text-secondary mb-6">
            Welcome to ComES! Please check your email to verify your account.
          </p>
          <p className="font-body text-text-muted text-sm">Redirecting to login...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="theme-force-dark flex min-h-screen items-center justify-center bg-bg-primary p-4 py-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="circuit-grid absolute inset-0 opacity-20" />
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      <Link
        to="/"
        className="font-body text-text-muted hover:text-text-primary absolute top-4 left-4 flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition-colors hover:bg-white/5"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Home</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        className="relative w-full max-w-lg rounded-2xl border border-border-d bg-bg-card/80 p-8 backdrop-blur-xl lg:max-w-2xl"
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 shadow-lg shadow-sky-500/30"
          >
            <GraduationCap className="h-8 w-8 text-white" />
          </motion.div>
          <h1 className="font-display text-text-primary mb-2 text-2xl font-bold">
            Student Registration
          </h1>
          <p className="font-body text-text-secondary text-sm">Create your ComES student account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <label className={labelClass}>Full Name *</label>
              <div className="relative">
                <User className={iconClass} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`${inputClass} ${errors.name ? "border-red-500" : ""}`}
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
            </div>
            <div>
              <label className={labelClass}>Registration Number *</label>
              <div className="relative">
                <GraduationCap className={iconClass} />
                <input
                  type="text"
                  name="registrationNo"
                  value={formData.registrationNo}
                  onChange={handleChange}
                  placeholder="EG/20XX/XXXX"
                  maxLength={12}
                  className={`${inputClass} uppercase ${errors.registrationNo ? "border-red-500" : ""}`}
                />
              </div>
              {errors.registrationNo ? (
                <p className="mt-1 text-sm text-red-400">{errors.registrationNo}</p>
              ) : (
                batch && <p className="text-text-muted mt-1 text-sm">Batch: {batch}</p>
              )}
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div>
              <label className={labelClass}>Email Address *</label>
              <div className="relative">
                <Mail className={iconClass} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className={`${inputClass} ${errors.email ? "border-red-500" : ""}`}
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
            </div>
            <div>
              <label className={labelClass}>
                Contact Number <span className="text-text-muted">(Optional)</span>
              </label>
              <div className="relative">
                <Phone className={iconClass} />
                <input
                  type="tel"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleChange}
                  placeholder="+94 XX XXX XXXX"
                  className={`${inputClass} ${errors.contactNo ? "border-red-500" : ""}`}
                />
              </div>
              {errors.contactNo && <p className="mt-1 text-sm text-red-400">{errors.contactNo}</p>}
            </div>
          </div>

          <div>
            <label className={labelClass}>Password *</label>
            <div className="relative">
              <Lock className={iconClass} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className={`${inputClass} pr-10 ${errors.password ? "border-red-500" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-text-muted hover:text-text-secondary absolute top-1/2 right-3 -translate-y-1/2"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
          </div>

          <div>
            <label className={labelClass}>Confirm Password *</label>
            <div className="relative">
              <Lock className={iconClass} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={`${inputClass} pr-10 ${errors.passwordConfirm ? "border-red-500" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-text-muted hover:text-text-secondary absolute top-1/2 right-3 -translate-y-1/2"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.passwordConfirm && (
              <p className="mt-1 text-sm text-red-400">{errors.passwordConfirm}</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="font-body w-full rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 py-3 font-semibold text-white shadow-lg shadow-sky-500/20 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Creating Account...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                Create Account <ArrowRight className="h-5 w-5" />
              </span>
            )}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <p className="font-body text-text-muted text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-accent-blue font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
        <div className="mt-4 text-center">
          <Link
            to="/"
            className="font-body text-text-muted hover:text-text-secondary text-sm hover:underline"
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentRegisterPage;
