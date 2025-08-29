import { getMe } from "@/features/users/api";
import { useApiHandler } from "@/lib/useApiHandler";

export default function User() {
  const { data } = useApiHandler(() => getMe(), []);

  const userProfile = data?.profileImageUrl;
  const userName = data?.nickname;

  return (
    <>
      <div>{userProfile}</div>
      <div>{userName}</div>
    </>
  );
}
