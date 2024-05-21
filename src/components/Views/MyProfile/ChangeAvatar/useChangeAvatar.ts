import { MESSAGE } from "@/constants/message";

import { useEffect, useState } from "react";

import { uploadAvatar } from "@/api/profile";
import { useAppDispatch } from "@/hooks";
import { notify } from "@/store/thunks/notify";
import { ENOTIFY_TYPE } from "@/constants";

export const useChangeAvatar = (
  isOpen: boolean,
  onClose?: () => void,
  avatarURL?: string,
  handleGetProfile?: () => void
) => {
  const [selectedFile, setSelectedFile] = useState<any | undefined>(undefined);
  const [preview, setPreview] = useState<string>("");
  const [error, setError] = useState("");
  const [imgAvatar, setImgAvatar] = useState("");
  const dispath = useAppDispatch();

  useEffect(() => {
    if (avatarURL) {
      setImgAvatar(avatarURL);
    }

    if (preview) {
      setImgAvatar(preview);
    }
  }, [avatarURL, preview]);

  // create a preview as a side effect, whenever selected file is changed
  useEffect(() => {
    if (!selectedFile) {
      setPreview("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onSelectFile = (e: any) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);

      return;
    }

    const isImage = e.target.files[0].type.split("/").some((el: string) => {
      const type = ["jpg", "jpeg", "png", "gif"];
      return type.includes(el);
    });

    if (e.target.files[0].size > 5120000) {
      setError(MESSAGE.MS_3);
      setSelectedFile(undefined);
    } else if (!isImage) {
      setError(MESSAGE.MS_4);
      setSelectedFile(undefined);
    } else {
      setError("");
      // I've kept this example simple by using the first image instead of multiple
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadAvatar = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    const res = await uploadAvatar(formData);

    if (res.status === 200 || res.status === 201) {
      dispath(notify({ type: ENOTIFY_TYPE.SUCCESS, text: MESSAGE.MS_5 }));
      onClose?.();
      handleGetProfile?.();
    } else {
      dispath(notify({ type: ENOTIFY_TYPE.ERROR, text: MESSAGE.MS_6 }));
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedFile(undefined);
      setPreview("");
      setError("");
    }
  }, [isOpen]);

  return {
    onSelectFile,
    preview,
    selectedFile,
    error,
    handleUploadAvatar,
    imgAvatar,
  };
};
