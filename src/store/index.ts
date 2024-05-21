import { configureStore } from "@reduxjs/toolkit";
import roomReducer from "./roomSlice";
import notificationReducer from "./notificationSlice";
import consumerReducer from "./consumerSlice";
import dataConsumerReducer from "./dataConsumerSlice";
import peerReducer from "./peersSlice";
import userReducer from "./userSlice";
import producerReducer from "./producerSlice";
import dataProducerReducer from "./dataProducersSlice";
import authReducer from "./authSlice";
import layoutReducer from "./layoutSlice";
import inviteReducer from "./inviteSlice";
import livestreamReducer from "./livestreamSlice";

export const store = configureStore({
  reducer: {
    room: roomReducer,
    notification: notificationReducer,
    consumer: consumerReducer,
    dataConsumer: dataConsumerReducer,
    peers: peerReducer,
    user: userReducer,
    producer: producerReducer,
    dataProducer: dataProducerReducer,
    auth: authReducer,
    layout: layoutReducer,
    invite: inviteReducer,
    livestream: livestreamReducer,
  },
});
