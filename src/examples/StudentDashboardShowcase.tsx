import { useState } from 'react';
import StudentDashboard from '../components/StudentDashboard';
import type { Campaign } from '../types';

/**
 * Student Dashboard Showcase
 * 
 * This is a demo page showing the Student Dashboard with sample data.
 * Use this to preview the dashboard in your browser.
 */
export function StudentDashboardShowcase() {
  // Sample campaign data with various statuses
  const [campaigns] = useState<Campaign[]>([
    {
      id: '1',
      title: 'Tech Club Annual Hackathon',
      clubName: 'Code Innovation Hub',
      description: 'Organizing a 48-hour hackathon with prizes, mentorship, and workshops for 200+ participants.',
      goalAmount: 100000,
      currentAmount: 75000,
      status: 'approved',
      createdAt: new Date('2024-01-15'),
      deadline: new Date('2024-12-31'),
      category: 'Technology',
    },
    {
      id: '2',
      title: 'Clean Campus Green Initiative',
      clubName: 'Environmental Warriors',
      description: 'Tree plantation, waste segregation bins, and sustainability awareness workshops across campus.',
      goalAmount: 50000,
      currentAmount: 48500,
      status: 'approved',
      createdAt: new Date('2024-02-01'),
      deadline: new Date('2024-11-30'),
      category: 'Environment',
    },
    {
      id: '3',
      title: 'Inter-College Sports Tournament',
      clubName: 'Athletics Association',
      description: 'Funding for equipment, jerseys, and organizing state-level sports championships.',
      goalAmount: 75000,
      currentAmount: 25000,
      status: 'approved',
      createdAt: new Date('2024-02-15'),
      deadline: new Date('2024-10-15'),
      category: 'Sports',
    },
    {
      id: '4',
      title: 'Cultural Festival 2024',
      clubName: 'Arts & Culture Society',
      description: 'Annual cultural fest with music, dance, drama performances and art exhibitions.',
      goalAmount: 120000,
      currentAmount: 0,
      status: 'pending',
      createdAt: new Date('2024-03-01'),
      deadline: new Date('2024-09-30'),
      category: 'Arts',
    },
    {
      id: '5',
      title: 'Robotics Lab Setup',
      clubName: 'Robotics Club',
      description: 'Setting up a robotics laboratory with Arduino kits, 3D printers, and tools.',
      goalAmount: 200000,
      currentAmount: 15000,
      status: 'approved',
      createdAt: new Date('2024-03-10'),
      deadline: new Date('2025-03-31'),
      category: 'Technology',
    },
    {
      id: '6',
      title: 'Community Outreach Program',
      clubName: 'Social Service Club',
      description: 'Teaching underprivileged children and organizing health camps in nearby villages.',
      goalAmount: 30000,
      currentAmount: 0,
      status: 'pending',
      createdAt: new Date('2024-03-20'),
      deadline: new Date('2024-08-31'),
      category: 'Social',
    },
  ]);

  const handleCreateCampaign = () => {
    alert('Create Campaign clicked! This would navigate to the campaign creation form.');
  };

  const handleViewCampaign = (id: string) => {
    const campaign = campaigns.find(c => c.id === id);
    if (campaign) {
      alert(`View Campaign: ${campaign.title}\nClub: ${campaign.clubName}\nStatus: ${campaign.status}`);
    }
  };

  return (
    <div className="min-h-screen">
      <StudentDashboard
        studentName="Puran Pal Singh"
        campaigns={campaigns}
        onCreateCampaign={handleCreateCampaign}
        onViewCampaign={handleViewCampaign}
      />
    </div>
  );
}

export default StudentDashboardShowcase;
