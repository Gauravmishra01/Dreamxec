export const HandshakeIcon = ({ className = "w-12 h-12" }: { className?: string }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Hand-drawn handshake with oil pastel style */}
      <g>
        {/* Left hand - saffron */}
        <path
          d="M 15 50 Q 20 40, 30 45 L 35 50 L 38 55 L 35 60 Q 25 65, 18 58 Z"
          fill="#FF9933"
          stroke="#003366"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Right hand - green */}
        <path
          d="M 85 50 Q 80 40, 70 45 L 65 50 L 62 55 L 65 60 Q 75 65, 82 58 Z"
          fill="#138808"
          stroke="#003366"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/*握手中间部分 - white */}
        <ellipse
          cx="50"
          cy="52"
          rx="18"
          ry="12"
          fill="#FFFFFF"
          stroke="#003366"
          strokeWidth="4"
        />
        
        {/* Fingers detail lines */}
        <g stroke="#003366" strokeWidth="2">
          <line x1="32" y1="48" x2="35" y2="45" />
          <line x1="30" y1="52" x2="33" y2="50" />
          <line x1="68" y1="48" x2="65" y2="45" />
          <line x1="70" y1="52" x2="67" y2="50" />
        </g>
        
        {/* Star accent above - collaboration success */}
        <path
          d="M 50 25 L 52 32 L 59 32 L 53 37 L 55 44 L 50 39 L 45 44 L 47 37 L 41 32 L 48 32 Z"
          fill="#FF9933"
          stroke="#003366"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
};
