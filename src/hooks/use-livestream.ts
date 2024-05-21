import { ILivestreamRoomsParams, getLivestreamRooms } from "@/api/livestream";
import { socketFactory } from "@/classes/SocketFactory";
import { EEVENT_NAME } from "@/constants";
import { useAppSelector } from "@/hooks";
import { ILivestreamRoom } from "@/interfaces/type";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import _debounce from "lodash/debounce";
import { Paths } from "@/constants/path";
export const useLiveStream = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { params } = useAppSelector((state) => state.livestream);
  const [list, setList] = useState<ILivestreamRoom[]>([]);
  const [roomUpdate, setRoomUpdate] = useState<{ id: string; numberOfViewers: number; status: string }>();
  const [page, setPage] = useState<number>(1);
  const [meta, setMeta] = useState<{ totalPage: number; count: number }>();
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === Paths.LiveStream;

  const isFilterPage = location.pathname === Paths.LiveStreamFilter;

  const { status } = useParams();

  const [socket] = useState<Socket>(() =>
    io(socketFactory.getDefaultSocketURL(), {
      secure: true,
      transports: ["websocket"],
      auth: {},
    })
  );

  useEffect(() => {
    socket.on("connect", () => {
      console.debug("socket io connect tn");
    });

    socket.on("roomStatusUpdated", (data) => {
      setRoomUpdate({ ...data });
    });

    return () => {
      console.log("disconnect!");
      socket.disconnect();
    };
  }, [socket]);

  const getListLiveStream = useCallback(
    async (params: ILivestreamRoomsParams) => {
      try {
        setIsLoading(true);
        const res = await getLivestreamRooms(params, true);
        setList(res.data);
        setMeta({ totalPage: res.meta.totalPages, count: res.meta.count });
        const roomIds = res.data.map((room) => room.id);
        socket.emit("subscribeRoomStatus", {
          roomIds,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    },
    [socket]
  );

  useEffect(() => {
    const result = list.map((el) => {
      return el.id === roomUpdate?.id
        ? { ...el, peersCount: roomUpdate.numberOfViewers, status: roomUpdate.status }
        : { ...el };
    });

    setList(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomUpdate]);

  const searchLiveStream = useMemo(() => {
    return _debounce((searchText: string) => {
      getListLiveStream({
        ...params,
        name_like: searchText,
        "creator.fullname_like": searchText,
        page: isHomePage ? -1 : page,
        size: isHomePage ? -1 : page * 9,
        status: status ?? "",
        listCategory_has: isFilterPage ? params.listCategory_has : [],
      });
    }, 500);
  }, [getListLiveStream, params, status]);

  useEffect(() => {
    const updateSearchHandler = (event: CustomEvent<{ data: { value: string } }>) => {
      const searchText = event.detail.data.value;

      searchLiveStream(searchText);
    };

    window.addEventListener(EEVENT_NAME.UPDATE_SEARCH, updateSearchHandler);
    return () => {
      window.removeEventListener(EEVENT_NAME.UPDATE_SEARCH, updateSearchHandler);
    };
  }, [searchLiveStream]);

  const handleSeeAll = (status: string) => {
    navigate(`/livestream/${status}`);
  };

  const loadMore = () => {
    setPage((pre) => pre + 1);
  };

  return {
    isLoading,
    handleSeeAll,
    params,
    getListLiveStream,
    loadMore,
    page,
    list,
    meta,
    status,
  };
};
