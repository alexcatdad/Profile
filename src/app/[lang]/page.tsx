import { Suspense } from 'react';
import { getDictionary } from '@/app/dictionaries';
import { AccessGate } from '@/components/AccessGate';
import { ProfilePage } from '@/components/ProfilePage';
import { loadResume } from '@/lib/content-loader';
import { filterResumeByRole, getRoleFromSearchParams } from '@/lib/role-filter';

function ProfilePageWrapper({
  resume,
  dictionary,
}: {
  resume: Awaited<ReturnType<typeof loadResume>>;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
}) {
  return <ProfilePage resume={resume} dictionary={dictionary} />;
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{
    coverLetter?: string;
    cover?: string;
    cl?: string;
    role?: string;
    job?: string;
  }>;
}) {
  const { lang } = await params;
  const search = await searchParams;
  const dictionary = await getDictionary(lang as 'en' | 'nl');
  let resume = await loadResume();

  // Apply role-based filtering if role parameter is present
  const role = getRoleFromSearchParams(search);
  if (role !== 'all') {
    resume = filterResumeByRole(resume, role);
  }

  return (
    <AccessGate dictionary={dictionary} basics={resume.basics}>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
            Loading...
          </div>
        }
      >
        <ProfilePageWrapper resume={resume} dictionary={dictionary} />
      </Suspense>
    </AccessGate>
  );
}
