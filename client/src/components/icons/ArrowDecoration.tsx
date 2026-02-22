export const ArrowDecoration = ({ 
  className = "w-12 h-8", 
  color = "#FF9933",
  direction = "right" 
}: { 
  className?: string; 
  color?: string;
  direction?: "right" | "left" | "up" | "down";
}) => {
  const rotations = {
    right: "0",
    left: "180",
    up: "270",
    down: "90"
  };
  
  return (
    <svg
      className={className}
      viewBox="0 0 60 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotations[direction]}deg)` }}
    >
      {/* Hand-drawn arrow */}
      <g>
        {/* Arrow shaft */}
        <path
          d="M 5 20 L 42 20"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
        />
        
        {/* Arrow head */}
        <path
          d="M 35 10 L 50 20 L 35 30"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        
        {/* Outline for oil pastel effect */}
        <path
          d="M 5 20 L 42 20 M 35 10 L 50 20 L 35 30"
          stroke="#003366"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          opacity="0.3"
        />
      </g>
    </svg>
  );
};
