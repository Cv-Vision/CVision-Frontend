import BackButton from '@/components/other/BackButton.tsx';
import { CreateJobForm } from '@/components/rebranding/createJob/CreateJobForm';

export default function CreateJob() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 py-10 px-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <BackButton />
        <CreateJobForm />
      </div>
    </div>
  );
}
