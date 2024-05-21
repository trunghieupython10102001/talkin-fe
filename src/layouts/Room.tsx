import { RoomContextProvider } from '@/context/RoomContext';
import { Outlet } from 'react-router-dom';

export default function RoomLayout() {
  return (
    <RoomContextProvider>
      <Outlet />
    </RoomContextProvider>
  );
}
