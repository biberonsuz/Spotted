import HeaderComponent from "./HeaderComponent";
import NavigationComponent from "./NavigationComponent";
import { Outlet } from "react-router-dom";

type AppShellProps = {
  onLoginClick: () => void;
  onRegisterClick: () => void;
};

export default function AppShell({
  onLoginClick,
  onRegisterClick,
}: AppShellProps) {
  return (
    <div className="flex min-h-screen h-screen w-full max-w-full flex-col overflow-x-hidden">
      <HeaderComponent
        onLoginClick={onLoginClick}
        onRegisterClick={onRegisterClick}
      />
      <main className="min-h-0 flex-1 overflow-x-hidden">
        <Outlet />
      </main>
      <NavigationComponent />
    </div>
  );
}

