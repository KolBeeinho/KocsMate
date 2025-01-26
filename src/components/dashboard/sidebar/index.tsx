import {
  Bars3BottomLeftIcon,
  EllipsisHorizontalIcon,
  HomeIcon,
} from "@heroicons/react/24/solid";

import Link from "next/link";
import React, { JSX } from "react";
import ActiveTab from "./ActiveTab";
import MobileSidebar from "./MobileSidebar";
import Tab from "./Tab";

type Tab = {
  id: string;
  title: string;
  icon: JSX.Element;
  href: string;
};

const Sidebar: React.FC = () => {
  const tabs: Array<Tab> = [
    {
      id: "dashboard",
      title: "Home",
      icon: <HomeIcon />,
      href: "/dashboard",
    },
  ];

  const [open, setOpen] = React.useState(false);

  const handleSidebarButton = () => {
    setOpen(!open);
  };

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
    console.log(e.currentTarget.id);
  };

  return (
    <div
      className={`${
        open ? " lg:w-[200px]" : "lg:w-[70px]"
      } h-screen bg-[#161418] transition-all duration-300`}
    >
      {/* Tab icons */}
      <div className="hidden lg:flex lg:flex-col items-center lg:space-y-10 lg:p-4">
        {/* Top icon */}
        <div className="hidden xl:flex">
          <button
            className="sidebarbtn duration-300"
            title="Open"
            onClick={handleSidebarButton}
          >
            <Bars3BottomLeftIcon className="h-7 w-7 rounded-xl" />
          </button>
        </div>
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
                    open={open}
                  />
                ) : (
                  <Tab
                    id={tab.id}
                    title={tab.title}
                    icon={tab.icon}
                    href={tab.href}
                    onClick={handleTabChange}
                    open={open}
                  />
                )}
              </React.Fragment>
            ))}
          </>
        )}
        {/* Settings tab icon */}
        <div className="fixed bottom-0">
          <Link href="/dashboard/settings">
            <button
              className="sidebarbtn"
              title="Settings"
              onClick={handleTabChange}
            >
              <EllipsisHorizontalIcon className="" />
              <span className="invisible">gomb</span> {/* valami bug */}
            </button>
          </Link>
        </div>
      </div>
      {/* On Handheld devices*/}
      <MobileSidebar />
    </div>
  );
};

export default Sidebar;
