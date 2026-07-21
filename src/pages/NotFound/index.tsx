import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-brand-darker flex items-center justify-center p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="text-8xl font-bold text-brand-accent/20 select-none">404</div>
        <h1 className="text-2xl font-bold text-white">Page Not Found</h1>
        <p className="text-brand-muted text-sm">
          The dashboard or resource you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-brand-border text-sm text-brand-muted hover:text-white hover:border-brand-accent/30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-accent/10 text-brand-accent text-sm font-medium hover:bg-brand-accent/20 transition-colors"
          >
            <Home className="w-4 h-4" />
            Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
