import { Navbar } from "./components/Navbar";
import type { UserRole } from "../../types";

interface HeaderProps {
  currentUser?: { name: string; role: UserRole } | null;
  onLogin?: () => void;
  onLogout?: () => void;
}

export const Header = ({ currentUser, onLogin, onLogout }: HeaderProps) => {
  return (
    <header className="relative self-stretch box-border caret-transparent grid col-end-2 col-start-1 row-end-2 row-start-1 grid-cols-[1fr] grid-rows-[1fr] justify-self-stretch z-50">
      <section className="relative bg-transparent caret-transparent grid grid-cols-[minmax(0px,1fr)] grid-rows-[1fr] h-auto max-h-[99999px] max-w-[99999px] min-h-20 pointer-events-auto md:h-[108px] md:min-h-0">
        <div className="absolute caret-transparent h-full w-full overflow-hidden left-0 top-0">
          <div className="absolute bg-off-white caret-transparent h-full w-full top-0"></div>
          {/* Enhanced tricolor accent strips */}
          {/* <div className="absolute top-0 left-0 right-0 h-3 bg-tricolor-horizontal"></div> */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-dreamxec-saffron via-dreamxec-green to-dreamxec-saffron"></div>
          <div className="caret-transparent h-full"></div>
        </div>
        <div className="relative box-border caret-transparent gap-x-0 grid grid-cols-[minmax(0px,1fr)] grid-rows-[minmax(44.1111px,auto)] pointer-events-none gap-y-0 pt-[4.81799%] pb-[18px] px-[3.21199%] md:gap-x-[normal] md:grid-rows-[minmax(108px,auto)] md:p-[0%]">
          <div className="relative self-start caret-transparent hidden col-end-2 col-start-2 row-end-2 row-start-1 h-0 justify-self-start pointer-events-auto w-0"></div>
          <div
            role=""
            className="relative self-stretch caret-transparent flex flex-col col-end-2 col-start-1 row-end-2 row-start-1 h-auto justify-self-stretch max-h-[99999px] max-w-[99999px] pointer-events-auto w-auto m-[0%] md:self-center md:h-[89.5px] md:justify-self-center md:w-[92.1366%]"
          >
            {/* Enhanced oil pastel card style for navbar with rounded corners */}
            <div className="absolute bg-white caret-transparent border-dreamxec-navy rounded-2xl border-5 inset-0 shadow-pastel-saffron"></div>
            <Navbar currentUser={currentUser} onLogin={onLogin} onLogout={onLogout} />
          </div>
        </div>
      </section>
    </header>
  );
};

