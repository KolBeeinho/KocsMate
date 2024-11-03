import { HomeIcon } from "@heroicons/react/24/solid";

import React from "react";
import ActiveTab from "./ActiveTab";
import Tab from "./Tab";

type Tab = {
  id: string;
  title: string;
  icon: JSX.Element;
  href: string;
};

const MobileSidebar: React.FC = () => {
  const tabs: Array<Tab> = [
    {
      id: "home",
      title: "Home",
      icon: <HomeIcon />,
      href: "/dashboard",
    },
  ];

  const [activeTab, setActiveTab] = React.useState<string>();

  React.useEffect(() => {
    if (window.location.pathname === "/") {
      setActiveTab("home");
    } else {
      setActiveTab(window.location.pathname.slice(1));
    }
  }, []);

  const handleTabChange = (e: React.MouseEvent<HTMLElement>) => {
    setActiveTab(e.currentTarget.id);
  };

  return (
    <div className="fixed bottom-0 flex w-screen justify-around bg-[#161418] p-2 lg:hidden">
      {activeTab !== undefined && (
        <>
          {tabs.map((tab) => (
            <React.Fragment key={tab.id}>
              {activeTab === tab.id ? (
                <ActiveTab
                  id={tab.id}
                  title={tab.title}
                  icon={tab.icon}
                  href={tab.href}
                  onClick={handleTabChange}
                />
              ) : (
                <Tab
                  id={tab.id}
                  title={tab.title}
                  icon={tab.icon}
                  href={tab.href}
                  onClick={handleTabChange}
                />
              )}
            </React.Fragment>
          ))}
        </>
      )}
    </div>
  );
};

export default MobileSidebar;
