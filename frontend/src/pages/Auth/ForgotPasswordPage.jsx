import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiMail, FiArrowRight, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import AuthLayout from '../../layouts/AuthLayout.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import api from '../../services/api.js';

export default function ForgotPasswordPage() {
  const [serverError, setServerError] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '' } });

  const onSubmit = async ({ email }) => {
    setServerError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSubmittedEmail(email);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  if (submittedEmail) {
    return (
      <AuthLayout title="Check your email" subtitle="We've sent password reset instructions.">
        <div className="flex flex-col items-center rounded-2xl border border-success/30 bg-success/5 px-6 py-8 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
            <FiCheckCircle className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="mt-4 text-sm text-text/70 dark:text-slate-300">
            If an account exists for <span className="font-semibold text-text dark:text-white">{submittedEmail}</span>,
            a reset link is on its way. It expires in 15 minutes.
          </p>
        </div>
        <Link to="/login" className="mt-6 flex items-center justify-center gap-1.5 text-sm font-semibold text-primary hover:underline">
          <FiArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Back to login
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Forgot your password?" subtitle="Enter your email and we'll send you a reset link.">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {serverError && (
          <div role="alert" className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {serverError}
          </div>
        )}

        <Input
          label="Email"
          type="email"
          icon={FiMail}
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email address' },
          })}
        />

        <Button type="submit" loading={isSubmitting} className="w-full">
          Send Reset Link
          <FiArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </form>

      <Link to="/login" className="mt-8 flex items-center justify-center gap-1.5 text-sm font-medium text-text/55 hover:text-primary dark:text-slate-400">
        <FiArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back to login
      </Link>
    </AuthLayout>
  );
}
