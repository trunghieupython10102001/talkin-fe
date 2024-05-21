import { Paths } from "@/constants/path";
import BufferPage from "@/components/Views/BufferPage";

export const RemoveMeeting = () => {
  return <BufferPage title="The meeting was canceled" linkRedirect={Paths.Home} />;
};
