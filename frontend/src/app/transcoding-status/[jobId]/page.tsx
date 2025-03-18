import DisplayTranscodingStatus from '@/components/video/display-transcoding-status';
import Navbar from '@/components/navbar';

const TranscodingStatus = async ({ params }: { params: { jobId: string } }) => {
    const { jobId } = await params;

    return (
        <div className="min-h-screen bg-gray-900">

            <DisplayTranscodingStatus jobId={jobId} />
        </div>
    );
};

export default TranscodingStatus;