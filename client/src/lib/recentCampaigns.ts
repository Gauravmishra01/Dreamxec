import type { Campaign } from '../types';

const KEY = 'recent_campaigns';
const MAX_ITEMS = 6;

export function addRecentCampaign(campaign: Campaign) {
  if (!campaign?.id) return;

  const existing: Campaign[] = JSON.parse(
    localStorage.getItem(KEY) || '[]'
  );

  const updated = [
    {
      id: campaign.id,
      title: campaign.title,
      imageUrl: campaign.imageUrl,
      category: campaign.category,
      currentAmount: campaign.currentAmount,
      goalAmount: campaign.goalAmount,
    },
    ...existing.filter(c => c.id !== campaign.id),
  ].slice(0, MAX_ITEMS);

  localStorage.setItem(KEY, JSON.stringify(updated));
}

export function getRecentCampaigns(): Campaign[] {
  return JSON.parse(localStorage.getItem(KEY) || '[]');
}
