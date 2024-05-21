import React from "react";
import { useStyles } from "./styles";
import classNames from "classnames";

interface ISoundWaveProps {
  audioVolumn?: number;
}

const SoundWave: React.FC<ISoundWaveProps> = ({ audioVolumn = 0 }) => {
  const classes = useStyles();
  return (
    <div className={classes.boxSoundContainer}>
      <div className={classNames(classes.box, classes.box1, { [classes.boxDuration]: audioVolumn !== 0 })}></div>
      <div className={classNames(classes.box, classes.box2, { [classes.boxDuration]: audioVolumn !== 0 })}></div>
      <div className={classNames(classes.box, classes.box3, { [classes.boxDuration]: audioVolumn !== 0 })}></div>
      <div className={classNames(classes.box, classes.box4, { [classes.boxDuration]: audioVolumn !== 0 })}></div>
      <div className={classNames(classes.box, classes.box5, { [classes.boxDuration]: audioVolumn !== 0 })}></div>
    </div>
  );
};

export default SoundWave;
