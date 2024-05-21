import { Box, IconButton, InputAdornment, InputBase } from "@mui/material";
import useChatInputViewController from "./useChatInputViewController";
import { useStyles } from "./styles";
import { SendIcon } from "@/assets";
import classNames from "classnames";

const ChatInput: React.FC = () => {
  const classes = useStyles();
  const { formController, sendMessageHandler } = useChatInputViewController();

  return (
    <Box component="form" className={classes.wrapperFormChat} onSubmit={sendMessageHandler}>
      <InputBase
        placeholder={"Content comment"}
        autoComplete="off"
        name="enteredMessage"
        className={classes.wrapperInputChat}
        value={formController.values.enteredMessage}
        onChange={formController.handleChange}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              disabled={!(formController.isValid && formController.dirty)}
              className={classNames({ [classes.sendActive]: (formController.isValid && formController.dirty) })}
              type="submit"
              onClick={sendMessageHandler}
            >
              <SendIcon />
            </IconButton>
          </InputAdornment>
        }
      />
    </Box>
  );
};

export default ChatInput;
