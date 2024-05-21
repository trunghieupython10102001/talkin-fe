import * as React from "react";
import "react-multi-email/dist/style.css";
import { isEmail as isEmailFn } from "react-multi-email";
import { FormHelperText, TextField, TextFieldProps } from "@mui/material";
import { useStyles } from "./styles";
import classNames from "classnames";

export interface IReactMultiEmailProps {
  id?: string;
  emails?: string[];
  onChange?: (emails: string[]) => void;
  enable?: ({ emailCnt }: { emailCnt: number }) => boolean;
  onDisabled?: () => void;
  onChangeInput?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => void;
  onKeyDown?: (evt: React.KeyboardEvent<HTMLInputElement>) => void;
  onKeyUp?: (evt: React.KeyboardEvent<HTMLInputElement>) => void;
  noClass?: boolean;
  validateEmail?: (email: string) => boolean | Promise<boolean>;
  enableSpinner?: boolean;
  style?: React.CSSProperties;
  getLabel: (
    email: string,
    index: number,
    removeEmail: (index: number, isDisabled?: boolean) => void
  ) => React.ReactNode;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  autoFocus?: boolean;
  spinner?: () => React.ReactNode;
  delimiter?: string;
  initialInputValue?: string;
}

type TComponentProps = IReactMultiEmailProps & Partial<Omit<TextFieldProps, keyof IReactMultiEmailProps>>;

export function MultiEmailInput(props: TComponentProps) {
  const {
    id,
    style,
    getLabel,
    className = "",
    noClass,
    placeholder,
    autoFocus,
    enable,
    onDisabled,
    validateEmail,
    onChange,
    onChangeInput,
    onFocus,
    onBlur,
    onKeyDown,
    onKeyUp,
    spinner,
    delimiter = "[ ,;]",
    initialInputValue,
    inputClassName,
    type,
    value,
    disabled,
    error,
    helperText,
    ...otherProps
  } = props;
  const classes = useStyles();
  const emailInputRef = React.useRef<HTMLDivElement>(null);

  const [focused, setFocused] = React.useState(false);
  const [emails, setEmails] = React.useState<string[]>([]);
  const [inputValue, setInputValue] = React.useState(initialInputValue || value || "");
  const [spinning, setSpinning] = React.useState(false);

  const findEmailAddress = React.useCallback(
    async (value: string = "", isEnter?: boolean) => {
      const validEmails: string[] = [];
      let enteredInputValue: string = "";
      const re = new RegExp(delimiter, "g");
      const isEmail = validateEmail || isEmailFn;

      const addEmails = (email: string) => {
        for (let i = 0, l = emails.length; i < l; i++) {
          if (emails[i] === email) {
            return false;
          }
        }
        validEmails.push(email);
        return true;
      };

      if (value !== "") {
        if (re.test(value)) {
          const splitData = value.split(re).filter((n) => {
            return n !== "" && n !== undefined && n !== null;
          });

          const setArr = new Set(splitData);
          const arr = [...setArr];

          do {
            const validateResult = isEmail("" + arr[0]);

            if (typeof validateResult === "boolean") {
              if (validateResult) {
                addEmails("" + arr.shift());
              } else {
                if (arr.length === 1) {
                  enteredInputValue = "" + arr.shift();
                } else {
                  arr.shift();
                }
              }
            } else {
              // handle promise
              setSpinning(true);

              if ((await validateEmail?.(value)) === true) {
                addEmails("" + arr.shift());
                setSpinning(false);
              } else {
                if (arr.length === 1) {
                  enteredInputValue = "" + arr.shift();
                } else {
                  arr.shift();
                }
              }
            }
          } while (arr.length);
        } else {
          if (enable && !enable({ emailCnt: emails.length })) {
            onDisabled?.();
            return;
          }

          if (isEnter) {
            const validateResult = isEmail(value);

            if (typeof validateResult === "boolean") {
              if (validateResult) {
                addEmails(value);
              } else {
                enteredInputValue = value;
              }
            } else {
              // handle promise
              setSpinning(true);
              if ((await validateEmail?.(value)) === true) {
                addEmails(value);
                setSpinning(false);
              } else {
                enteredInputValue = value;
              }
            }
          } else {
            enteredInputValue = value;
          }
        }
      }

      const updatedValue = [...emails, ...validEmails];

      setEmails(updatedValue);
      setInputValue(enteredInputValue);

      if (validEmails.length) {
        onChange?.(updatedValue);
      }

      if (enteredInputValue !== inputValue) {
        onChangeInput?.(enteredInputValue);
      }
    },
    [delimiter, emails, enable, onChange, onChangeInput, onDisabled, validateEmail]
  );

  const onChangeInputValue = React.useCallback(
    async (value: string) => {
      await findEmailAddress(value);
    },
    [findEmailAddress]
  );

  const removeEmail = React.useCallback(
    (index: number, isDisabled?: boolean) => {
      if (isDisabled) {
        return;
      }

      const _emails = [...emails.slice(0, index), ...emails.slice(index + 1)];
      setEmails(_emails);
      onChange?.(_emails);
    },
    [emails, onChange]
  );

  const handleOnKeydown = React.useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(e);

      switch (e.key) {
        case "Enter":
          e.preventDefault();
          break;
        case "Backspace":
          if (!(e.target as HTMLInputElement).value) {
            removeEmail(emails.length - 1, false);
          }
          break;
        default:
      }
    },
    [emails.length, onKeyDown, removeEmail]
  );

  const handleOnKeyup = React.useCallback(
    async (e: React.KeyboardEvent<HTMLInputElement>) => {
      onKeyUp?.(e);

      switch (e.key) {
        case "Enter":
          await findEmailAddress((e.target as HTMLInputElement).value, true);
          break;
        default:
      }
    },
    [findEmailAddress, onKeyUp]
  );

  const handleOnChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChangeInputValue(e.target.value),
    [onChangeInputValue]
  );

  const handleOnBlur = React.useCallback(
    async (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement, Element>) => {
      setFocused(false);
      await findEmailAddress(e.currentTarget.value, true);
      onBlur?.(e);
    },
    [findEmailAddress, onBlur]
  );

  const handleOnFocus = React.useCallback(() => {
    setFocused(true);
    onFocus?.();
  }, [onFocus]);

  const inputContainerClickHandler = () => {
    const rfContainer = emailInputRef.current;

    if (!rfContainer) {
      return;
    }

    const rfInput = rfContainer.querySelector("input");

    rfInput && rfInput.focus();
  };

  React.useEffect(() => {
    setEmails(props.emails ?? []);
  }, [props.emails]);

  return (
    <div>
      <div
        className={classNames([className, classes.container], {
          disabled,
          "react-multi-email": !noClass,
          focused,
          empty: inputValue === "" && emails.length === 0,
          error,
        })}
        style={style}
        onClick={inputContainerClickHandler}
      >
        {spinning && spinner?.()}
        {placeholder ? (
          <span data-placeholder className={classes.placeholder}>
            {placeholder}
          </span>
        ) : null}
        <div
          className="data-labels"
          style={{ opacity: spinning ? 0.45 : 1.0, display: "contents", flexWrap: "inherit" }}
        >
          {emails.map?.((email: string, index: number) => getLabel(email, index, removeEmail))}
        </div>
        <TextField
          id={id}
          style={{ opacity: spinning ? 0.45 : 1.0 }}
          ref={emailInputRef}
          // placeholder={placeholder || ""}
          type={type || "text"}
          value={inputValue}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          onChange={handleOnChange}
          onKeyDown={handleOnKeydown}
          onKeyUp={handleOnKeyup}
          autoFocus={autoFocus}
          className={classNames(classes.input, inputClassName)}
          disabled={disabled}
          {...otherProps}
        />
      </div>
      {helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
    </div>
  );
}
