import { useState } from 'react';
import { StarDecoration } from './icons/StarDecoration';

interface CreateProjectProps {
  onBack: () => void;
  onSubmit: (data: {
    title: string;
    companyName: string;
    description: string;
    skillsRequired: string[];
    startDate: Date;
    endDate: Date;
  }) => Promise<void>;
}

export default function CreateProject({ onBack, onSubmit }: CreateProjectProps) {
  const [formData, setFormData] = useState({
    title: '',
    companyName: '',
    description: '',
    skillsInput: '',
    startDate: '',
    endDate: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

    const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim() || formData.title.length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }

    if (!formData.description.trim() || formData.description.length < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }

    if (!formData.skillsInput.trim()) {
      newErrors.skillsInput = 'At least one skill is required';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    } else if (formData.startDate && new Date(formData.endDate) <= new Date(formData.startDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Parse skills from comma-separated string
      const skills = formData.skillsInput
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      await onSubmit({
        title: formData.title,
        companyName: formData.companyName,
        description: formData.description,
        skillsRequired: skills,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate),
      });

      // Reset form on success
      setFormData({
        title: '',
        companyName: '',
        description: '',
        skillsInput: '',
        startDate: '',
        endDate: '',
      });
    } catch (error) {
      console.error('Failed to create project:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Failed to create project: ${errorMessage}\n\nPlease check the console for more details.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-dreamxec-cream relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <StarDecoration className="absolute top-20 left-10 w-12 h-12 text-dreamxec-saffron opacity-20 animate-spin-slow" />
        <StarDecoration className="absolute top-40 right-20 w-16 h-16 text-dreamxec-green opacity-15 animate-bounce-slow" />
        <StarDecoration className="absolute bottom-32 left-1/4 w-10 h-10 text-dreamxec-orange opacity-25" />
        
        <img
          src="https://c.animaapp.com/mhd6hm18SGcCN3/assets/image-28.svg"
          alt="Decorative"
          className="absolute top-10 right-10 w-24 h-24 opacity-10 animate-float"
        />
        <img
          src="https://c.animaapp.com/mhd6hm18SGcCN3/assets/image-30.svg"
          alt="Decorative"
          className="absolute bottom-10 left-10 w-32 h-32 opacity-10 animate-float-delayed"
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Back button */}
        <button
          onClick={onBack}
          className="mb-8 flex items-center gap-2 text-dreamxec-navy font-bold font-sans text-lg hover:text-dreamxec-orange transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-dreamxec-navy font-display mb-4">
            Create New Project 🚀
          </h1>
          <p className="text-xl text-dreamxec-navy font-sans opacity-80">
            Post your project and connect with talented students
          </p>
        </div>

        {/* Form */}
        <div className="card-pastel-offwhite rounded-2xl border-5 border-dreamxec-navy p-8 md:p-12 shadow-pastel-card">
          <div className="card-tricolor-tag"></div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Title */}
            <div>
              <label htmlFor="title" className="block text-dreamxec-navy font-bold font-sans text-lg mb-2">
                Project Title * <span className="text-sm font-normal opacity-70">(min. 5 characters)</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Mobile App Development for E-commerce"
                minLength={5}
                className={`w-full px-4 py-3 border-4 ${
                  errors.title ? 'border-red-500' : 'border-dreamxec-navy'
                } rounded-xl font-sans text-dreamxec-navy text-lg focus:outline-none focus:ring-4 focus:ring-dreamxec-orange/30 transition-all`}
              />
              {errors.title && (
                <p className="mt-2 text-red-500 font-sans text-sm">{errors.title}</p>
              )}
            </div>

            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-dreamxec-navy font-bold font-sans text-lg mb-2">
                Company Name *
              </label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g., Tech Solutions Inc."
                className={`w-full px-4 py-3 border-4 ${
                  errors.companyName ? 'border-red-500' : 'border-dreamxec-navy'
                } rounded-xl font-sans text-dreamxec-navy text-lg focus:outline-none focus:ring-4 focus:ring-dreamxec-orange/30 transition-all`}
              />
              {errors.companyName && (
                <p className="mt-2 text-red-500 font-sans text-sm">{errors.companyName}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-dreamxec-navy font-bold font-sans text-lg mb-2">
                Project Description * <span className="text-sm font-normal opacity-70">(min. 20 characters)</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your project, goals, and what you're looking for in collaborators..."
                rows={6}
                minLength={20}
                className={`w-full px-4 py-3 border-4 ${
                  errors.description ? 'border-red-500' : 'border-dreamxec-navy'
                } rounded-xl font-sans text-dreamxec-navy text-lg focus:outline-none focus:ring-4 focus:ring-dreamxec-orange/30 transition-all resize-none`}
              />
              {errors.description && (
                <p className="mt-2 text-red-500 font-sans text-sm">{errors.description}</p>
              )}
              <p className="mt-1 text-sm text-dreamxec-navy opacity-60 font-sans">
                {formData.description.length}/20 characters minimum
              </p>
            </div>

            {/* Skills Required */}
            <div>
              <label htmlFor="skillsInput" className="block text-dreamxec-navy font-bold font-sans text-lg mb-2">
                Skills Required *
              </label>
              <input
                type="text"
                id="skillsInput"
                name="skillsInput"
                value={formData.skillsInput}
                onChange={handleChange}
                placeholder="e.g., React, Node.js, MongoDB, UI/UX Design (comma-separated)"
                className={`w-full px-4 py-3 border-4 ${
                  errors.skillsInput ? 'border-red-500' : 'border-dreamxec-navy'
                } rounded-xl font-sans text-dreamxec-navy text-lg focus:outline-none focus:ring-4 focus:ring-dreamxec-orange/30 transition-all`}
              />
              <p className="mt-2 text-dreamxec-navy/60 font-sans text-sm">
                Separate skills with commas
              </p>
              {errors.skillsInput && (
                <p className="mt-2 text-red-500 font-sans text-sm">{errors.skillsInput}</p>
              )}
            </div>

            {/* Timeline */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Start Date */}
              <div>
                <label htmlFor="startDate" className="block text-dreamxec-navy font-bold font-sans text-lg mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-4 ${
                    errors.startDate ? 'border-red-500' : 'border-dreamxec-navy'
                  } rounded-xl font-sans text-dreamxec-navy text-lg focus:outline-none focus:ring-4 focus:ring-dreamxec-orange/30 transition-all`}
                />
                {errors.startDate && (
                  <p className="mt-2 text-red-500 font-sans text-sm">{errors.startDate}</p>
                )}
              </div>

              {/* End Date */}
              <div>
                <label htmlFor="endDate" className="block text-dreamxec-navy font-bold font-sans text-lg mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-4 ${
                    errors.endDate ? 'border-red-500' : 'border-dreamxec-navy'
                  } rounded-xl font-sans text-dreamxec-navy text-lg focus:outline-none focus:ring-4 focus:ring-dreamxec-orange/30 transition-all`}
                />
                {errors.endDate && (
                  <p className="mt-2 text-red-500 font-sans text-sm">{errors.endDate}</p>
                )}
              </div>
            </div>

            {/* Submit buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 px-6 py-4 bg-dreamxec-cream border-4 border-dreamxec-navy rounded-xl font-bold text-dreamxec-navy text-lg font-display hover:bg-dreamxec-beige transition-all shadow-pastel-card"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-4 bg-dreamxec-green border-4 border-dreamxec-navy rounded-xl font-bold text-white text-lg font-display hover:bg-dreamxec-orange hover:scale-105 transition-all shadow-pastel-saffron disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? 'Creating Project...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
