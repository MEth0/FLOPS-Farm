import "./Button.css";

const Button = ({
  children,
  canBuy,
  ...props
}: {
  children: React.ReactNode;
  canBuy?: boolean;
  [x: string]: any;
}) => {
  return (
    <button
      type="button"
      className={`button${canBuy === true ? "" : " cantBuy"}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
