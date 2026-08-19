import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext.jsx';
import api from '../../services/api.js';
import AuthLayout from '../../components/auth/AuthLayout.jsx';
import AuthCard from '../../components/auth/AuthCard.jsx';
import FormHeader from '../../components/auth/FormHeader.jsx';
import PasswordInput from '../../components/auth/PasswordInput.jsx';
import Button from '../../components/auth/Button.jsx';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await api.post(`/auth/reset-password/${token}`, {
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });
      
      // Store the new token and update auth context
      localStorage.setItem('dc_token', response.data.token);
      setIsSuccess(true);
      toast.success('Password reset successful!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout>
        <AuthCard title="Password Reset">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text">Password Reset Successful!</h3>
            <p className="text-gray-600">
              Your password has been successfully reset. You can now log in with your new password.
            </p>
            <div className="pt-4">
              <Link to="/login" className="text-primary hover:text-primary-dark font-medium">
                Go to login
              </Link>
            </div>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  if (!token) {
    return (
      <AuthLayout>
        <AuthCard title="Invalid Link">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-text">Invalid Reset Link</h3>
            <p className="text-gray-600">
              The password reset link is invalid or has expired. Please request a new one.
            </p>
            <div className="pt-4">
              <Link to="/forgot-password" className="text-primary hover:text-primary-dark font-medium">
                Request new reset link
              </Link>
            </div>
          </div>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <AuthCard title="Reset Password">
        <FormHeader
          title="Set new password"
          subtitle="Remember your password?"
          linkText="Sign in"
          linkTo="/login"
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              Please enter your new password below. Make sure it's at least 6 characters long.
            </p>
          </div>

          <PasswordInput
            label="New Password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors.password}
          />

          <PasswordInput
            label="Confirm New Password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            error={errors.confirmPassword}
          />

          <Button type="submit" isLoading={isLoading}>
            Reset Password
          </Button>
        </form>
      </AuthCard>
    </AuthLayout>
  );
}
