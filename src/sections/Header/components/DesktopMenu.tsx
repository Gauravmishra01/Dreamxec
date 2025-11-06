import type { UserRole } from "../../../types";

interface DesktopMenuProps {
  currentUser?: { name: string; role: UserRole } | null;
}

export const DesktopMenu = ({ currentUser }: DesktopMenuProps) => {
  return (
    <div className="relative self-center caret-transparent hidden col-end-3 col-start-2 row-end-2 row-start-1 justify-self-end max-h-[99999px] max-w-[99999px] min-h-[34.7969px] pointer-events-auto w-[241.278px] ml-[0%] mr-[3.31797%] mt-[0%] mb-[0.00219322%] md:block md:w-[450px] md:mr-[3.84791%] md:mb-[0.00189272%]">
      <nav
        aria-label="Site"
        className="bg-transparent bg-[linear-gradient(rgba(240,240,240,0)_0%,rgba(240,240,240,0)_100%),none] bg-size-[auto,auto] shadow-[rgba(0,0,0,0)_0px_0px_2px_0px] box-border caret-transparent flex h-full overflow-x-scroll overflow-y-auto w-full bg-[position:0%,0%_50%,0%]"
      >
        <ul className="box-border caret-transparent flex grow justify-center list-none min-h-0 min-w-fit w-full pl-0 md:min-h-[auto] md:w-[calc(100%_+_8px)]">
          {currentUser?.role === 'student' && (
            <>
              <li className="box-border caret-transparent grow min-h-0 min-w-0 md:min-h-[auto] md:min-w-[auto]">
                <div className="box-border caret-transparent h-full">
                  <a
                    href="/dashboard"
                    className="relative text-dreamxec-orange bg-transparent border-b-dreamxec-orange box-border caret-transparent block basis-[0%] grow h-full mr-0 p-0 border-t-transparent border-y-2 border-solid hover:text-dreamxec-green hover:border-b-dreamxec-green transition-colors md:bg-transparent md:border-b-dreamxec-orange md:mr-1 md:px-2.5 md:py-1"
                  >
                    <div className="items-center box-border caret-transparent flex h-full justify-center">
                      <span className="text-dreamxec-navy text-[9px] font-bold box-border caret-transparent block leading-[normal] min-h-0 min-w-0 text-nowrap font-sans md:text-[17px] md:font-semibold md:leading-[23.8px] md:min-h-[auto] md:min-w-[auto]">
                        DASHBOARD
                      </span>
                    </div>
                  </a>
                </div>
              </li>
              <li className="box-border caret-transparent grow min-h-0 min-w-0 md:min-h-[auto] md:min-w-[auto]">
                <div className="box-border caret-transparent h-full">
                  <a
                    href="/campaigns"
                    className="relative text-dreamxec-orange bg-transparent box-border caret-transparent block basis-[0%] grow h-full mx-0 p-0 border-t-2 border-b-[3px] border-y-transparent border-solid hover:text-dreamxec-green hover:border-b-dreamxec-green transition-colors md:bg-transparent md:mx-1 md:px-2.5 md:py-1 md:border-b-transparent md:border-b"
                  >
                    <div className="items-center box-border caret-transparent flex h-full justify-center">
                      <span className="text-dreamxec-navy text-[9px] font-bold box-border caret-transparent block leading-[normal] min-h-0 min-w-0 text-nowrap font-sans md:text-[17px] md:font-semibold md:leading-[23.8px] md:min-h-[auto] md:min-w-[auto]">
                        CAMPAIGNS
                      </span>
                    </div>
                  </a>
                </div>
              </li>
              <li className="box-border caret-transparent grow min-h-0 min-w-0 md:min-h-[auto] md:min-w-[auto]">
                <div className="box-border caret-transparent h-full">
                  <a
                    href="/projects"
                    className="relative text-dreamxec-orange bg-transparent box-border caret-transparent block basis-[0%] grow h-full mx-0 p-0 border-t-2 border-b-[3px] border-y-transparent border-solid hover:text-dreamxec-green hover:border-b-dreamxec-green transition-colors md:bg-transparent md:mx-1 md:px-2.5 md:py-1 md:border-b-transparent md:border-b"
                  >
                    <div className="items-center box-border caret-transparent flex h-full justify-center">
                      <span className="text-dreamxec-navy text-[9px] font-bold box-border caret-transparent block leading-[normal] min-h-0 min-w-0 text-nowrap font-sans md:text-[17px] md:font-semibold md:leading-[23.8px] md:min-h-[auto] md:min-w-[auto]">
                        OPPORTUNITIES
                      </span>
                    </div>
                  </a>
                </div>
              </li>
            </>
          )}
          {currentUser?.role === 'admin' && (
            <>
              <li className="box-border caret-transparent grow min-h-0 min-w-0 md:min-h-[auto] md:min-w-[auto]">
                <div className="box-border caret-transparent h-full">
                  <a
                    href="/admin"
                    className="relative text-dreamxec-orange bg-transparent border-b-dreamxec-orange box-border caret-transparent block basis-[0%] grow h-full mr-0 p-0 border-t-transparent border-y-2 border-solid hover:text-dreamxec-green hover:border-b-dreamxec-green transition-colors md:bg-transparent md:border-b-dreamxec-orange md:mr-1 md:px-2.5 md:py-1"
                  >
                    <div className="items-center box-border caret-transparent flex h-full justify-center">
                      <span className="text-dreamxec-navy text-[9px] font-bold box-border caret-transparent block leading-[normal] min-h-0 min-w-0 text-nowrap font-sans md:text-[17px] md:font-semibold md:leading-[23.8px] md:min-h-[auto] md:min-w-[auto]">
                        ADMIN DASHBOARD
                      </span>
                    </div>
                  </a>
                </div>
              </li>
              <li className="box-border caret-transparent grow min-h-0 min-w-0 md:min-h-[auto] md:min-w-[auto]">
                <div className="box-border caret-transparent h-full">
                  <a
                    href="/campaigns"
                    className="relative text-dreamxec-orange bg-transparent box-border caret-transparent block basis-[0%] grow h-full mx-0 p-0 border-t-2 border-b-[3px] border-y-transparent border-solid hover:text-dreamxec-green hover:border-b-dreamxec-green transition-colors md:bg-transparent md:mx-1 md:px-2.5 md:py-1 md:border-b-transparent md:border-b"
                  >
                    <div className="items-center box-border caret-transparent flex h-full justify-center">
                      <span className="text-dreamxec-navy text-[9px] font-bold box-border caret-transparent block leading-[normal] min-h-0 min-w-0 text-nowrap font-sans md:text-[17px] md:font-semibold md:leading-[23.8px] md:min-h-[auto] md:min-w-[auto]">
                        CAMPAIGNS
                      </span>
                    </div>
                  </a>
                </div>
              </li>
            </>
          )}
          {currentUser?.role === 'donor' && (
            <>
              <li className="box-border caret-transparent grow min-h-0 min-w-0 md:min-h-[auto] md:min-w-[auto]">
                <div className="box-border caret-transparent h-full">
                  <a
                    href="/donor/dashboard"
                    className="relative text-dreamxec-orange bg-transparent border-b-dreamxec-orange box-border caret-transparent block basis-[0%] grow h-full mr-0 p-0 border-t-transparent border-y-2 border-solid hover:text-dreamxec-green hover:border-b-dreamxec-green transition-colors md:bg-transparent md:border-b-dreamxec-orange md:mr-1 md:px-2.5 md:py-1"
                  >
                    <div className="items-center box-border caret-transparent flex h-full justify-center">
                      <span className="text-dreamxec-navy text-[9px] font-bold box-border caret-transparent block leading-[normal] min-h-0 min-w-0 text-nowrap font-sans md:text-[17px] md:font-semibold md:leading-[23.8px] md:min-h-[auto] md:min-w-[auto]">
                        MY PROJECTS
                      </span>
                    </div>
                  </a>
                </div>
              </li>
              <li className="box-border caret-transparent grow min-h-0 min-w-0 md:min-h-[auto] md:min-w-[auto]">
                <div className="box-border caret-transparent h-full">
                  <a
                    href="/campaigns"
                    className="relative text-dreamxec-orange bg-transparent box-border caret-transparent block basis-[0%] grow h-full mx-0 p-0 border-t-2 border-b-[3px] border-y-transparent border-solid hover:text-dreamxec-green hover:border-b-dreamxec-green transition-colors md:bg-transparent md:mx-1 md:px-2.5 md:py-1 md:border-b-transparent md:border-b"
                  >
                    <div className="items-center box-border caret-transparent flex h-full justify-center">
                      <span className="text-dreamxec-navy text-[9px] font-bold box-border caret-transparent block leading-[normal] min-h-0 min-w-0 text-nowrap font-sans md:text-[17px] md:font-semibold md:leading-[23.8px] md:min-h-[auto] md:min-w-[auto]">
                        CAMPAIGNS
                      </span>
                    </div>
                  </a>
                </div>
              </li>
            </>
          )}
          {!currentUser && (
            <>
              <li className="box-border caret-transparent grow min-h-0 min-w-0 md:min-h-[auto] md:min-w-[auto]">
                <div className="box-border caret-transparent h-full">
                  <a
                    href="/"
                    className="relative text-dreamxec-orange bg-transparent border-b-dreamxec-orange box-border caret-transparent block basis-[0%] grow h-full mr-0 p-0 border-t-transparent border-y-2 border-solid hover:text-dreamxec-green hover:border-b-dreamxec-green transition-colors md:bg-transparent md:border-b-dreamxec-orange md:mr-1 md:px-2.5 md:py-1"
                  >
                    <div className="items-center box-border caret-transparent flex h-full justify-center">
                      <span className="text-dreamxec-navy text-[9px] font-bold box-border caret-transparent block leading-[normal] min-h-0 min-w-0 text-nowrap font-sans md:text-[17px] md:font-semibold md:leading-[23.8px] md:min-h-[auto] md:min-w-[auto]">
                        HOME
                      </span>
                    </div>
                  </a>
                </div>
              </li>
              <li className="box-border caret-transparent grow min-h-0 min-w-0 md:min-h-[auto] md:min-w-[auto]">
                <div className="box-border caret-transparent h-full">
                  <a
                    href="/browse"
                    className="relative text-dreamxec-orange bg-transparent box-border caret-transparent block basis-[0%] grow h-full mx-0 p-0 border-t-2 border-b-[3px] border-y-transparent border-solid hover:text-dreamxec-green hover:border-b-dreamxec-green transition-colors md:bg-transparent md:mx-1 md:px-2.5 md:py-1 md:border-b-transparent md:border-b"
                  >
                    <div className="items-center box-border caret-transparent flex h-full justify-center">
                      <span className="text-dreamxec-navy text-[9px] font-bold box-border caret-transparent block leading-[normal] min-h-0 min-w-0 text-nowrap font-sans md:text-[17px] md:font-semibold md:leading-[23.8px] md:min-h-[auto] md:min-w-[auto]">
                        BROWSE
                      </span>
                    </div>
                  </a>
                </div>
              </li>
            </>
          )}
        </ul>
        <div className="absolute box-border caret-transparent flex justify-between pointer-events-none inset-0"></div>
      </nav>
    </div>
  );
};
