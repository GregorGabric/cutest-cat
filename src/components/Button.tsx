import type { FC, PropsWithChildren, SyntheticEvent } from "react";

interface ButtonProps extends PropsWithChildren {
  btnClassName: string;
  onClick: (event: SyntheticEvent<HTMLButtonElement>) => void;
  catNumber: number;
}

const Button: FC<ButtonProps> = ({
  children,
  btnClassName,
  onClick,
  catNumber,
}) => {
  return (
    <button
      data-cat-number={catNumber}
      onClick={onClick}
      type="button"
      className={`text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${btnClassName}`}
    >
      {children}
    </button>
  );
};
export default Button;
