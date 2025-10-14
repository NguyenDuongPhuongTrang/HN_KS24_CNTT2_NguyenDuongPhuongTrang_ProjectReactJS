type MemberProps = {
  name: string;
  role: string;
};

const MemberCard = ({ name, role }: MemberProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
        {name.charAt(0)}
      </div>
      <div>
        <p className="font-medium">{name}</p>
        <p className="text-sm text-gray-500">{role}</p>
      </div>
    </div>
  );
};

export default MemberCard;
