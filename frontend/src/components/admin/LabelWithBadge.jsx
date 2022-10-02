import Label from "../Lable";

const LabelWithBadge = ({ children, htmlFor, badge = 0 }) => {
  const renderBadge = () => {
    if (!badge) return null;

    return (
      <span className="dark:bg-dark-subtle bg-light-subtle absolute text-white top-0 right-0 translate-x-4 -translate-y-1 text-xs w-5 h-5 rounded-full flex justify-center items-center">
        {badge <= 9 ? badge : "9+"}
      </span>
    );
  };
  return (
    <div className="relative">
      <Label htmlFor={htmlFor} className>
        {children}
      </Label>
      {renderBadge()}
    </div>
  );
};

export default LabelWithBadge;