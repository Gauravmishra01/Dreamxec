/**
 * App with Admin Dashboard Demo
 * 
 * To see the Admin Dashboard, temporarily rename your current App.tsx
 * and use this file to view the Admin Dashboard showcase.
 */

import FloatingDoodles from "./components/FloatingDoodles";
import AdminDashboardShowcase from "./examples/AdminDashboardShowcase";

export const App = () => {
  return (
    <body className="text-dreamxec-navy text-[10px] not-italic normal-nums font-normal accent-auto caret-transparent block h-full tracking-[normal] leading-[normal] list-outside list-disc overflow-x-auto overflow-y-scroll pointer-events-auto text-start indent-[0px] normal-case visible border-separate font-sans">
      {/* Floating doodle animations */}
      <FloatingDoodles count={8} />
      
      <div className="relative caret-transparent z-10">
        <div className="caret-transparent">
          <div className="relative caret-transparent min-h-full mx-auto top-0">
            <div className="caret-transparent">
              <div className="caret-transparent">
                <div className="caret-transparent grid grid-cols-[1fr] grid-rows-[1fr] h-full">
                  <div className="relative self-stretch caret-transparent grid col-end-2 col-start-1 row-end-2 row-start-1 grid-cols-[minmax(0px,1fr)] grid-rows-[1fr] justify-self-stretch">
                    <div className="caret-transparent">
                      <div className="relative caret-transparent grid grid-cols-[minmax(0px,1fr)] grid-rows-[1fr] overflow-clip">
                        <div className="relative box-border caret-transparent grid grid-cols-[minmax(0px,1fr)] grid-rows-[auto] pointer-events-none">
                          {/* Admin Dashboard Showcase */}
                          <div className="pointer-events-auto">
                            <AdminDashboardShowcase />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </body>
  );
};

export default App;
