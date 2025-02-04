import {
  ArrowLeftStartOnRectangleIcon,
  Bars3BottomLeftIcon,
  BuildingStorefrontIcon,
  ChatBubbleBottomCenterTextIcon,
  EllipsisHorizontalIcon,
  HomeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";

import Link from "next/link";
import React, { JSX, useContext } from "react";
import { AuthContext } from "../../../utils/providers/AuthContext";
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
  const authContext = useContext(AuthContext);
  if (!authContext) {
    return;
  }
  const { user, logout } = authContext;

  const tabs: Array<Tab> = [
    {
      id: "home",
      title: "Home",
      icon: <HomeIcon />,
      href: "/dashboard",
    },
    {
      id: "reviews",
      title: "reviews",
      icon: <ChatBubbleBottomCenterTextIcon />,
      href: "/dashboard/reviews",
    },
    {
      id: "menu",
      title: "menu",
      icon: <BuildingStorefrontIcon />,
      href: "/dashboard/menu",
    },
    {
      id: "modify",
      title: "modify",
      icon: <PencilSquareIcon />,
      href: "/dashboard/modify",
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
    //console.log(e.currentTarget.id);
  };

  return (
    <div
      className={`${
        open ? " lg:w-[200px]" : "lg:w-[70px]"
      } min-h-screen bg-[#14213D] transition-all duration-300`}
      id="sidebar"
    >
      {/* Tab icons */}
      <div className="hidden lg:flex lg:flex-col items-center lg:space-y-10 lg:p-4">
        {/* Top icon */}
        <div className="hidden xl:flex">
          <button
            className="sidebarbtn duration-300 flex gap-9"
            title="Open"
            onClick={handleSidebarButton}
          >
            <Bars3BottomLeftIcon
              className="h-7 w-7 rounded-xl hover:transition hover:text-[#4F4A56]"
              id="extendButton"
            />
            {open && (
              <span
                className={`origin-center text-lg duration-300 ${
                  !open && "scale-0"
                }`}
              ></span>
            )}
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
        <div
          className="fixed bottom-4 hover:transition hover:text-[#4F4A56]"
          id="settingsButton"
        >
          <Link href="/dashboard/settings">
            <button
              className="sidebarbtn"
              title="Settings"
              onClick={handleTabChange}
            >
              <EllipsisHorizontalIcon />
              <span className="invisible">gomb</span> {/* valami bug */}
            </button>
          </Link>
        </div>
        {/* Kijelentkezés */}
        <div
          className="fixed bottom-0 hover:transition hover:text-[#4F4A56]"
          id="settingsButton"
        >
          <Link href="/">
            <button
              className="sidebarbtn"
              title="Kijelentkezés"
              onClick={logout}
            >
              <ArrowLeftStartOnRectangleIcon />
              <span className="invisible">gomb</span> {/* valami bug */}
            </button>
          </Link>
        </div>
      </div>
      {/* On mobile devices*/}
      <MobileSidebar />
    </div>
  );
};

export default Sidebar;
