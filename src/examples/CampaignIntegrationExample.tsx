// Example: How to load campaigns from the backend API

import { useState, useEffect } from 'react';
import {
  getPublicUserProjects,
  getMyUserProjects,
  createUserProject,
  updateUserProject,
  deleteUserProject,
} from '../services/userProjectService';
import { mapUserProjectToCampaign } from '../services/mappers';
import type { Campaign } from '../types';

// Example hook to manage campaigns
export const useCampaigns = (userId?: string) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [myCampaigns, setMyCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load all public campaigns
  const loadPublicCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getPublicUserProjects();
      if (response.data?.userProjects) {
        const mappedCampaigns = response.data.userProjects.map(mapUserProjectToCampaign);
        setCampaigns(mappedCampaigns);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load campaigns';
      setError(errorMessage);
      console.error('Error loading campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load my campaigns (requires authentication)
  const loadMyCampaigns = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getMyUserProjects();
      if (response.data?.userProjects) {
        const mappedCampaigns = response.data.userProjects.map(mapUserProjectToCampaign);
        setMyCampaigns(mappedCampaigns);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load your campaigns';
      setError(errorMessage);
      console.error('Error loading my campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create a new campaign
  const createCampaign = async (campaignData: {
    title: string;
    description: string;
    clubName: string;
    goalAmount: number;
    imageUrl?: string;
  }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await createUserProject({
        title: campaignData.title,
        description: campaignData.description,
        companyName: campaignData.clubName,
        skillsRequired: [], // Add if needed
        timeline: '3 months', // Default or calculate from dates
        goalAmount: campaignData.goalAmount,
        imageUrl: campaignData.imageUrl,
      });

      if (response.data?.userProject) {
        const newCampaign = mapUserProjectToCampaign(response.data.userProject);
        setMyCampaigns((prev) => [...prev, newCampaign]);
        return newCampaign;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create campaign';
      setError(errorMessage);
      console.error('Error creating campaign:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update a campaign
  const updateCampaign = async (
    campaignId: string,
    updates: {
      title?: string;
      description?: string;
      clubName?: string;
      goalAmount?: number;
      imageUrl?: string;
    }
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await updateUserProject(campaignId, {
        title: updates.title,
        description: updates.description,
        companyName: updates.clubName,
        goalAmount: updates.goalAmount,
        imageUrl: updates.imageUrl,
      });

      if (response.data?.userProject) {
        const updatedCampaign = mapUserProjectToCampaign(response.data.userProject);
        setMyCampaigns((prev) =>
          prev.map((c) => (c.id === campaignId ? updatedCampaign : c))
        );
        return updatedCampaign;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update campaign';
      setError(errorMessage);
      console.error('Error updating campaign:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete a campaign
  const removeCampaign = async (campaignId: string) => {
    setLoading(true);
    setError(null);
    try {
      await deleteUserProject(campaignId);
      setMyCampaigns((prev) => prev.filter((c) => c.id !== campaignId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete campaign';
      setError(errorMessage);
      console.error('Error deleting campaign:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Load campaigns on mount
  useEffect(() => {
    loadPublicCampaigns();
    
    // Load user's campaigns if authenticated
    if (userId) {
      loadMyCampaigns();
    }
  }, [userId]);

  return {
    campaigns,
    myCampaigns,
    loading,
    error,
    loadPublicCampaigns,
    loadMyCampaigns,
    createCampaign,
    updateCampaign,
    removeCampaign,
  };
};

// Example usage in a component:
/*
import { useCampaigns } from './hooks/useCampaigns';

function StudentDashboard({ user }) {
  const {
    myCampaigns,
    loading,
    error,
    createCampaign,
    updateCampaign,
    removeCampaign
  } = useCampaigns(user.id);

  const handleCreateCampaign = async (data) => {
    try {
      await createCampaign(data);
      alert('Campaign created successfully!');
    } catch (error) {
      alert('Failed to create campaign');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>My Campaigns</h1>
      {myCampaigns.map(campaign => (
        <CampaignCard
          key={campaign.id}
          campaign={campaign}
          onUpdate={(updates) => updateCampaign(campaign.id, updates)}
          onDelete={() => removeCampaign(campaign.id)}
        />
      ))}
      <button onClick={() => handleCreateCampaign({
        title: 'New Campaign',
        description: 'Description...',
        clubName: 'My Club',
        goalAmount: 5000
      })}>
        Create Campaign
      </button>
    </div>
  );
}
*/
