import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import AuthLayout from '../../layouts/AuthLayout.jsx';
import Input from '../../components/ui/Input.jsx';
import Button from '../../components/ui/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { name: '', email: '', password: '', confirmPassword: '' } });

  const password = watch('password');

  const onSubmit = async ({ name, email, password: pwd }) => {
    setServerError('');
    try {
      await signup({ name, email, password: pwd });
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Something went wrong creating your account.');
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Free forever for individual developers.">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
        {serverError && (
          <div role="alert" className="rounded-xl border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {serverError}
          </div>
        )}

        <Input
          label="Full name"
          icon={FiUser}
          placeholder="Ada Lovelace"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name', { required: 'Name is required' })}
        />

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

        <Input
          label="Password"
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
          label="Confirm password"
          type="password"
          icon={FiLock}
          placeholder="Re-enter your password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: (value) => value === password || 'Passwords do not match',
          })}
        />

        <Button type="submit" loading={isSubmitting} className="w-full">
          Create Account
          <FiArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>

        <p className="text-center text-xs text-text/40 dark:text-slate-500">
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </form>

      <p className="mt-8 text-center text-sm text-text/55 dark:text-slate-400">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary hover:underline">
          Log in
        </Link>
      </p>
    </AuthLayout>
  );
}
