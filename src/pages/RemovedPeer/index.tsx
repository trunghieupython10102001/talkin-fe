import { Paths } from "@/constants/path";
import BufferPage from "@/components/Views/BufferPage";

export const RemovedPeer = () => {
  return <BufferPage title="You have been removed from the video call" linkRedirect={Paths.Home} />;
};
