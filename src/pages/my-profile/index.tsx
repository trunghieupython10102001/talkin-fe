import { useState, useMemo } from "react";
import { Box, Grid, Typography, InputLabel, TextField, Button, Select, MenuItem, Avatar } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { useStyles } from "./styles";
import { useUpdateProfiles } from "./hook/useUpdateProfile";

import ChangeAvatar from "@/components/Views/MyProfile/ChangeAvatar";
import { CameraButton } from "@/assets";
import { Moment } from "moment";
import moment from "moment";
import { Gender } from "@/interfaces/type";
import Calendar from "@/assets/svg/calendar.svg";
import Male from "@/assets/svg/male.svg";
import FeMale from "@/assets/svg/female.svg";
import BackgroundProfile from "@/assets/images/profile_bg.png";
export const MyProfile = () => {
  const classes = useStyles();
  const {
    UpdateProfileFormik,
    profileData,
    isViewMode,
    handleGetProfile,
    setIsViewMode,
  } = useUpdateProfiles();
  // const [isViewMode, setIsViewMode] = useState<boolean>(true);
  const baseURL = process.env.REACT_APP_BE_BASE_URL;

  const [isOpen, setOpen] = useState(false);

  const openChangeAvatar = () => {
    setOpen(true);
  };
  const handleCloseDialog = () => {
    setOpen(false);
  };

  const avatarURL = useMemo(() => {
    if (!profileData?.avatar) return;

    return `${baseURL}/${profileData.avatar}`;
  }, [profileData?.avatar, baseURL]);

  const updateBirthday = UpdateProfileFormik.handleChange("birthday");

  return (
    <>
      <div className={classes.bgProfile}>
        <img src={BackgroundProfile} alt="bg-profile" /> <Typography className={classes.title}>My Profile</Typography>
      </div>
      <div className={classes.profileContainer}>
        <Box className={classes.headPage}>
          <Box className={classes.avatar}>
            <div className={classes.avatarContainer}>
              <Avatar src={avatarURL} alt="avatar" sx={{ width: 120, height: 120 }}>
                {avatarURL ? "" : `${profileData?.firstname.charAt(0)}${profileData?.lastname.charAt(0)}`}
              </Avatar>
              <CameraButton onClick={openChangeAvatar} />
            </div>

            <div className={classes.info}>
              <Typography variant="h6">
                {profileData ? profileData?.firstname + " " + profileData?.lastname : ""}
              </Typography>
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  marginTop: 10,
                }}
              >
                {profileData?.birthday && (
                  <div className={classes.birthday}>
                    <img src={Calendar} alt="" />
                    <Typography variant="body1">{moment(profileData?.birthday).format("DD/MM/YYYY")}</Typography>
                  </div>
                )}
                {profileData?.gender && (
                  <div className={classes.gender}>
                    <span>•</span>
                    {profileData.gender !== Gender.OTHER ? (
                      <>
                        {" "}
                        <img src={profileData.gender === Gender.FEMALE ? FeMale : Male} alt="" />
                        <Typography>{profileData.gender === Gender.FEMALE ? "Female" : "Male"}</Typography>
                      </>
                    ) : (
                      <Typography>Other</Typography>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Box>
          {isViewMode && (
            <Button
              variant="contained"
              onClick={() => {
                setIsViewMode(false);
              }}
            >
              Edit Profile
            </Button>
          )}
        </Box>
        <Grid className={classes.formContainer} container component="form" spacing={2}>
          {/* <Grid item md={4}>
            <InputLabel>&nbsp;</InputLabel>
          </Grid> */}

          {!isViewMode && (
            <>
              <Grid item md={6}>
                <InputLabel htmlFor="firstname">First Name</InputLabel>
                <TextField
                  id="firstname"
                  disabled={isViewMode}
                  placeholder="First Name"
                  value={UpdateProfileFormik.values.firstname}
                  onChange={UpdateProfileFormik.handleChange}
                  onBlur={UpdateProfileFormik.handleBlur("firstname")}
                  autoComplete="off"
                  error={!!UpdateProfileFormik.errors.firstname}
                  helperText={UpdateProfileFormik.errors.firstname}
                />
              </Grid>
              <Grid item md={6}>
                <InputLabel htmlFor="lastname">Last Name</InputLabel>
                <TextField
                  id="lastname"
                  disabled={isViewMode}
                  placeholder="Last Name"
                  value={UpdateProfileFormik.values.lastname}
                  onChange={UpdateProfileFormik.handleChange}
                  onBlur={UpdateProfileFormik.handleBlur("lastname")}
                  autoComplete="off"
                  error={!!UpdateProfileFormik.errors.lastname}
                  helperText={UpdateProfileFormik.errors.lastname}
                />
              </Grid>
              <Grid item md={6}>
                <InputLabel htmlFor="birthday">Birthday</InputLabel>
                <DatePicker
                  format="DD/MM/YYYY"
                  value={UpdateProfileFormik.values.birthday ? moment(UpdateProfileFormik.values.birthday) : null}
                  onChange={(value: Moment | null) => {
                    value ? updateBirthday(moment(value).format("YYYY-MM-DD")) : updateBirthday("");
                  }}
                  slotProps={{
                    textField: {
                      id: "birthday",
                      name: "birthday",
                    },
                  }}
                  disabled={isViewMode}
                  disableFuture
                />
                <div>
                  {" "}
                  {UpdateProfileFormik.errors.birthday && (
                    <span className={classes.error}>{UpdateProfileFormik.errors.birthday}</span>
                  )}
                </div>
              </Grid>

              <Grid item md={6}>
                <InputLabel id="select-gender">Gender</InputLabel>
                <Select
                  labelId="select-gender"
                  id="gender"
                  name="gender"
                  value={UpdateProfileFormik.values.gender}
                  onChange={UpdateProfileFormik.handleChange}
                  onBlur={UpdateProfileFormik.handleBlur("gender")}
                  disabled={isViewMode}
                >
                  <MenuItem value={Gender.MALE}>Male</MenuItem>
                  <MenuItem value={Gender.FEMALE}>Female</MenuItem>
                  <MenuItem value={Gender.OTHER}>Other</MenuItem>
                </Select>
              </Grid>
            </>
          )}

          <Grid item md={6}>
            <InputLabel htmlFor="email">Email</InputLabel>
            <TextField
              id="email"
              disabled={isViewMode}
              placeholder="Email"
              value={UpdateProfileFormik.values.email}
              onChange={UpdateProfileFormik.handleChange}
              onBlur={UpdateProfileFormik.handleBlur("email")}
              autoComplete="off"
              error={!!UpdateProfileFormik.errors.email}
              helperText={UpdateProfileFormik.errors.email}
            />
          </Grid>
          <Grid item md={6}>
            <InputLabel htmlFor="phone">Phone</InputLabel>
            <TextField
              id="phone"
              disabled={isViewMode}
              placeholder="Phone"
              value={UpdateProfileFormik.values.phone}
              onChange={UpdateProfileFormik.handleChange}
              onBlur={UpdateProfileFormik.handleBlur("phone")}
              autoComplete="off"
              error={!!UpdateProfileFormik.errors.phone}
              helperText={UpdateProfileFormik.errors.phone}
            />
          </Grid>
          <Grid item md={12}>
            <InputLabel htmlFor="address">Address</InputLabel>
            <TextField
              id="address"
              disabled={isViewMode}
              placeholder="Address"
              value={UpdateProfileFormik.values.address}
              onChange={UpdateProfileFormik.handleChange}
              onBlur={UpdateProfileFormik.handleBlur("address")}
              autoComplete="off"
              error={!!UpdateProfileFormik.errors.address}
              helperText={UpdateProfileFormik.errors.address}
            />
          </Grid>
          <Grid item md={12}>
            <InputLabel htmlFor="description">Description</InputLabel>
            <TextField
              id="description"
              disabled={isViewMode}
              placeholder="Description"
              value={UpdateProfileFormik.values.description}
              onChange={UpdateProfileFormik.handleChange}
              onBlur={UpdateProfileFormik.handleBlur("description")}
              autoComplete="off"
              error={!!UpdateProfileFormik.errors.description}
              helperText={UpdateProfileFormik.errors.description}
              fullWidth
              rows={4}
              multiline
            />
          </Grid>

          {!isViewMode && (
            <Grid item md={12} className={classes.groupButton}>
              <Button
                fullWidth
                variant="contained"
                className={classes.cancel}
                onClick={() => {
                  UpdateProfileFormik.resetForm();
                  setIsViewMode(true);
                }}
              >
                Cancel
              </Button>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  UpdateProfileFormik.handleSubmit();
                }}
                disabled={!(UpdateProfileFormik.dirty && UpdateProfileFormik.isValid)}
              >
                Update
              </Button>
            </Grid>
          )}
        </Grid>
        <ChangeAvatar
          isOpen={isOpen}
          onClose={handleCloseDialog}
          avatarURL={avatarURL}
          profileData={profileData}
          handleGetProfile={handleGetProfile}
        />
      </div>
    </>
  );
};
