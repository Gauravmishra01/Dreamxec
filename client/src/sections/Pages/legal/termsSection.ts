import Intro from "./sections/Intro";
import Definitions from "./sections/Definitions";
import Accounts from "./sections/Accounts";
import AcceptableUse from "./sections/AcceptableUse";
import Payments from "./sections/Payments";
import IP from "./sections/IP";
import Liability from "./sections/Liability";
import Indemnity from "./sections/Indemnity";
import Termination from "./sections/Termination";
import Changes from "./sections/Changes";
import General from "./sections/General";
import Special from "./sections/Special";
import Contact from "./sections/Contact";

export const TERMS_SECTIONS = [
  { id: "intro", label: "Introduction", component: Intro },
  { id: "definitions", label: "1. Definitions", component: Definitions },
  { id: "accounts", label: "2. Accounts", component: Accounts },
  { id: "use", label: "3. Acceptable Use", component: AcceptableUse },
  { id: "payments", label: "4. Payments", component: Payments },
  { id: "ip", label: "6. IP Rights", component: IP },
  { id: "liability", label: "7. Liability", component: Liability },
  { id: "indemnity", label: "8. Indemnity", component: Indemnity },
  { id: "termination", label: "9. Termination", component: Termination },
  { id: "changes", label: "10. Changes", component: Changes },
  { id: "general", label: "11. General", component: General },
  { id: "special", label: "12. Special Provisions", component: Special },
  { id: "contact", label: "13. Contact", component: Contact },
];
