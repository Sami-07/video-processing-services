import ProfilePage from "@/components/profile/profile-page";
export default async function Page({ params }: { params: { userId: string } }) {
  const { userId } = await params;
  if (!userId) return <div>User not found</div>
  return (
    <div>
      <ProfilePage userId={userId} />
    </div>
  )
}
