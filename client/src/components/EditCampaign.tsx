import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CreateCampaign from './CreateCampaign';
import { getUserProject, updateUserProject, UserProject } from '../services/userProjectService';
import toast from 'react-hot-toast';

export default function EditCampaign() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [initialData, setInitialData] = useState<UserProject | null>(null);

    useEffect(() => {
        const fetchCampaign = async () => {
            if (!id) return;
            try {
                const res = await getUserProject(id);
                const project = res.data.userProject;

                // Only allow editing if Pending or Rejected
                if (!['PENDING', 'REJECTED'].includes(project.status)) {
                    toast.error("Cannot edit approved campaigns.");
                    navigate('/dashboard');
                    return;
                }

                // Check reapproval count
                if (project.status === 'REJECTED' && (project.reapprovalCount || 0) >= 3) {
                    toast.error("Maximum reapproval attempts reached.");
                    navigate('/dashboard');
                    return;
                }

                setInitialData(project);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load campaign.");
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchCampaign();
    }, [id, navigate]);

    const handleUpdate = async (data: any) => {
        if (!id) return;
        try {
            const payload = {
                title: data.title,
                description: data.description,
                goalAmount: data.goalAmount,
                clubId: data.clubId,
                presentationDeckUrl: data.presentationDeckUrl,
                campaignType: data.campaignType,
                youtubeUrl: data.youtubeUrl,
                faqs: data.faqs,
                teamMembers: data.teamMembers,
                milestones: data.milestones
            };

            await updateUserProject(id, payload);
            toast.success("Campaign updated successfully!");
            navigate('/dashboard');
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to update campaign.");
        }
    };

    if (loading) return <div className="p-10 text-center text-blue-900 font-semibold">Loading campaign...</div>;
    if (!initialData) return <div className="p-10 text-center text-red-600">Campaign not found</div>;

    return (
        <CreateCampaign
            initialData={initialData}
            onBack={() => navigate('/dashboard')}
            onSubmit={handleUpdate}
        />
    );
}
