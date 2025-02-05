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
import React, { JSX, useContext, useEffect, useState } from "react";
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

  const [newReviewsCount, setNewReviewsCount] = useState<number>(0); //Reviewok megjelenítéséhez állapot

  const tabs: Array<Tab> = [
    //Külön komponensbe majd
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
  const [activeTab, setActiveTab] = React.useState<string>();

  const handleSidebarButton = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (!user || !user.business) {
      return;
    }
    // Fetch the pub data and reviews count from getAdminPub endpoint
    fetch(`/api/getAdminPub?adminId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        setNewReviewsCount(data.reviewsCount || 0); // Set reviews count
      })
      .catch((error) => console.error("Error fetching pub data:", error));
  }, [user]);

  useEffect(() => {
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
        {/* Reviews tab with notification */}
        <div className="relative">
          <Link href="/dashboard/reviews">
            <button
              className="sidebarbtn"
              title="Reviews"
              onClick={handleTabChange}
            >
              <ChatBubbleBottomCenterTextIcon />
              <span className="invisible">gomb</span>
            </button>
          </Link>
          {newReviewsCount > 0 && (
            <div className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {newReviewsCount}
            </div>
          )}
        </div>

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
              <span className="invisible">gomb</span>
            </button>
          </Link>
        </div>
        {/* Logout button */}
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
              <span className="invisible">gomb</span>
            </button>
          </Link>
        </div>
      </div>
      {/* On mobile devices */}
      <MobileSidebar />
    </div>
  );
};

export default Sidebar;
