import { useState, useRef, useEffect } from 'react';
import { StarDecoration } from './icons/StarDecoration';
import imageIcon from '../assets/image.png';

// Simple SVG Icons
const ArrowLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </svg>
);

const UploadIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" x2="12" y1="3" y2="15" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

interface CreateCampaignProps {
  onBack: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    clubName: string;
    goalAmount: number;
    bannerFile: File | null;
    mediaFiles: File[];
    deckFile: File | null;
  }) => Promise<void>;
}

export default function CreateCampaign({ onBack, onSubmit }: CreateCampaignProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [clubName, setClubName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');

  // file states
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [deckFile, setDeckFile] = useState<File | null>(null);

  // preview states
  const [bannerPreview, setBannerPreview] = useState<string>('');
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);

  const [showSuccess, setShowSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Refs for file inputs
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const deckInputRef = useRef<HTMLInputElement>(null);

  // Cleanup object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (bannerPreview) URL.revokeObjectURL(bannerPreview);
      mediaPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [bannerPreview, mediaPreviews]);


  const handleBannerSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setBannerFile(file);
      setBannerPreview(URL.createObjectURL(file));
      setSubmitError('');
    }
  };

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setMediaFiles(prev => [...prev, ...newFiles]);

      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setMediaPreviews(prev => [...prev, ...newPreviews]);
      setSubmitError('');
    }
  };

  const handleDeckSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setDeckFile(e.target.files[0]);
      setSubmitError('');
    }
  };

  const handleRemoveMedia = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    setMediaPreviews(prev => {
      const urlToRemove = prev[index];
      URL.revokeObjectURL(urlToRemove);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!bannerFile) {
      setSubmitError('Please upload a main banner image.');
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        title,
        description,
        clubName,
        goalAmount: parseFloat(goalAmount),
        bannerFile,
        mediaFiles,
        deckFile
      });

      setShowSuccess(true);
      setTimeout(() => {
        onBack();
      }, 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create campaign';
      setSubmitError(msg);
      setIsSubmitting(false); // Only stop loading on error, keep loading on success until unmount/redirect
    }
  };

  const isFormValid =
    title.trim() &&
    description.trim() &&
    clubName.trim() &&
    parseFloat(goalAmount) > 0 &&
    bannerFile;

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-dreamxec-cream flex items-center justify-center px-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 z-0 opacity-20">
          <StarDecoration className="w-16 h-16" color="#FF7F00" />
        </div>
        <div className="absolute top-40 right-20 z-0 opacity-20">
          <StarDecoration className="w-12 h-12" color="#0B9C2C" />
        </div>
        <div className="absolute bottom-32 left-1/4 z-0 opacity-15">
          <StarDecoration className="w-20 h-20" color="#000080" />
        </div>

        <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-12 text-center max-w-md relative z-10">
          <div className="card-tricolor-tag"></div>

          <div className="bg-dreamxec-green border-5 border-dreamxec-navy w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-pastel-green">
            <CheckCircleIcon className="w-12 h-12 text-white" />
          </div>

          <div className="flex items-center justify-center gap-3 mb-3">
            <h2 className="text-4xl font-bold text-dreamxec-navy font-display">
              Campaign Submitted!
            </h2>
            <StarDecoration className="w-8 h-8" color="#FF7F00" />
          </div>

          <p className="text-dreamxec-navy text-xl font-sans opacity-80">
            Your campaign and files have been successfully uploaded. You'll be notified once it's approved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dreamxec-cream relative overflow-hidden">
      {/* Decorative stars */}
      <div className="absolute top-20 left-10 z-0 opacity-20">
        <StarDecoration className="w-16 h-16" color="#FF7F00" />
      </div>
      <div className="absolute top-40 right-20 z-0 opacity-20">
        <StarDecoration className="w-12 h-12" color="#0B9C2C" />
      </div>
      <div className="absolute bottom-32 right-1/4 z-0 opacity-15">
        <StarDecoration className="w-20 h-20" color="#000080" />
      </div>

      {/* Saffron/Green decorations */}
      <div className="absolute top-[14%] left-[3%] z-0 opacity-90 animate-float-slow pointer-events-none hidden min-[1400px]:block">
        <img
          src={imageIcon}
          alt="Left Decor Wellness"
          className="w-52 sm:w-60 md:w-72 lg:w-80 xl:w-88 2xl:w-96 h-auto object-contain"
          style={{
            animationDelay: '0s',
            filter: 'drop-shadow(0 0 6px rgba(0,0,0,0.1))',
          }}
        />
      </div>

      {/* Header with Back Button */}
      <div className="relative bg-dreamxec-navy border-b-8 border-dreamxec-orange shadow-pastel-saffron z-10">
        <div className="card-tricolor-tag"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={onBack}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-4 py-2 bg-dreamxec-orange text-white rounded-lg border-3 border-white hover:scale-105 transition-transform font-display font-bold shadow-pastel-saffron disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            Back to Dashboard
          </button>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="card-pastel-offwhite rounded-xl border-5 border-dreamxec-navy shadow-pastel-card p-6 sm:p-8">
          <div className="card-tricolor-tag"></div>

          <div className="flex items-center gap-4 mb-2 mt-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-dreamxec-navy font-display">
              Create New Campaign
            </h1>
            <StarDecoration className="w-10 h-10 hidden sm:block" color="#FF7F00" />
          </div>

          <p className="text-dreamxec-navy text-xl font-sans opacity-80 mb-8">
            Fill out the form below to create a fundraising campaign for your club
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campaign Title */}
            <div>
              <label className="block text-lg font-bold text-dreamxec-navy mb-2 font-display">
                Campaign Title <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a compelling campaign title"
                required
                className="w-full px-4 py-3 border-4 border-dreamxec-navy rounded-lg text-lg font-sans text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-orange focus:ring-2 focus:ring-dreamxec-orange transition-all shadow-pastel-saffron"
              />
            </div>

            {/* Club Name */}
            <div>
              <label className="block text-lg font-bold text-dreamxec-navy mb-2 font-display">
                Club Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                value={clubName}
                onChange={(e) => setClubName(e.target.value)}
                placeholder="Enter your club or organization name"
                required
                className="w-full px-4 py-3 border-4 border-dreamxec-navy rounded-lg text-lg font-sans text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-green focus:ring-2 focus:ring-dreamxec-green transition-all shadow-pastel-green"
              />
            </div>

            {/* Fundraising Goal */}
            <div>
              <label className="block text-lg font-bold text-dreamxec-navy mb-2 font-display">
                Fundraising Goal <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-dreamxec-navy font-bold text-xl">
                  ₹
                </span>
                <input
                  type="number"
                  value={goalAmount}
                  onChange={(e) => setGoalAmount(e.target.value)}
                  placeholder="50000"
                  min="1"
                  step="0.01"
                  required
                  className="w-full pl-10 pr-4 py-3 border-4 border-dreamxec-navy rounded-lg text-lg font-sans text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-orange focus:ring-2 focus:ring-dreamxec-orange transition-all shadow-pastel-saffron"
                />
              </div>
              <p className="text-base text-dreamxec-navy opacity-70 mt-2 font-sans">
                Enter the total amount you need to raise
              </p>
            </div>

            {/* Campaign Description */}
            <div>
              <label className="block text-lg font-bold text-dreamxec-navy mb-2 font-display">
                Campaign Description <span className="text-red-600">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your campaign, why you need funding, and how the funds will be used..."
                rows={8}
                required
                className="w-full px-4 py-3 border-4 border-dreamxec-navy rounded-lg text-lg font-sans text-dreamxec-navy bg-white focus:outline-none focus:border-dreamxec-green focus:ring-2 focus:ring-dreamxec-green transition-all resize-none shadow-pastel-green"
              />
            </div>

            {/* Campaign Main Image Upload */}
            <div>
              <label className="block text-lg font-bold text-dreamxec-navy mb-2 font-display">
                Main Banner Image <span className="text-red-600">*</span>
              </label>
              <div
                className="border-4 border-dashed border-dreamxec-navy rounded-lg p-6 text-center cursor-pointer hover:bg-white transition-colors"
                onClick={() => bannerInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={bannerInputRef}
                  hidden
                  accept="image/*"
                  onChange={handleBannerSelect}
                />

                {bannerPreview ? (
                  <div className="relative">
                    <img src={bannerPreview} alt="Banner Preview" className="max-h-64 mx-auto rounded-lg shadow-pastel-navy border-2 border-dreamxec-navy" />
                    <p className="mt-2 text-dreamxec-navy font-bold">Click to change banner</p>
                  </div>
                ) : (
                  <>
                    <UploadIcon className="w-10 h-10 mx-auto text-dreamxec-navy mb-2" />
                    <p className="text-dreamxec-navy font-bold">Click to upload banner image</p>
                    <p className="text-sm text-dreamxec-navy opacity-70">JPG, PNG supported</p>
                  </>
                )}
              </div>
            </div>

            {/* Campaign Media (Images/Videos) */}
            <div>
              <label className="block text-lg font-bold text-dreamxec-navy mb-2 font-display">
                Additional Media (Images/Video)
              </label>
              <div
                className="border-4 border-dashed border-dreamxec-navy rounded-lg p-6 text-center cursor-pointer hover:bg-white transition-colors"
                onClick={() => mediaInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={mediaInputRef}
                  hidden
                  multiple
                  accept="image/*,video/*"
                  onChange={handleMediaSelect}
                />
                <UploadIcon className="w-10 h-10 mx-auto text-dreamxec-navy mb-2" />
                <p className="text-dreamxec-navy font-bold">Click to upload images or videos</p>
              </div>

              {/* Media Preview Grid */}
              {mediaPreviews.length > 0 && (
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {mediaPreviews.map((url, idx) => (
                    <div key={idx} className="relative aspect-square border-4 border-dreamxec-navy rounded-lg overflow-hidden group">
                      <img src={url} alt={`Media ${idx}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleRemoveMedia(idx); }}
                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Pitch Deck (PDF/PPT) */}
            <div>
              <label className="block text-lg font-bold text-dreamxec-navy mb-2 font-display">
                Pitch Deck (PDF/PPT)
              </label>
              <div
                className="border-4 border-dashed border-dreamxec-navy rounded-lg p-6 text-center cursor-pointer hover:bg-white transition-colors"
                onClick={() => deckInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={deckInputRef}
                  hidden
                  accept="application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation"
                  onChange={handleDeckSelect}
                />
                <div className="flex flex-col items-center">
                  {deckFile ? (
                    <div className="flex items-center gap-2 text-green-700 font-bold">
                      <CheckCircleIcon className="w-6 h-6" />
                      <span>Selected: {deckFile.name}</span>
                    </div>
                  ) : (
                    <>
                      <UploadIcon className="w-10 h-10 mx-auto text-dreamxec-navy mb-2" />
                      <p className="text-dreamxec-navy font-bold">Upload Pitch Deck (PDF/PPT)</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                type="button"
                onClick={onBack}
                disabled={isSubmitting}
                className="px-6 py-3 border-4 border-dreamxec-navy rounded-lg font-bold text-dreamxec-navy hover:bg-dreamxec-cream transition-colors font-display text-lg shadow-pastel-navy disabled:opacity-50"
              >
                Cancel
              </button>

              <div className="flex-1">
                {submitError && (
                  <div className="mb-4 p-4 bg-red-100 border-4 border-red-600 text-red-700 rounded-lg font-sans">
                    {submitError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className={`w-full px-6 py-3 rounded-lg font-bold text-white transition-all font-display text-lg border-4 border-dreamxec-navy ${isFormValid
                      ? 'bg-dreamxec-green hover:scale-105 shadow-pastel-green'
                      : 'bg-gray-400 cursor-not-allowed opacity-50'
                    } ${isSubmitting ? 'opacity-75 cursor-wait' : ''}`}
                >
                  {isSubmitting ? 'Creating Campaign & Uploading...' : 'Submit for Review'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
