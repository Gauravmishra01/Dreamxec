import { ReactNode } from 'react';

interface FeatureCardProps {
  icon?: ReactNode | string;
  title: string;
  description: string;
  className?: string;
}

const FeatureCard = ({
  icon,
  title,
  description,
  className = '',
}: FeatureCardProps) => {
  return (
    <div
      className={`card-pastel rounded-xl border-4 border-dreamxec-navy shadow-pastel-card p-6 h-full flex flex-col transition-all duration-300 hover:scale-105 hover:shadow-pastel-glow-saffron ${className}`}
    >
      {icon && (
        <div className="mb-4 flex items-center justify-center">
          {typeof icon === 'string' ? (
            <span className="text-5xl" role="img" aria-label="Feature icon">
              {icon}
            </span>
          ) : (
            <div className="w-12 h-12 flex items-center justify-center text-dreamxec-orange">
              {icon}
            </div>
          )}
        </div>
      )}
      
      <h3 className="text-xl md:text-2xl font-bold text-dreamxec-berkeley-blue mb-3 text-center">
        {title}
      </h3>
      
      <p className="text-dreamxec-navy text-sm md:text-base leading-relaxed text-center">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
