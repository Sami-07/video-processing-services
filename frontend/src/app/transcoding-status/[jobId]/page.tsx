import DisplayTranscodingStatus from '@/components/video/display-transcoding-status';

const TranscodingStatus = async ({ params }: { params: { jobId: string } }) => {
    const { jobId } = await params;


    return (
        <DisplayTranscodingStatus jobId={jobId} />
    );
};

export default TranscodingStatus;