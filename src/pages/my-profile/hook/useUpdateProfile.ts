import { useState, useEffect } from "react";
import { useFormik } from "formik";
import { IProfile } from "@/interfaces/type";

import { UpdateProfileValidate } from "./UpdateProfileVaildate";
import { updateProfile } from "@/api/profile";
import { IFormProfile } from "@/interfaces/type";
import { useAppDispatch, useAppSelector } from "@/hooks/store";

import { authAsyncActions } from "@/store/authSlice";
import { notify } from "@/store/thunks/notify";
import { ENOTIFY_TYPE } from "@/constants";
import detectEthereumProvider from "@metamask/detect-provider";

export const useUpdateProfiles = () => {
  const [profileData, setProfileData] = useState<IProfile>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isViewMode, setIsViewMode] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.auth.profile);
  const [walletAddress, setWalletAddress] = useState("");
  const walletActionButtonState = !walletAddress
    ? "NOT-CONNECT"
    : walletAddress.toLowerCase() === profile.wallet?.toLowerCase()
    ? "HIDE"
    : "UPDATE-WALLET";

  const handleUpdateProfiles = async (data: IFormProfile) => {
    if (!data) return;

    setIsLoading(true);
    try {
      const res = await updateProfile({
        ...data,
        birthday: data.birthday || undefined,
        gender: data.gender || undefined,
        phone: data.phone || undefined,
      });

      if (res.status === 200) {
        dispatch(
          notify({
            text: "Update successfully!",
            title: "Update account’s information",
          })
        );
        setIsViewMode(true);
      }
    } catch (error: any) {
      setIsViewMode(false);

      dispatch(
        notify({
          text: "Failed to update!",
          title: "Update account’s information",
          type: ENOTIFY_TYPE.ERROR,
        })
      );
    } finally {
      handleGetProfile();
      setIsLoading(false);
    }
  };

  const handleGetProfile = async () => {
    dispatch(authAsyncActions.getProfileAction());
  };

  const UpdateProfileFormik = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstname: profileData?.firstname || "",
      lastname: profileData?.lastname || "",
      birthday: profileData?.birthday || "",
      gender: profileData?.gender || "",
      email: profileData?.email || "",
      phone: profileData?.phone || "",
      address: profileData?.address || "",
      description: profileData?.description || "",
    },
    validationSchema: UpdateProfileValidate,
    onSubmit: async (values) => {
      handleUpdateProfiles(values);
    },
  });

  const connectWalletHandler = async () => {
    const provider = await detectEthereumProvider({ mustBeMetaMask: true });

    if (!provider) {
      dispatch(
        notify({
          title: "Can't detech metamask on your device, please try again",
          type: ENOTIFY_TYPE.ERROR,
        })
      );

      return;
    }

    // const walletProvider = new ethers.BrowserProvider(window.ethereum);
    const accounts = (await window.ethereum.request({
      method: "eth_requestAccounts",
    })) as string[];
    setWalletAddress(accounts[0]);
  };

  useEffect(() => {
    if (profile) {
      setProfileData(profile);
    }
  }, [profile]);

  return {
    UpdateProfileFormik,
    profileData,
    isLoading,
    isViewMode,
    walletAddress: walletAddress || profile.wallet,
    walletActionButtonState,
    handleGetProfile,
    setIsViewMode,
  };
};
