import StudentDashboard from '../components/StudentDashboard';
import type { Campaign } from '../types';

// Example usage of the Student Dashboard component

export function StudentDashboardExample() {
  // Sample campaign data
  const sampleCampaigns: Campaign[] = [
    {
      id: '1',
      title: 'Tech Club Workshop Series',
      clubName: 'Innovation Hub',
      description: 'Funding for monthly coding workshops and hackathons',
      goalAmount: 50000,
      currentAmount: 35000,
      status: 'approved',
      createdAt: new Date('2024-01-15'),
      deadline: new Date('2024-06-30'),
      category: 'Education',
    },
    {
      id: '2',
      title: 'Environmental Awareness Campaign',
      clubName: 'Green Earth Society',
      description: 'Tree plantation drive and sustainability workshops',
      goalAmount: 30000,
      currentAmount: 15000,
      status: 'approved',
      createdAt: new Date('2024-02-01'),
      deadline: new Date('2024-05-15'),
      category: 'Environment',
    },
    {
      id: '3',
      title: 'Sports Equipment Fund',
      clubName: 'Athletics Club',
      description: 'New equipment for inter-college tournaments',
      goalAmount: 75000,
      currentAmount: 0,
      status: 'pending',
      createdAt: new Date('2024-03-10'),
      deadline: new Date('2024-08-01'),
      category: 'Sports',
    },
  ];

  const handleCreateCampaign = () => {
    console.log('Navigate to create campaign form');
    // Add your navigation logic here
    // e.g., navigate('/create-campaign');
  };

  const handleViewCampaign = (id: string) => {
    console.log('View campaign:', id);
    // Add your navigation logic here
    // e.g., navigate(`/campaign/${id}`);
  };

  return (
    <StudentDashboard
      studentName="Puran Pal Singh"
      campaigns={sampleCampaigns}
      onCreateCampaign={handleCreateCampaign}
      onViewCampaign={handleViewCampaign}
    />
  );
}

export default StudentDashboardExample;
