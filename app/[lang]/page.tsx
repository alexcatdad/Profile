import { Suspense } from 'react';
import { getDictionary } from '@/app/dictionaries';
import { AccessGate } from '@/components/AccessGate';
import { ProfilePage } from '@/components/ProfilePage';
import { loadContent } from '@/lib/content-loader';
import { filterContentByRole, getRoleFromSearchParams } from '@/lib/role-filter';

function ProfilePageWrapper({
  content,
  dictionary,
  coverLetterOpen,
}: {
  content: Awaited<ReturnType<typeof loadContent>>;
  dictionary: Awaited<ReturnType<typeof getDictionary>>;
  coverLetterOpen: boolean;
}) {
  return (
    <ProfilePage content={content} dictionary={dictionary} coverLetterOpen={coverLetterOpen} />
  );
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
  let content = await loadContent();

  // Apply role-based filtering if role parameter is present
  const role = getRoleFromSearchParams(search);
  if (role !== 'all') {
    content = filterContentByRole(content, role);
  }

  const coverLetterOpen =
    search.coverLetter === 'true' ||
    search.coverLetter === '1' ||
    search.coverLetter === 'show' ||
    search.cover === 'true' ||
    search.cl === 'true';

  return (
    <AccessGate dictionary={dictionary} profile={content.profile}>
      <Suspense fallback={<div>Loading...</div>}>
        <ProfilePageWrapper
          content={content}
          dictionary={dictionary}
          coverLetterOpen={coverLetterOpen}
        />
      </Suspense>
    </AccessGate>
  );
}
