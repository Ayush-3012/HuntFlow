import GenerateApplicationClient from "./generate-application-client";

type NewApplicationPageProps = {
  searchParams?: {
    jobId?: string;
  };
};

export default function GenerateApplicationPage({ searchParams }: NewApplicationPageProps) {
  return <GenerateApplicationClient initialJobId={searchParams?.jobId} />;
}

