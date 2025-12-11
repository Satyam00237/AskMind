import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/actions/auth.action";

const Feedback = async ({ params }: RouteParams) => {
  const { id } = await params;
  const user = await getCurrentUser();

  const interview = await getInterviewById(id);
  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user?.id!,
  });

  // Helper function to get score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  // Helper function to get score background
  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
    if (score >= 60) return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
    return "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800";
  };

  const totalScore = feedback?.totalScore || 0;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full">
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
              Interview Complete
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
            <span className="capitalize">{interview.role}</span> Interview Feedback
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Image src="/calendar.svg" width={18} height={18} alt="calendar" className="opacity-70" />
              <span>
                {feedback?.createdAt
                  ? dayjs(feedback.createdAt).format("MMM D, YYYY h:mm A")
                  : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Score Card - Hero */}
        <div className={`relative overflow-hidden rounded-2xl border-2 p-8 ${getScoreBg(totalScore)}`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-3xl" />
          
          <div className="relative z-10 text-center space-y-4">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-white dark:bg-gray-800 shadow-2xl">
              <div className="text-center">
                <div className={`text-5xl font-bold ${getScoreColor(totalScore)}`}>
                  {totalScore}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  out of 100
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Overall Performance
              </h2>
              <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
                {totalScore >= 80 && "Excellent work! You demonstrated strong skills and knowledge."}
                {totalScore >= 60 && totalScore < 80 && "Good performance! There's room for improvement in some areas."}
                {totalScore < 60 && "Keep practicing! Focus on the areas for improvement below."}
              </p>
            </div>
          </div>
        </div>

        {/* Final Assessment */}
        {feedback?.finalAssessment && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <span className="text-xl">💬</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Interviewer's Summary
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {feedback.finalAssessment}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Performance Breakdown
          </h2>
          
          <div className="grid gap-4">
            {feedback?.categoryScores?.map((category, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-sm font-semibold text-gray-600 dark:text-gray-300">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {category.name}
                      </h3>
                    </div>
                  </div>
                  
                  <div className={`flex-shrink-0 px-4 py-2 rounded-full font-bold ${getScoreColor(category.score)} bg-gray-100 dark:bg-gray-700`}>
                    {category.score}/100
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-3">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      category.score >= 80 ? "bg-green-500" :
                      category.score >= 60 ? "bg-yellow-500" : "bg-red-500"
                    }`}
                    style={{ width: `${category.score}%` }}
                  />
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {category.comment}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout for Strengths and Areas */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Strengths
              </h3>
            </div>
            
            <ul className="space-y-3">
              {feedback?.strengths?.map((strength, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-200 dark:bg-green-800 flex items-center justify-center text-green-700 dark:text-green-300 text-xs font-bold mt-0.5">
                    ✓
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {strength}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Areas for Improvement */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl border border-orange-200 dark:border-orange-800 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Areas for Improvement
              </h3>
            </div>
            
            <ul className="space-y-3">
              {feedback?.areasForImprovement?.map((area, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-200 dark:bg-orange-800 flex items-center justify-center text-orange-700 dark:text-orange-300 text-xs font-bold mt-0.5">
                    →
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {area}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button 
            asChild 
            variant="outline" 
            size="lg"
            className="flex-1 h-14 text-base font-semibold"
          >
            <Link href="/">
              <span className="mr-2">←</span>
              Back to Dashboard
            </Link>
          </Button>

          <Button 
            asChild 
            size="lg"
            className="flex-1 h-14 text-base font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <Link href={`/interview/${id}`}>
              <span className="mr-2">🔄</span>
              Retake Interview
            </Link>
          </Button>
        </div>

        {/* Motivational Footer */}
        <div className="text-center py-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Keep practicing to improve your skills! Every interview is a learning opportunity. 💪
          </p>
        </div>
      </div>
    </div>
  );
};

export default Feedback;