// ============================================
// ComES Website - Student Registration Page
// ============================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'framer-motion';
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
  AlertCircle
} from 'lucide-react';
import { useThemeStore } from '@/store';
import { cn } from '@/utils';
import { Button, Input } from '@/components/ui';
import { studentService, validateRegistrationNo, extractBatchFromRegNo } from '@/services/student.service';

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
  general?: string;
}

export const StudentRegisterPage = () => {
  const navigate = useNavigate();
  const { resolvedTheme } = useThemeStore();
  const isDark = resolvedTheme === 'dark';
  
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    registrationNo: '',
    contactNo: '',
    password: '',
    passwordConfirm: '',
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format registration number as user types
    if (name === 'registrationNo') {
      let formatted = value.toUpperCase();
      // Auto-format: add slashes at correct positions
      if (formatted.length === 2 && !formatted.includes('/')) {
        formatted = formatted + '/';
      } else if (formatted.length === 7 && formatted.charAt(6) !== '/') {
        formatted = formatted.slice(0, 7) + '/' + formatted.slice(7);
      }
      setFormData(prev => ({ ...prev, [name]: formatted }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    
    // Registration number validation
    const regNoValidation = validateRegistrationNo(formData.registrationNo);
    if (!regNoValidation.valid) {
      newErrors.registrationNo = regNoValidation.error;
    }
    
    // Contact number validation (optional but if provided, validate)
    if (formData.contactNo) {
      const phonePattern = /^(\+94|0)?[0-9]{9,10}$/;
      if (!phonePattern.test(formData.contactNo.replace(/\s/g, ''))) {
        newErrors.contactNo = 'Invalid phone number';
      }
    }
    
    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    // Confirm password validation
    if (!formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Please confirm your password';
    } else if (formData.password !== formData.passwordConfirm) {
      newErrors.passwordConfirm = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const response = await studentService.register({
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        registrationNo: formData.registrationNo,
        contactNo: formData.contactNo || undefined,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
      });
      
      if (response.status === 'success') {
        setIsSuccess(true);
        // Redirect after showing success message
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setErrors({ general: response.message || 'Registration failed' });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      setErrors({ general: message });
    } finally {
      setIsLoading(false);
    }
  };

  // Extract batch for display
  const batch = extractBatchFromRegNo(formData.registrationNo);

  if (isSuccess) {
    return (
      <div className={cn(
        'min-h-screen flex items-center justify-center p-4',
        isDark ? 'bg-slate-950' : 'bg-gray-50'
      )}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={cn(
            'w-full max-w-md p-8 rounded-2xl text-center',
            isDark ? 'bg-slate-900 border border-slate-800' : 'bg-white shadow-xl'
          )}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/20"
          >
            <CheckCircle className="w-10 h-10 text-green-500" />
          </motion.div>
          <h2 className={cn('text-2xl font-bold mb-2', isDark ? 'text-white' : 'text-gray-900')}>
            Registration Successful!
          </h2>
          <p className={cn('mb-6', isDark ? 'text-gray-400' : 'text-gray-600')}>
            Welcome to ComES! Please check your email to verify your account.
          </p>
          <p className={cn('text-sm', isDark ? 'text-gray-500' : 'text-gray-500')}>
            Redirecting to homepage...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={cn(
      'min-h-screen flex items-center justify-center p-4 py-12',
      isDark ? 'bg-slate-950' : 'bg-gray-50'
    )}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={cn(
          'absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20',
          isDark ? 'bg-blue-500' : 'bg-blue-300'
        )} />
        <div className={cn(
          'absolute bottom-0 left-0 w-96 h-96 rounded-full blur-3xl opacity-20',
          isDark ? 'bg-purple-500' : 'bg-purple-300'
        )} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          'relative w-full max-w-lg p-8 rounded-2xl',
          isDark ? 'bg-slate-900/90 border border-slate-800 backdrop-blur-xl' : 'bg-white/90 shadow-xl backdrop-blur-xl'
        )}
      >
        {/* Header */}
        <div className="mb-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1 }}
            className={cn(
              'w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center',
              isDark ? 'bg-blue-500/20' : 'bg-blue-100'
            )}
          >
            <GraduationCap className={cn('w-8 h-8', isDark ? 'text-blue-400' : 'text-blue-600')} />
          </motion.div>
          <h1 className={cn('text-2xl font-bold mb-2', isDark ? 'text-white' : 'text-gray-900')}>
            Student Registration
          </h1>
          <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
            Create your ComES student account
          </p>
        </div>

        {/* Error Alert */}
        {errors.general && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 p-4 mb-6 border rounded-xl bg-red-500/10 border-red-500/20"
          >
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-500">{errors.general}</p>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
              Full Name *
            </label>
            <div className="relative">
              <User className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
                isDark ? 'text-gray-500' : 'text-gray-400'
              )} />
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={cn('pl-10', errors.name && 'border-red-500')}
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-sm text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Registration Number */}
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
              Registration Number *
            </label>
            <div className="relative">
              <GraduationCap className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
                isDark ? 'text-gray-500' : 'text-gray-400'
              )} />
              <Input
                type="text"
                name="registrationNo"
                value={formData.registrationNo}
                onChange={handleChange}
                placeholder="EG/20XX/XXXX"
                maxLength={12}
                className={cn('pl-10 uppercase', errors.registrationNo && 'border-red-500')}
              />
            </div>
            {errors.registrationNo ? (
              <p className="mt-1 text-sm text-red-500">{errors.registrationNo}</p>
            ) : batch && (
              <p className={cn('mt-1 text-sm', isDark ? 'text-gray-500' : 'text-gray-500')}>
                Batch: {batch}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
              Email Address *
            </label>
            <div className="relative">
              <Mail className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
                isDark ? 'text-gray-500' : 'text-gray-400'
              )} />
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className={cn('pl-10', errors.email && 'border-red-500')}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Contact Number */}
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
              Contact Number <span className="text-gray-500">(Optional)</span>
            </label>
            <div className="relative">
              <Phone className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
                isDark ? 'text-gray-500' : 'text-gray-400'
              )} />
              <Input
                type="tel"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleChange}
                placeholder="+94 XX XXX XXXX"
                className={cn('pl-10', errors.contactNo && 'border-red-500')}
              />
            </div>
            {errors.contactNo && (
              <p className="mt-1 text-sm text-red-500">{errors.contactNo}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
              Password *
            </label>
            <div className="relative">
              <Lock className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
                isDark ? 'text-gray-500' : 'text-gray-400'
              )} />
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                className={cn('pl-10 pr-10', errors.password && 'border-red-500')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={cn(
                  'absolute right-3 top-1/2 -translate-y-1/2',
                  isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                )}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className={cn('block text-sm font-medium mb-2', isDark ? 'text-gray-300' : 'text-gray-700')}>
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
                isDark ? 'text-gray-500' : 'text-gray-400'
              )} />
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                name="passwordConfirm"
                value={formData.passwordConfirm}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={cn('pl-10 pr-10', errors.passwordConfirm && 'border-red-500')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={cn(
                  'absolute right-3 top-1/2 -translate-y-1/2',
                  isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                )}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.passwordConfirm && (
              <p className="mt-1 text-sm text-red-500">{errors.passwordConfirm}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 rounded-full border-white/30 border-t-white animate-spin" />
                <span>Creating Account...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>Create Account</span>
                <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </Button>
        </form>

        {/* Footer Links */}
        <div className="mt-6 text-center">
          <p className={cn('text-sm', isDark ? 'text-gray-400' : 'text-gray-600')}>
            Already have an account?{' '}
            <Link
              to="/admin/login"
              className={cn(
                'font-medium hover:underline',
                isDark ? 'text-blue-400' : 'text-blue-600'
              )}
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="mt-4 text-center">
          <Link
            to="/"
            className={cn(
              'text-sm hover:underline',
              isDark ? 'text-gray-500 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentRegisterPage;
