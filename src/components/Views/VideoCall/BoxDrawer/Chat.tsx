import { Box, List, ListItem, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useStyles } from "./styles";
import ChatInput from "../ChatInput";
import { useAppSelector } from "@/hooks";
import { CloseIcon } from "@/assets";

const Chat: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const classes = useStyles();
  const endMessageRef = useRef<HTMLDivElement>(null);
  const { messages } = useAppSelector((state) => state.room);

  useEffect(() => {
    if (endMessageRef && endMessageRef.current) {
      scrollBottom(endMessageRef.current);
    }
  }, [messages]);

  const scrollBottom = (ref: HTMLDivElement) => {
    ref.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <Box component="div" height="3rem" className={classes.title}>
        <Typography component="h2" variant="h6">
          Chat
        </Typography>
        <CloseIcon onClick={onClose} className={classes.close} />
      </Box>
      <Box component="div" className={classes.boxDrawerContent}>
        <List className={classes.listMessages}>
          {messages.map((mess, index) => (
            <ListItem key={index}>
              <Typography>
                <span className={classes.displayName}>{mess.displayName}</span>: {mess.sentAt}
              </Typography>
              <Typography component="p" variant="body2">
                {mess.content}
              </Typography>
            </ListItem>
          ))}
          <div ref={endMessageRef}></div>
        </List>
        <div>
          <ChatInput />
        </div>
      </Box>
    </>
  );
};

export default Chat;
