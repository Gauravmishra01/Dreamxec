import { Quote } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  avatar?: string;
  className?: string;
  variant?: 'glass' | 'india' | 'soft' | 'default';
}

const TestimonialCard = ({
  quote,
  name,
  role,
  avatar,
  className = '',
  variant = 'india',
}: TestimonialCardProps) => {
  const baseClasses = 'p-6 h-full flex flex-col justify-between transition-all duration-300';
  
  const variantClasses = {
    glass: 'card-glass-modern',
    india: 'card-india-gradient',
    soft: 'card-soft-shadow',
    default: 'card-pastel rounded-xl border-4 border-dreamxec-navy shadow-pastel-card hover:scale-105',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <div>
        <div className="mb-4 inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full">
          <Quote className="w-6 h-6 text-dreamxec-orange" />
        </div>
        <p className="text-dreamxec-navy text-base md:text-lg leading-relaxed mb-6 italic">
          "{quote}"
        </p>
      </div>
      
      <div className="flex items-center gap-4 mt-auto pt-4 border-t border-gray-100">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-14 h-14 rounded-full border-2 border-white shadow-lg object-cover ring-2 ring-orange-300"
          />
        ) : (
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-dreamxec-orange to-orange-600 flex items-center justify-center shadow-lg ring-2 ring-orange-300">
            <span className="text-white font-bold text-xl">
              {name.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <p className="font-bold text-dreamxec-berkeley-blue text-lg">{name}</p>
          <p className="text-sm text-dreamxec-navy opacity-80">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;

