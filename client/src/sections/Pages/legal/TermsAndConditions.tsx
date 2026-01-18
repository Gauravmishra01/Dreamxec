import { useSearchParams } from "react-router-dom";
import { TERMS_SECTIONS } from "./termsSection";
import { Header } from "../../Header";
import { FooterContent } from "../../Footer/components/FooterContent";

export default function TermsAndConditions() {
    const [params, setParams] = useSearchParams();
    const activeId = params.get("section") || "intro";

    const activeSection =
        TERMS_SECTIONS.find(s => s.id === activeId) || TERMS_SECTIONS[0];

    const ActiveComponent = activeSection.component;

    return (
        <>
            <Header />
            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Sidebar Tabs */}
                <aside className="md:col-span-1">
                    <div className="sticky top-24 space-y-2">
                        {TERMS_SECTIONS.map(section => (
                            <button
                                key={section.id}
                                onClick={() => setParams({ section: section.id })}
                                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition
                ${section.id === activeId
                                        ? "bg-dreamxec-navy text-white"
                                        : "hover:bg-dreamxec-beige"
                                    }
              `}
                            >
                                {section.label}
                            </button>
                        ))}
                    </div>
                </aside>
                <select
                    value={activeId}
                    onChange={e => setParams({ section: e.target.value })}
                    className="md:hidden w-full mb-6 p-3 border rounded-lg"
                >
                    {TERMS_SECTIONS.map(s => (
                        <option key={s.id} value={s.id}>
                            {s.label}
                        </option>
                    ))}
                </select>


                {/* Content */}
                <main className="md:col-span-3 bg-white rounded-xl p-6 shadow-sm">
                    <ActiveComponent />
                </main>
            </div>
            <FooterContent />
        </>
    );
}
