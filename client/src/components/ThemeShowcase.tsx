import { 
  LightBulbIcon, 
  HandshakeIcon, 
  LabFlaskIcon, 
  CollaborationIcon,
  StarDecoration,
  ArrowDecoration 
} from './icons';

/**
 * This component showcases the India Innovation theme redesign
 * with all the new oil pastel style elements
 */
export const ThemeShowcase = () => {
  return (
    <div className="py-16 px-4 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="bg-tricolor-horizontal h-3 w-48 rounded-full"></div>
        </div>
        <h1 className="text-5xl md:text-7xl font-display font-extrabold text-dreamxec-navy mb-4">
          India Innovation <span className="text-dreamxec-saffron">Platform</span>
        </h1>
        <p className="text-xl text-dreamxec-navy opacity-80 max-w-2xl mx-auto">
          Hand-drawn oil pastel design celebrating India's journey to innovation
        </p>
      </div>

      {/* Color Palette Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-display font-bold text-dreamxec-navy mb-8 flex items-center gap-3">
          <StarDecoration className="w-10 h-10" color="#FF9933" />
          Color Palette
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="card-pastel p-6 text-center">
            <div className="bg-dreamxec-saffron h-24 mb-4 rounded-lg border-2 border-dreamxec-navy"></div>
            <h3 className="font-bold text-dreamxec-navy">Saffron</h3>
            <p className="text-sm text-dreamxec-navy opacity-70">#FF9933</p>
          </div>
          <div className="card-pastel p-6 text-center">
            <div className="bg-dreamxec-white h-24 mb-4 rounded-lg border-2 border-dreamxec-navy"></div>
            <h3 className="font-bold text-dreamxec-navy">White</h3>
            <p className="text-sm text-dreamxec-navy opacity-70">#FFFFFF</p>
          </div>
          <div className="card-pastel p-6 text-center">
            <div className="bg-dreamxec-green h-24 mb-4 rounded-lg border-2 border-dreamxec-navy"></div>
            <h3 className="font-bold text-dreamxec-navy">Green</h3>
            <p className="text-sm text-dreamxec-navy opacity-70">#138808</p>
          </div>
          <div className="card-pastel p-6 text-center">
            <div className="bg-dreamxec-navy h-24 mb-4 rounded-lg border-2 border-dreamxec-navy"></div>
            <h3 className="font-bold text-dreamxec-navy">Navy</h3>
            <p className="text-sm text-dreamxec-navy opacity-70">#000080</p>
          </div>
        </div>
      </section>

      {/* Icons Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-display font-bold text-dreamxec-navy mb-8 flex items-center gap-3">
          <StarDecoration className="w-10 h-10" color="#138808" />
          Hand-Drawn Icons
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="card-pastel p-6 text-center card-pastel-tilt-right">
            <div className="icon-pastel-container mx-auto mb-4">
              <LightBulbIcon className="w-12 h-12" />
            </div>
            <h3 className="font-bold text-dreamxec-navy">Ideas</h3>
          </div>
          <div className="card-pastel p-6 text-center card-pastel-tilt-left">
            <div className="icon-pastel-container mx-auto mb-4">
              <HandshakeIcon className="w-12 h-12" />
            </div>
            <h3 className="font-bold text-dreamxec-navy">Partnership</h3>
          </div>
          <div className="card-pastel p-6 text-center card-pastel-tilt-right">
            <div className="icon-pastel-container mx-auto mb-4">
              <LabFlaskIcon className="w-12 h-12" />
            </div>
            <h3 className="font-bold text-dreamxec-navy">Research</h3>
          </div>
          <div className="card-pastel p-6 text-center card-pastel-tilt-left">
            <div className="icon-pastel-container mx-auto mb-4">
              <CollaborationIcon className="w-12 h-12" />
            </div>
            <h3 className="font-bold text-dreamxec-navy">Team</h3>
          </div>
        </div>
      </section>

      {/* Buttons Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-display font-bold text-dreamxec-navy mb-8">
          Oil Pastel Buttons
        </h2>
        <div className="flex flex-wrap gap-6">
          <button className="btn-pastel-primary px-8 py-4 rounded-lg text-lg font-bold">
            Primary Action
          </button>
          <button className="btn-pastel-secondary px-8 py-4 rounded-lg text-lg font-bold">
            Secondary Action
          </button>
        </div>
      </section>

      {/* Cards Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-display font-bold text-dreamxec-navy mb-8">
          Tricolor Cards
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="card-pastel p-8 card-pastel-tilt-right">
            <div className="bg-tricolor-horizontal h-3 -mt-8 -mx-8 mb-6"></div>
            <h3 className="text-2xl font-display font-bold text-dreamxec-navy mb-4 flex items-center gap-2">
              Innovation Card
              <StarDecoration className="w-6 h-6" color="#FF9933" />
            </h3>
            <p className="text-dreamxec-navy mb-4">
              This card features the tricolor header bar and hand-drawn elements
              with thick borders and shadow effects.
            </p>
            <div className="flex items-center gap-2 text-dreamxec-saffron font-bold">
              Learn More
              <ArrowDecoration className="w-8 h-6" color="#FF9933" />
            </div>
          </div>

          <div className="card-pastel p-8 card-pastel-tilt-left">
            <div className="bg-tricolor-horizontal h-3 -mt-8 -mx-8 mb-6"></div>
            <h3 className="text-2xl font-display font-bold text-dreamxec-navy mb-4 flex items-center gap-2">
              Progress Card
              <StarDecoration className="w-6 h-6" color="#138808" />
            </h3>
            <p className="text-dreamxec-navy mb-4">
              Cards can be tilted slightly for that authentic hand-drawn feel
              with vivid, solid colors.
            </p>
            <div className="progress-bar-pastel h-8 rounded-lg overflow-hidden">
              <div className="progress-bar-fill h-full bg-dreamxec-green" style={{ width: '70%' }}>
                <div className="h-full flex items-center justify-end pr-2">
                  <span className="text-white font-bold text-xs">★</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorative Elements */}
      <section className="mb-16">
        <h2 className="text-3xl font-display font-bold text-dreamxec-navy mb-8">
          Decorative Elements
        </h2>
        <div className="card-pastel p-8">
          <div className="flex flex-wrap items-center justify-around gap-8">
            <StarDecoration className="w-16 h-16" color="#FF9933" />
            <StarDecoration className="w-16 h-16" color="#138808" />
            <ArrowDecoration className="w-20 h-12" color="#FF9933" direction="right" />
            <ArrowDecoration className="w-20 h-12" color="#138808" direction="left" />
            <div className="bg-tricolor-horizontal h-4 w-32 rounded-full"></div>
            <div className="bg-tricolor-vertical w-4 h-32 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* Checklist Example */}
      <section>
        <h2 className="text-3xl font-display font-bold text-dreamxec-navy mb-8">
          Oil Pastel Checklist
        </h2>
        <div className="card-pastel p-8">
          <div className="space-y-4">
            <div className="checklist-item-pastel py-3">
              <span className="text-dreamxec-navy text-lg font-semibold">
                Redesign complete ✓
              </span>
            </div>
            <div className="checklist-item-pastel py-3">
              <span className="text-dreamxec-navy text-lg font-semibold">
                All icons created ✓
              </span>
            </div>
            <div className="checklist-item-pastel py-3">
              <span className="text-dreamxec-navy text-lg font-semibold">
                Components documented ✓
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
