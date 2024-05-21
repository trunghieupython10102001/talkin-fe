export const REGEX = {
  ONLY_NUMBER_CHARACTERS_SPACE: /^[0-9A-Za-z\s\-]+$/,
  EMAIL_ADDRESS: /^[\w-\.]{6,100}@([\w-]+\.)+[\w-]{2,4}/,
};
export const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
