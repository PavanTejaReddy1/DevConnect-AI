import { Link } from 'react-router-dom';

export default function FormHeader({ title, subtitle, linkText, linkTo }) {
  return (
    <div className="text-center mb-8">
      <h2 className="text-2xl font-display font-bold text-text mb-2">{title}</h2>
      <p className="text-gray-600">
        {subtitle}{' '}
        {linkText && linkTo && (
          <Link to={linkTo} className="text-primary hover:text-primary-dark font-medium">
            {linkText}
          </Link>
        )}
      </p>
    </div>
  );
}
