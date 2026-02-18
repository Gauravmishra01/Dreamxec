interface ProgressBarProps {
  label: string;
  percentage: number;
  color: "saffron" | "green" | "navy";
}

export const ProgressBar = ({ label, percentage, color }: ProgressBarProps) => {
  const colorClasses = {
    saffron: "bg-dreamxec-saffron",
    green: "bg-dreamxec-green",
    navy: "bg-dreamxec-navy"
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-dreamxec-navy font-bold text-sm md:text-base">
          {label}
        </span>
        <span className={`font-display font-extrabold text-lg ${colorClasses[color]} text-white px-3 py-1 rounded-full border-3 border-dreamxec-navy`}>
          {percentage}%
        </span>
      </div>
      
      {/* Progress bar with oil pastel style */}
      <div className="progress-bar-pastel h-8 rounded-lg overflow-hidden">
        <div 
          className={`progress-bar-fill h-full transition-all duration-500 ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        >
          <div className="h-full flex items-center justify-end pr-2">
            {percentage > 15 && (
              <span className="text-white font-bold text-xs">★</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface ChecklistItemProps {
  text: string;
  completed: boolean;
}

export const ChecklistItem = ({ text, completed }: ChecklistItemProps) => {
  return (
    <div className={`${completed ? 'checklist-item-pastel' : 'pl-10'} py-3 transition-all duration-300`}>
      {!completed && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-6 h-6 border-2 border-dreamxec-navy bg-white rounded"></div>
      )}
      <span className={`text-dreamxec-navy text-base md:text-lg ${completed ? 'font-semibold' : 'opacity-60'}`}>
        {text}
      </span>
    </div>
  );
};

export const FundingMilestones = () => {
  return (
    <section className="py-16 md:py-24 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="card-pastel p-8 md:p-12">
          {/* Tricolor header */}
          <div className="bg-tricolor-horizontal h-3 mb-8 -mt-8 -mx-8 md:-mx-12"></div>
          
          <h2 className="text-3xl md:text-5xl font-display font-extrabold text-dreamxec-navy mb-3">
            Your Journey to Success
          </h2>
          <p className="text-lg text-dreamxec-navy opacity-70 mb-8">
            Track your progress through our structured innovation program
          </p>
          
          {/* Progress Bars */}
          <div className="mb-10">
            <h3 className="text-xl md:text-2xl font-display font-bold text-dreamxec-navy mb-6 flex items-center gap-3">
              <span className="text-2xl">📊</span>
              Program Milestones
            </h3>
            <ProgressBar label="Idea Validation" percentage={100} color="green" />
            <ProgressBar label="Prototype Development" percentage={75} color="saffron" />
            <ProgressBar label="Market Testing" percentage={45} color="navy" />
            <ProgressBar label="Funding Secured" percentage={20} color="saffron" />
          </div>
          
          {/* Checklist */}
          <div>
            <h3 className="text-xl md:text-2xl font-display font-bold text-dreamxec-navy mb-6 flex items-center gap-3">
              <span className="text-2xl">✓</span>
              Completion Checklist
            </h3>
            <div className="space-y-1">
              <ChecklistItem text="Submit project proposal" completed={true} />
              <ChecklistItem text="Attend orientation workshop" completed={true} />
              <ChecklistItem text="Match with mentor" completed={true} />
              <ChecklistItem text="Complete prototype" completed={false} />
              <ChecklistItem text="Present to review panel" completed={false} />
              <ChecklistItem text="Secure seed funding" completed={false} />
            </div>
          </div>
          
          {/* Call to action */}
          <div className="mt-10 pt-8 border-t-4 border-dashed border-dreamxec-navy">
            <button className="btn-pastel-primary px-8 py-4 rounded-lg text-lg md:text-xl font-bold w-full md:w-auto">
              Continue Your Journey →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
