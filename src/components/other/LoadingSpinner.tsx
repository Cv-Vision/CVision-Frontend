interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner = ({ size = 'md', className = '' }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-32 w-32',
    lg: 'h-48 w-48'
  };

  return (
    <div className={`flex items-center justify-center min-h-screen ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-blue-500 ${sizeClasses[size]}`}></div>
    </div>
  );
};

