interface ButtonProps {
  buttonText: string;
  onClick: () => void;
  disabled?: boolean;
}

const CustomButton: React.FC<ButtonProps> = ({ buttonText, onClick, disabled, ...rest }) => {
  return (
    <div
      style={{
        width: "6rem",
        height: "30px",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        backgroundColor: "transparent",
        pointerEvents: disabled ? "none" : "auto",
      }}
      onMouseOver={(e) => (e.currentTarget.style.background = "#f0f0f0")}
      onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}
      onClick={disabled ? null : (onClick as any)}
      {...rest}
    >
      <div
        style={{
          fontWeight: "bold",
          color: disabled ? "lightgrey" : "GrayText",
        }}
      >
        {buttonText}
      </div>
    </div>
  );
};

export default CustomButton;
