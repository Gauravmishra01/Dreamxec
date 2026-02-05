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
  const baseClasses = 'p-6 md:p-8 h-full flex flex-col transition-all duration-[350ms] ease-out hover:-translate-y-1.5 rounded-[18px]';
  
  const variantClasses = {
    glass: 'card-glass-modern hover:shadow-[0_20px_60px_rgba(0,51,102,0.15)] hover:scale-[1.02]',
    gradient: 'card-gradient-border hover:shadow-[0_20px_60px_rgba(255,127,0,0.2)]',
    premium: 'card-premium hover:shadow-[0_20px_60px_rgba(255,153,51,0.25),0_0_40px_rgba(255,153,51,0.15)]',
    default: 'card-pastel rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:scale-105 hover:shadow-pastel-glow-saffron',
  };

  const content = (
    <>
      {icon && (
        <div className="mb-5 flex items-center justify-center">
          {typeof icon === 'string' ? (
            <div className="text-5xl md:text-6xl transform transition-transform duration-300 hover:scale-110 hover:rotate-3">
              <span role="img" aria-label="Feature icon">
                {icon}
              </span>
            </div>
          ) : (
            <div className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-dreamxec-orange bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 rounded-full shadow-md transform transition-all duration-300 hover:scale-110 hover:shadow-lg hover:rotate-6">
              {icon}
            </div>
          )}
        </div>
      )}
      
      <h3 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-dreamxec-berkeley-blue to-dreamxec-navy bg-clip-text text-transparent mb-3 text-center leading-tight">
        {title}
      </h3>
      
      <p className="text-dreamxec-navy text-sm md:text-base leading-relaxed text-center opacity-90">
        {description}
      </p>
    </>
  );

  if (variant === 'gradient') {
    return (
      <div className={`card-gradient-border hover:-translate-y-1.5 hover:shadow-[0_20px_60px_rgba(255,127,0,0.2)] transition-all duration-[350ms] ease-out ${className}`}>
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

