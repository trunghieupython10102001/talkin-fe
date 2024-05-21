import WaitingScreen from "@/components/Views/WaitingRoom/WaitingScreen";
import useWaitingRoomViewController from "./useWaitingRoomViewController";
import { useStyles } from "./styles";

const WaitingRoomPage: React.FC = () => {
  const { roomClient, user } = useWaitingRoomViewController();
  const classes = useStyles();

  return (
    <section className={classes.root}>
      <WaitingScreen roomClient={roomClient} user={user} />
    </section>
  );
};

export default WaitingRoomPage;
