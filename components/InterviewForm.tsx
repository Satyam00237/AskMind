"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCurrentUser } from "@/lib/actions/auth.action";
import axios from "axios";
interface InterviewFormData {
  type: string;
  role: string;
  level: string;
  techstack: string[];
  amount: number;
}

const InterviewForm =  () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getUser = async () => {
      const user = await getCurrentUser();
      setUser(user);
    }
    getUser();
  }, []);
 
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [currentTech, setCurrentTech] = useState("");
  
  const [formData, setFormData] = useState<InterviewFormData>({
    type: "",
    role: "",
    level: "",
    techstack: [],
    amount: 5,
  });

  const interviewTypes = [
    { value: "technical", label: "Technical", icon: "💻" },
    { value: "behavioral", label: "Behavioral", icon: "🗣️" },
    { value: "system-design", label: "System Design", icon: "🏗️" },
    { value: "coding", label: "Coding", icon: "⚡" },
  ];

  const experienceLevels = [
    { value: "junior", label: "Junior (0-2 years)", icon: "🌱" },
    { value: "mid", label: "Mid-Level (3-5 years)", icon: "🌿" },
    { value: "senior", label: "Senior (6-10 years)", icon: "🌳" },
    { value: "lead", label: "Lead/Principal (10+ years)", icon: "🏆" },
  ];

  const popularTechStacks = [
    "JavaScript", "TypeScript", "React", "Next.js", "Node.js",
    "Python", "Django", "Flask", "FastAPI",
    "Java", "Spring Boot", "Kotlin",
    "Go", "Rust", "C++",
    "PostgreSQL", "MongoDB", "Redis",
    "AWS", "Azure", "GCP",
    "Docker", "Kubernetes", "CI/CD"
  ];

  console.log("Form data:", formData);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Add your API call here
      await axios.post("/api/vapi/generate", {...formData, userid: user?.id});
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Navigate to interview or success page
      router.push("/interview/generated");
    } catch (error) {
      console.error("Error generating interview:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTechStack = () => {
    if (currentTech.trim() && !formData.techstack.includes(currentTech.trim())) {
      setFormData({
        ...formData,
        techstack: [...formData.techstack, currentTech.trim()]
      });
      setCurrentTech("");
    }
  };

  const removeTechStack = (tech: string) => {
    setFormData({
      ...formData,
      techstack: formData.techstack.filter(t => t !== tech)
    });
  };

  const addPopularTech = (tech: string) => {
    if (!formData.techstack.includes(tech)) {
      setFormData({
        ...formData,
        techstack: [...formData.techstack, tech]
      });
    }
  };

  const isFormValid = formData.type && formData.role && formData.level && formData.techstack.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full mb-4">
            <span className="text-2xl">🎯</span>
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Customize Your Interview
            </span>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Generate Your Interview
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Configure the perfect interview session tailored to your needs
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Interview Type */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <Label htmlFor="type" className="text-base font-semibold text-gray-900 dark:text-white mb-3 block">
              Interview Type
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {interviewTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, type: type.value })}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    formData.type === type.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="text-3xl mb-2">{type.icon}</div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {type.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Role */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <Label htmlFor="role" className="text-base font-semibold text-gray-900 dark:text-white mb-3 block">
              Role / Position
            </Label>
            <Input
              id="role"
              type="text"
              placeholder="e.g., Full Stack Developer, Backend Engineer, DevOps Engineer"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="h-12 text-base"
              required
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Enter the job title or position you're interviewing for
            </p>
          </div>

          {/* Experience Level */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <Label htmlFor="level" className="text-base font-semibold text-gray-900 dark:text-white mb-3 block">
              Experience Level
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {experienceLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, level: level.value })}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    formData.level === level.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{level.icon}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {level.label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <Label htmlFor="techstack" className="text-base font-semibold text-gray-900 dark:text-white mb-3 block">
              Tech Stack
            </Label>
            
            {/* Add Custom Tech */}
            <div className="flex gap-2 mb-4">
              <Input
                id="techstack"
                type="text"
                placeholder="Add a technology or skill"
                value={currentTech}
                onChange={(e) => setCurrentTech(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTechStack())}
                className="flex-1 h-12"
              />
              <Button
                type="button"
                onClick={addTechStack}
                variant="outline"
                className="h-12 px-6"
              >
                Add
              </Button>
            </div>

            {/* Selected Technologies */}
            {formData.techstack.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                {formData.techstack.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
                  >
                    {tech}
                    <button
                      type="button"
                      onClick={() => removeTechStack(tech)}
                      className="hover:text-blue-900 dark:hover:text-blue-100"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Popular Tech Stacks */}
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Popular Technologies:
              </p>
              <div className="flex flex-wrap gap-2">
                {popularTechStacks.map((tech) => (
                  <button
                    key={tech}
                    type="button"
                    onClick={() => addPopularTech(tech)}
                    disabled={formData.techstack.includes(tech)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      formData.techstack.includes(tech)
                        ? "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Number of Questions */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <Label htmlFor="amount" className="text-base font-semibold text-gray-900 dark:text-white mb-3 block">
              Number of Questions
            </Label>
            <div className="flex items-center gap-4">
              <Input
                id="amount"
                type="range"
                min="3"
                max="15"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) })}
                className="flex-1"
              />
              <div className="flex items-center justify-center w-16 h-12 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-bold text-lg">
                {formData.amount}
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Choose between 3 to 15 questions for your interview session
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1 h-14 text-base"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={!isFormValid || isLoading}
              className="flex-1 h-14 text-base bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="mr-2">⏳</span>
                  Generating Interview...
                </>
              ) : (
                <>
                  <span className="mr-2">🚀</span>
                  Generate Interview
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Form Summary */}
        {isFormValid && (
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
              Interview Summary:
            </h3>
            <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
              <p>• <strong>Type:</strong> {interviewTypes.find(t => t.value === formData.type)?.label}</p>
              <p>• <strong>Role:</strong> {formData.role}</p>
              <p>• <strong>Level:</strong> {experienceLevels.find(l => l.value === formData.level)?.label}</p>
              <p>• <strong>Tech Stack:</strong> {formData.techstack.join(", ")}</p>
              <p>• <strong>Questions:</strong> {formData.amount}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewForm;