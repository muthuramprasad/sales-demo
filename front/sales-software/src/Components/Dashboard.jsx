import React, { useState } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import { Outlet, useNavigate } from "react-router-dom";

const { Header, Sider, Content } = Layout;
import { Breadcrumb } from "antd";

import { Link, useLocation } from 'react-router-dom';
import { Progress } from "antd";
import PageProgressBar from "../Extra/PageProgressBar";




const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate(); // Navigation function

  const handleLogout = () => {
    console.log("User Logged Out");
    navigate("/"); // Redirects to login page
  };

  const location=useLocation()
  const pathSegments=location.pathname.split('/').filter(Boolean); 

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const url = `/${pathSegments.slice(0, index + 1).join("/")}`;

    return {
      title: <Link to={url}>{segment.replace("-", " ")}</Link>,
    };
  })




  
  return (
    <Layout style={{ minHeight: "100vh" }}>
       {/* Page Load Progress Bar */}
       <PageProgressBar />

{/* Rest of your Dashboard Code */}
      {/* Fixed Sidebar */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          position: "fixed",
          height: "100vh",
          left: 0,
          top: 0,
          bottom: 0,
          overflow: "auto",
          zIndex: 1000,
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]} // ✅ Dynamically update active menu item
          onClick={({ key }) => navigate(key)} // Navigate on click
          items={[
            {
              key: "/dashboard",
              icon: <UserOutlined />,
              label: "Dashboard",
            },
            {
              key: "/dashboard/manage-lead",
              icon: <UserOutlined />,
              label: "Manage Lead",
            },
            {
              key: "/dashboard/Manage-Customers",
              icon: <UserOutlined />,
              label: "Manage Customers",
            },
           
            {
              key: "/dashboard/Create-user",
              icon: <UserOutlined />,
              label: "Create User",
            },
            {
              key: "/dashboard/quotation",
              icon: <UserOutlined />,
              label: "Manage Quotation",
            },
            {
              key: "/dashboard/invoice",
              icon: <UserOutlined />,
              label: "Invoice",
            },
            {
              key: "/dashboard/Payment",
              icon: <UserOutlined />,
              label: "Payment",
            },
          ]}
        />
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 200,
          transition: "margin 0.2s ease",
        }}
      >
        {/* Fixed Header */}
        <Header
          style={{
            position: "fixed",
            width: `calc(100% - ${collapsed ? 80 : 200}px)`,
            zIndex: 1000,
            padding: "0 16px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
            transition: "width 0.2s ease",
          }}
        >
          {/* Sidebar Toggle Button */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />

          {/* Dashboard Title */}
          <h3 style={{ margin: 0, flex: 1, textAlign: "center" }}>Dashboard</h3>

          {/* Logout Button on Right */}
          <Button
            type="primary"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
            danger
          >
            Logout
          </Button>
        </Header>

        {/* Content Area (with padding for fixed header) */}
        <Content
          style={{
            margin: "80px 16px 24px", // Margin added for fixed header
            padding: 24,
            minHeight: "calc(100vh - 80px)", // Ensures content takes full height
            background: colorBgContainer,
            overflowY: "auto", // Allows scrolling inside content
            borderRadius: 8,
          }}
        >
         {/* Breadcrumb */}
         <Breadcrumb style={{ marginBottom: "16px",textTransform:'uppercase',fontWeight:'bold' }} items={[ ...breadcrumbItems]} />

          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
