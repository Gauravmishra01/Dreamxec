interface MobileMenuButtonProps {
  onClick?: () => void;
}

export const MobileMenuButton = ({ onClick }: MobileMenuButtonProps) => {
  return (
    <div
      role=""
      className="relative self-center box-border caret-transparent gap-x-0 grid col-end-4 col-start-3 row-end-2 row-start-1 grid-cols-[minmax(0px,34.0139fr)] grid-rows-[minmax(34.0139px,auto)] justify-self-end mr-[-0.0299398%] mt-[-0.21972%] max-h-[99999px] max-w-[99999px] min-h-12 pointer-events-auto gap-y-0 w-12 ml-[0%] mb-[0%] md:hidden md:grid-cols-[minmax(0px,1fr)] md:grid-rows-[minmax(48.0139px,auto)] md:min-h-[48.0139px] md:w-[47.9583px] md:mr-[0%] md:mt-[0%] md:mb-[0.00597275%]"
    >
      <div className="absolute bg-dreamxec-orange caret-transparent inset-0 rounded-lg"></div>
      <button 
        onClick={onClick}
        className="relative text-[13.3333px] self-center bg-transparent caret-transparent block col-end-2 col-start-1 row-end-2 row-start-1 h-[30px] justify-self-center min-h-[auto] min-w-[auto] text-center w-[30px] ml-0 mr-[0%] my-[0%] p-0 font-sans md:hidden md:h-8 md:min-h-0 md:min-w-0 md:w-8 md:ml-[0%]"
      >
        <div className="absolute caret-transparent fill-white stroke-white stroke-0 inset-0 flex items-center justify-center">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
      </button>
    </div>
  );
};
