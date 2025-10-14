type BadgeProps = {
  text: string;
  color: string;
};

const Badge = ({ text, color }: BadgeProps) => {
  return (
    <span
      className={`px-2 py-1 rounded text-xs font-medium text-white ${color}`}
    >
      {text}
    </span>
  );
};

export default Badge;
