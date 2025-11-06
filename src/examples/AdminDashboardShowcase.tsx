import { useState } from 'react';
import AdminDashboard from '../components/AdminDashboard';
import type { Campaign } from '../types';

// Mock campaign data
const mockPendingCampaigns: Campaign[] = [
  {
    id: '1',
    title: 'Smart Campus IoT Project',
    description: 'Developing an IoT-based smart campus solution to monitor energy usage, optimize lighting, and improve sustainability across our college campus.',
    goalAmount: 50000,
    currentAmount: 0,
    clubName: 'Tech Innovation Club',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    status: 'pending',
    createdAt: new Date('2024-11-01'),
    deadline: new Date('2024-12-31'),
  },
  {
    id: '2',
    title: 'AI-Powered Study Assistant',
    description: 'Building an AI chatbot that helps students with personalized study plans, doubt clarification, and exam preparation using machine learning algorithms.',
    goalAmount: 75000,
    currentAmount: 0,
    clubName: 'AI & ML Society',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
    status: 'pending',
    createdAt: new Date('2024-11-02'),
    deadline: new Date('2025-01-15'),
  },
  {
    id: '3',
    title: 'Eco-Friendly Water Purification System',
    description: 'Designing a low-cost, sustainable water purification system using natural filtration methods for rural communities in need of clean drinking water.',
    goalAmount: 45000,
    currentAmount: 0,
    clubName: 'Environmental Engineering Club',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80',
    status: 'pending',
    createdAt: new Date('2024-11-03'),
    deadline: new Date('2025-02-28'),
  },
];

const mockAllCampaigns: Campaign[] = [
  ...mockPendingCampaigns,
  {
    id: '4',
    title: 'Drone Delivery System for Medical Supplies',
    description: 'Creating an autonomous drone network to deliver essential medical supplies to remote areas during emergencies.',
    goalAmount: 100000,
    currentAmount: 75000,
    clubName: 'Robotics & Automation Club',
    imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80',
    status: 'approved',
    createdAt: new Date('2024-10-15'),
    deadline: new Date('2025-03-31'),
  },
  {
    id: '5',
    title: 'Virtual Reality Lab Setup',
    description: 'Establishing a VR lab for immersive learning experiences in engineering, architecture, and medical education.',
    goalAmount: 150000,
    currentAmount: 120000,
    clubName: 'Computer Science Society',
    imageUrl: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800&q=80',
    status: 'approved',
    createdAt: new Date('2024-10-20'),
    deadline: new Date('2025-04-30'),
  },
  {
    id: '6',
    title: '3D Printing Workshop',
    description: 'Setting up a 3D printing facility for rapid prototyping and innovation projects by students.',
    goalAmount: 80000,
    currentAmount: 90000,
    clubName: 'Makers Lab',
    imageUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=800&q=80',
    status: 'approved',
    createdAt: new Date('2024-09-10'),
    deadline: new Date('2024-12-15'),
  },
  {
    id: '7',
    title: 'Solar Panel Installation',
    description: 'Installing solar panels on campus buildings to reduce carbon footprint and electricity costs.',
    goalAmount: 200000,
    currentAmount: 0,
    clubName: 'Green Energy Initiative',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&q=80',
    status: 'rejected',
    createdAt: new Date('2024-10-25'),
    deadline: new Date('2025-06-30'),
  },
  {
    id: '8',
    title: 'Mobile App for Campus Navigation',
    description: 'Developing an AR-based mobile app to help new students navigate the campus easily.',
    goalAmount: 30000,
    currentAmount: 35000,
    clubName: 'App Development Club',
    imageUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80',
    status: 'approved',
    createdAt: new Date('2024-09-05'),
    deadline: new Date('2024-11-30'),
  },
];

export default function AdminDashboardShowcase() {
  const [pendingCampaigns, setPendingCampaigns] = useState<Campaign[]>(mockPendingCampaigns);
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>(mockAllCampaigns);

  const handleApprove = (id: string) => {
    console.log('✅ Approving campaign:', id);
    
    // Update the campaign status
    const updatedPending = pendingCampaigns.filter(c => c.id !== id);
    const approvedCampaign = pendingCampaigns.find(c => c.id === id);
    
    if (approvedCampaign) {
      const updated = {
        ...approvedCampaign,
        status: 'approved' as const,
      };
      
      const updatedAll = allCampaigns.map(c => 
        c.id === id ? updated : c
      );
      
      setPendingCampaigns(updatedPending);
      setAllCampaigns(updatedAll);
      
      // Temporarily removed alert to test - you can add a toast notification instead
      console.log(`✅ Campaign "${approvedCampaign.title}" has been approved!`);
    }
  };

  const handleReject = (id: string, reason: string) => {
    console.log('❌ Rejecting campaign:', id);
    console.log('📝 Rejection reason:', reason);
    
    // Update the campaign status
    const updatedPending = pendingCampaigns.filter(c => c.id !== id);
    const rejectedCampaign = pendingCampaigns.find(c => c.id === id);
    
    if (rejectedCampaign) {
      const updated = {
        ...rejectedCampaign,
        status: 'rejected' as const,
      };
      
      const updatedAll = allCampaigns.map(c => 
        c.id === id ? updated : c
      );
      
      setPendingCampaigns(updatedPending);
      setAllCampaigns(updatedAll);
      
      // Temporarily removed alert to test - you can add a toast notification instead
      console.log(`✅ Campaign "${rejectedCampaign.title}" has been rejected. Reason: ${reason}`);
    }
  };

  return (
    <AdminDashboard
      pendingCampaigns={pendingCampaigns}
      allCampaigns={allCampaigns}
      onApprove={handleApprove}
      onReject={handleReject}
    />
  );
}
