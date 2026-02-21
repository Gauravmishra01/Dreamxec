import type { Campaign } from '../types';

interface CampaignCardProps {
  campaign: Campaign;
  href: string;
}

export default function CampaignCard({ campaign, href }: CampaignCardProps) {
  const currentAmount = campaign.currentAmount ?? 0;
  const goalAmount = campaign.goalAmount ?? 0;
  const progressPercentage =
    goalAmount > 0 ? Math.min((currentAmount / goalAmount) * 100, 100) : 0;
  const rating = campaign.rating ?? 5;
  const totalMilestones = campaign.milestones?.length ?? 0;
  const isComplete = progressPercentage >= 100;

  return (
    <a
      href={href}
      style={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        overflow: 'visible',
        background: '#fff',
        border: '2.5px solid #111',
        boxShadow: '6px 6px 0px #111',
        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
        textDecoration: 'none',
        color: 'inherit',
        width: '100%',
        maxWidth: '340px',
        cursor: 'pointer',
        position: 'relative',
        fontFamily: "'DM Sans', system-ui, sans-serif",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translate(-3px, -3px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '9px 9px 0px #111';
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translate(0, 0)';
        (e.currentTarget as HTMLElement).style.boxShadow = '6px 6px 0px #111';
      }}
      onMouseDown={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translate(3px, 3px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '3px 3px 0px #111';
      }}
      onMouseUp={e => {
        (e.currentTarget as HTMLElement).style.transform = 'translate(-3px, -3px)';
        (e.currentTarget as HTMLElement).style.boxShadow = '9px 9px 0px #111';
      }}
    >
      {/* ── IMAGE ── */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '196px',
          overflow: 'hidden',
          borderRadius: '13px 13px 0 0',
          borderBottom: '2.5px solid #111',
          flexShrink: 0,
        }}
      >
        {campaign.imageUrl ? (
          <img
            src={campaign.imageUrl}
            alt={campaign.title}
            style={{ width: '100%', height: '100%', objectFit: 'fill', display: 'block' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background:
                'repeating-linear-gradient(45deg, #FF7F00, #FF7F00 10px, #FF4500 10px, #FF4500 20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '52px',
            }}
          >
            🎯
          </div>
        )}

        {/* Funding badge */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '-3px',
            background: isComplete ? '#6EE7B7' : '#FFE066',
            color: '#111',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.06em',
            textTransform: 'uppercase' as const,
            padding: '5px 12px',
            border: '2px solid #111',
            borderRadius: '4px',
            fontFamily: "'Sora', system-ui, sans-serif",
            boxShadow: '3px 3px 0 #111',
          }}
        >
          {progressPercentage.toFixed(0)}% Funded
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          padding: '18px 18px 16px',
          gap: '14px',
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
          <h3
            style={{
              margin: 0,
              fontSize: '17px',
              fontWeight: 800,
              lineHeight: 1.25,
              color: '#111',
              fontFamily: "'Sora', system-ui, sans-serif",
              letterSpacing: '-0.02em',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical' as const,
              overflow: 'hidden',
            }}
          >
            {campaign.title}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: '12px',
              color: '#555',
              fontWeight: 500,
              borderLeft: '3px solid #FF7F00',
              paddingLeft: '7px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {campaign.club?.college || 'DreamXec Academy'}
            &nbsp;•&nbsp;
            {campaign.club?.name || 'DreamXec Club'}
          </p>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            style={{
              width: '100%',
              height: '10px',
              background: '#F3F4F6',
              borderRadius: '3px',
              border: '2px solid #111',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${progressPercentage}%`,
                height: '100%',
                background: isComplete ? '#22c55e' : '#FF7F00',
                borderRadius: '1px',
                transition: 'width 0.6s ease',
              }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span
              style={{
                fontSize: '15px',
                fontWeight: 800,
                color: isComplete ? '#16a34a' : '#FF7F00',
                fontFamily: "'Sora', system-ui, sans-serif",
                letterSpacing: '-0.02em',
              }}
            >
              ₹{currentAmount.toLocaleString()}
            </span>
            <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 500 }}>
              of ₹{goalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Dashed divider */}
        <div
          style={{
            height: '2px',
            background:
              'repeating-linear-gradient(90deg, #11111126 0px, #11111126 6px, transparent 6px, transparent 10px)',
          }}
        />

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Star Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <svg
                  key={star}
                  viewBox="0 0 24 24"
                  fill={rating >= star ? '#FF7F00' : 'none'}
                  stroke="#FF7F00"
                  strokeWidth="2"
                  style={{ width: '14px', height: '14px' }}
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              ))}
            </div>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 700,
                color: '#111',
                fontFamily: "'Sora', sans-serif",
              }}
            >
              {rating.toFixed(1)}
            </span>
          </div>

          {/* Milestone chip */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: isComplete ? '#6EE7B7' : '#FFE066',
              border: '2px solid #111',
              borderRadius: '5px',
              padding: '4px 10px',
              boxShadow: '2px 2px 0 #111',
              fontFamily: "'Sora', sans-serif",
            }}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#111"
              strokeWidth="2.4"
              style={{ width: '13px', height: '13px' }}
            >
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
            </svg>
            <span style={{ fontSize: '11.5px', fontWeight: 700, color: '#111', letterSpacing: '0.02em' }}>
              {totalMilestones} Milestone{totalMilestones !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}