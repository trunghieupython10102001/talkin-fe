import * as React from "react";
import { Tooltip } from "@mui/material";
import CopyToClipboard from "react-copy-to-clipboard";

interface IProps {
  children: React.ReactNode;
  content: string;
}

function ContentCopy({ children, content }: IProps) {
  const [tooltipContent, setTooltipContent] = React.useState<"Copy" | "Copied">("Copy");

  const copyHandler = () => {
    setTooltipContent("Copied");
    setTimeout(() => {
      setTooltipContent("Copy");
    }, 3000);
  };

  return (
    <CopyToClipboard text={content} onCopy={copyHandler}>
      <Tooltip title={tooltipContent}>
        <div>{children}</div>
      </Tooltip>
    </CopyToClipboard>
  );
}

export default ContentCopy;
