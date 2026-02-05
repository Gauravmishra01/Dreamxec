import { Quote } from 'lucide-react';

interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  avatar?: string;
  className?: string;
}

const TestimonialCard = ({
  quote,
  name,
  role,
  avatar,
  className = '',
}: TestimonialCardProps) => {
  return (
    <div
      className={`card-pastel rounded-xl border-4 border-dreamxec-navy shadow-pastel-card p-6 h-full flex flex-col justify-between transition-all duration-300 hover:scale-105 ${className}`}
    >
      <div>
        <Quote className="w-10 h-10 text-dreamxec-orange mb-4" />
        <p className="text-dreamxec-navy text-base md:text-lg leading-relaxed mb-6 italic">
          "{quote}"
        </p>
      </div>
      
      <div className="flex items-center gap-4 mt-auto">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-12 h-12 rounded-full border-3 border-dreamxec-navy object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full border-3 border-dreamxec-navy bg-dreamxec-orange flex items-center justify-center">
            <span className="text-white font-bold text-lg">
              {name.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <p className="font-bold text-dreamxec-berkeley-blue">{name}</p>
          <p className="text-sm text-dreamxec-navy">{role}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
