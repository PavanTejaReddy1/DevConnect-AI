import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiLock, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import AuthLayout from '../../layouts/AuthLayout.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import api from '../../services/api.js';

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { password: '', confirmPassword: '' } });

  const password = watch('password');

  const onSubmit = async ({ password: newPassword }) => {
    setServerError('');
    try {
      await api.post(`/auth/reset-password/${token}`, { password: newPassword });
      setSuccess(true);
      setTimeout(() => navigate('/login', { replace: true }), 2000);
    } catch (err) {
      setServerError(err.response?.data?.message || 'This reset link is invalid or has expired.');
    }
  };

  if (success) {
    return (
      <AuthLayout title="Password reset" subtitle="Redirecting you to login...">
        <div className="flex flex-col items-center rounded-2xl border border-success/30 bg-success/5 px-6 py-8 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
            <FiCheckCircle className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="mt-4 text-sm text-text/70 dark:text-slate-300">
            Your password has been updated. Taking you to login now.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Set a new password" subtitle="Choose something you haven't used before.">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {serverError && (
          <div role="alert" className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {serverError}
          </div>
        )}

        <Input
          label="New password"
          type="password"
          icon={FiLock}
          placeholder="At least 6 characters"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password', {
            required: 'Password is required',
            minLength: { value: 6, message: 'Password must be at least 6 characters' },
          })}
        />

        <Input
          label="Confirm new password"
          type="password"
          icon={FiLock}
          placeholder="Re-enter your new password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
        />

        <Button type="submit" loading={isSubmitting} className="w-full">
          Reset Password
          <FiArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-text/55 dark:text-slate-400">
        Remembered it after all?{' '}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
