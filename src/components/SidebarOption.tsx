import { User } from "src/App";
import "./SidebarOption.css";

export function SidebarOption({ user }: { user: User}) {
  return (
    <div className="sidebarOption">
      <img src={user.images[1].url} alt="User avatar" />
      <p>{user.display_name}</p>
    </div>
  );
}

export default SidebarOption;
