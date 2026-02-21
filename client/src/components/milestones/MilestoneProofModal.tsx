import React from "react";
import YouTube from "react-youtube";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  milestone: any;
}

const getYoutubeId = (url?: string) => {
  if (!url) return null;
  const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?/]+)/;
  const match = url.match(regExp);
  return match ? match[1] : null;
};

const getEmbedUrl = (url?: string) => {
  if (!url) return null;
  if (url.includes("drive.google.com")) {
    const fileIdMatch = url.match(/\/d\/(.*?)(\/|$)/);
    if (fileIdMatch?.[1]) return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
  }
  if (url.endsWith(".pdf")) return url;
  return null;
};

export default function MilestoneProofModal({ isOpen, onClose, milestone }: Props) {
  if (!isOpen || !milestone) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
      style={{ background: 'rgba(0,0,0,0.75)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-white w-full max-w-4xl relative"
        style={{ border: '4px solid #000080', boxShadow: '10px 10px 0 #FF7F00' }}
      >
        {/* ── Top bar ── */}
        <div className="flex items-stretch" style={{ borderBottom: '3px solid #000080' }}>
          {/* Color stripe */}
          <div className="flex w-2 flex-col">
            <div className="flex-1 bg-[#0B9C2C]" />
          </div>

          {/* Title */}
          <div className="flex-1 px-4 sm:px-5 py-3 sm:py-4">
            <p className="text-[10px] sm:text-xs font-black text-dreamxec-navy/50 uppercase tracking-widest mb-0.5">
              Proof of Completion
            </p>
            <h2 className="text-base sm:text-lg md:text-xl font-black text-dreamxec-navy uppercase tracking-tight leading-snug break-words pr-10">
              {milestone.title}
            </h2>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="flex-shrink-0 w-12 sm:w-14 flex items-center justify-center font-black text-white text-lg sm:text-xl transition-colors hover:opacity-80"
            style={{ background: '#000080', borderLeft: '3px solid #000080' }}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* ── Body ── */}
        <div className="overflow-y-auto max-h-[80vh] p-4 sm:p-5 md:p-6 space-y-5 sm:space-y-6">

          {/* YouTube */}
          {milestone.youtubeUrl && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="px-2.5 py-1 text-[10px] sm:text-xs font-black text-white uppercase tracking-widest"
                  style={{ background: '#FF7F00', border: '2px solid #000080' }}
                >
                  🎬 Video Demonstration
                </span>
              </div>
              <div style={{ border: '3px solid #000080', boxShadow: '4px 4px 0 #000080' }}>
                <YouTube
                  videoId={getYoutubeId(milestone.youtubeUrl) || ""}
                  className="w-full"
                  iframeClassName="w-full aspect-video"
                  opts={{ width: "100%", height: "auto", playerVars: { autoplay: 0 } }}
                />
              </div>
            </div>
          )}

          {/* PDF / Presentation */}
          {milestone.presentationDeckUrl && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="px-2.5 py-1 text-[10px] sm:text-xs font-black text-white uppercase tracking-widest"
                  style={{ background: '#000080', border: '2px solid #000080' }}
                >
                  📄 Presentation / Report
                </span>
              </div>
              <div
                className="overflow-hidden"
                style={{ height: 520, border: '3px solid #000080', boxShadow: '4px 4px 0 #000080' }}
              >
                <iframe
                  src={getEmbedUrl(milestone.presentationDeckUrl) || undefined}
                  className="w-full h-full"
                  title="Milestone Proof"
                />
              </div>
            </div>
          )}

          {/* Empty state */}
          {!milestone.youtubeUrl && !milestone.presentationDeckUrl && (
            <div
              className="py-10 px-6 text-center"
              style={{ border: '2px dashed #000080', background: '#f9fafb' }}
            >
              <p className="text-2xl mb-2">📭</p>
              <p className="font-black text-dreamxec-navy/50 uppercase tracking-widest text-xs sm:text-sm">
                No proof files uploaded yet
              </p>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div
          className="flex items-center justify-between px-4 sm:px-5 py-3"
          style={{ borderTop: '3px solid #000080', background: '#f9fafb' }}
        >
          <div
            className="flex items-center gap-1.5 px-2.5 py-1"
            style={{ border: '2px solid #0B9C2C', background: '#f0fdf4' }}
          >
            <span className="text-xs font-black text-green-700 uppercase tracking-wide">✓ Milestone Approved</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 font-black text-white text-xs sm:text-sm uppercase tracking-widest transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[2px] active:translate-y-[2px]"
            style={{ background: '#000080', border: '2px solid #000080', boxShadow: '3px 3px 0 #FF7F00' }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}