import { ReactNode } from 'react';

interface FeatureCardProps {
  icon?: ReactNode | string;
  title: string;
  description: string;
  className?: string;
  variant?: 'glass' | 'gradient' | 'premium' | 'default';
}

const FeatureCard = ({
  icon,
  title,
  description,
  className = '',
  variant = 'premium',
}: FeatureCardProps) => {
  const baseClasses = 'p-6 h-full flex flex-col transition-all duration-300';
  
  const variantClasses = {
    glass: 'card-glass-modern',
    gradient: 'card-gradient-border',
    premium: 'card-premium',
    default: 'card-pastel rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:scale-105 hover:shadow-pastel-glow-saffron',
  };

  const content = (
    <>
      {icon && (
        <div className="mb-4 flex items-center justify-center transform transition-transform duration-300 hover:scale-110">
          {typeof icon === 'string' ? (
            <span className="text-5xl" role="img" aria-label="Feature icon">
              {icon}
            </span>
          ) : (
            <div className="w-14 h-14 flex items-center justify-center text-dreamxec-orange bg-gradient-to-br from-orange-50 to-orange-100 rounded-full">
              {icon}
            </div>
          )}
        </div>
      )}
      
      <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-dreamxec-berkeley-blue to-dreamxec-navy bg-clip-text text-transparent mb-3 text-center">
        {title}
      </h3>
      
      <p className="text-dreamxec-navy text-sm md:text-base leading-relaxed text-center">
        {description}
      </p>
    </>
  );

  if (variant === 'gradient') {
    return (
      <div className={`card-gradient-border ${className}`}>
        <div className="card-gradient-border-inner">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {content}
    </div>
  );
};

export default FeatureCard;

