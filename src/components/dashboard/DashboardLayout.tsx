// components/layouts/DashboardLayout.tsx
import Head from "next/head";
import { ReactNode } from "react";
import Sidebar from "../dashboard/sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <>
      <Head>
        <title>KocsMate Dashboard</title>
        <meta name="title" content="KocsMate" />
        <meta name="description" content="KocsMate kocsmakereső app" />
        <meta charSet="utf-8" />
        <meta name="keywords" content="kocsmate" />
        <meta name="robots" content="all" />
        <meta httpEquiv="Content-Type" content="text/html;" />
        <meta name="viewport" content="initial-scale=1.0" />
        <meta name="language" content="English" />
      </Head>
      <div className="md:grid md:grid-flow-col" id="dashboard">
        <Sidebar />
        <main className="mx-4 flex flex-col lg:flex-row">{children}</main>
      </div>
    </>
  );
};

export default DashboardLayout;
