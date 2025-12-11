import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getInterviewsByUserId,
  getLatestInterviews,
} from "@/lib/actions/general.action";

// Loading skeleton component
function InterviewSkeleton() {
  return (
    <div className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-lg h-48" />
  );
}

async function Home() {
  const user = await getCurrentUser();

  const [userInterviews, allInterview] = await Promise.all([
    getInterviewsByUserId(user?.id!),
    getLatestInterviews({ userId: user?.id! }),
  ]);

  const hasPastInterviews = userInterviews?.length! > 0;
  const hasUpcomingInterviews = allInterview?.length! > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b  ">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 md:p-12 shadow-2xl border border-gray-700/50">
        {/* Animated grid pattern */}
        <div className="absolute inset-0 bg-grid-white/[0.02] [mask-image:linear-gradient(0deg,transparent,black)]" />

        {/* Subtle glow effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="flex flex-col gap-6 max-w-2xl">
            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 bg-gray-800/80 backdrop-blur-sm px-4 py-2 rounded-full w-fit border border-gray-700/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-gray-200">AI-Powered Practice</span>
            </div>

            {/* Heading with gradient text */}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
                Get Interview-Ready with Real-Time Feedback
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300">
              Practice with AI interviewers, get instant feedback, and land your dream job with confidence
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 mt-2">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 font-semibold border-0"
              >
                <Link href="/generate-interview">
                  <span className="mr-2">🚀</span>
                  Start Your Interview
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="bg-gray-800/50 border-2 border-gray-600 text-gray-200 hover:bg-gray-700/50 hover:border-gray-500 backdrop-blur-sm"
              >
                <Link href="/learn-more">Learn More</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-4 pt-6 border-t border-gray-700/50">
              <div>
                <div className="text-3xl font-bold text-white">{userInterviews?.length || 0}</div>
                <div className="text-sm text-gray-400">Interviews Taken</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white">{allInterview?.length || 0}</div>
                <div className="text-sm text-gray-400">Available Now</div>
              </div>
            </div>
          </div>

          {/* Robot Image with effects */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-indigo-500/20 rounded-full blur-3xl opacity-50 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-bl from-purple-500/10 to-pink-500/10 rounded-full blur-2xl" />
            <Image
              src="/robot.png"
              alt="AI Interview Assistant"
              width={450}
              height={450}
              className="relative z-10 max-sm:w-64 drop-shadow-2xl transform hover:scale-105 transition-transform duration-300"
              priority
            />
          </div>
        </div>
      </section>

      {/* Your Interviews Section */}
      <section className="mt-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Your Interviews
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Review your past performance and track progress
            </p>
          </div>

          {hasPastInterviews && (
            <Button variant="outline" asChild>
              <Link href="/interviews/history">View All</Link>
            </Button>
          )}
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <InterviewSkeleton key={i} />)}
          </div>
        }>
          {hasPastInterviews ? (
            <div className="flex justify-around items-center flex-wrap">
              {userInterviews?.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  userId={user?.id}
                  interviewId={interview.id}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No interviews yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
                Start your first interview to practice and get personalized feedback from our AI interviewer
              </p>
              <Button asChild>
                <Link href="/interview">Take Your First Interview</Link>
              </Button>
            </div>
          )}
        </Suspense>
      </section>

      {/* Available Interviews Section */}
      {/* <section className="mt-16 mb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Available Interviews
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Choose from curated interview scenarios
            </p>
          </div>
          
          {hasUpcomingInterviews && (
            <Button variant="outline" asChild>
              <Link href="/interviews/browse">Browse All</Link>
            </Button>
          )}
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <InterviewSkeleton key={i} />)}
          </div>
        }>
          {hasUpcomingInterviews ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allInterview?.map((interview) => (
                <InterviewCard
                  key={interview.id}
                  userId={user?.id}
                  interviewId={interview.id}
                  role={interview.role}
                  type={interview.type}
                  techstack={interview.techstack}
                  createdAt={interview.createdAt}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-4 bg-gray-50 dark:bg-gray-900 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No interviews available
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
                Check back soon for new interview opportunities
              </p>
              <Button asChild variant="outline">
                <Link href="/interview">Create Custom Interview</Link>
              </Button>
            </div>
          )}
        </Suspense>
      </section> */}
    </div>
  );
}

export default Home;