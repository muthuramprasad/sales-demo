import React, { useState } from "react";
import {
  Col,
  Row,
  Input,
  Button,
  ConfigProvider,
  Space,
  Drawer,
  Select,
  Table,
  Tag,
  Switch,
  Popconfirm ,
  message
} from "antd";
import { QuestionCircleOutlined } from '@ant-design/icons';
import { PlusOutlined } from "@ant-design/icons";
import { useCreateUserMutation, useGetUsersQuery,useUpdateUserMutation, useDeleteUserMutation  } from "../Redux/CreateUserSlice";







const CreateUsers = () => {
  const [open, setOpen] = useState(false);
  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showActive, setShowActive] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchQuery, setSearchQuery] = useState("");
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    status: "",
  });

  

  const [createUser] = useCreateUserMutation();
  const { data: users, refetch, isLoading } = useGetUsersQuery({
    page: currentPage,
    itemsPerPage,
    search: searchQuery, // Pass searchQuery to API
  });

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await createUser(userData).unwrap(); 
      refetch();
      setOpen(false);
    } catch (error) {
      console.error("Failed to create user:", error);
    }
  };
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

   // Delete User

  

   function cancel(e){
    console.log(e);
    message.success('Click on No');
   }

   const handleDelete = async (id) => {
    try {
        if (!id || typeof id !== "string") {
            console.error("Invalid ID for deletion:", id);
            return;
        }
        await deleteUser(id).unwrap(); // Remove `{}` and pass `id` as a string
        refetch();
    } catch (error) {
        console.error("Delete Failed:", error);
    }
};


     // Update  User

     const handleUpdate = async () => {
      if (!editingUser?._id) {
        console.error("Invalid user ID for update:", editingUser);
        return;
      }
      try {
        // Ensure password is only sent if it is updated
        const updatedData = { 
          name: editingUser.name, 
          email: editingUser.email, 
          phone: editingUser.phone,
          password:editingUser.password, 
          status: editingUser.status, 
          role: editingUser.role 
        };
    
        if (editingUser.password) {
          updatedData.password = editingUser.password;
        }
    
        await updateUser({ id: editingUser._id, updatedUser: updatedData }).unwrap();
        refetch(); 
        setOpenEdit(false);
      } catch (error) {
        console.error("Update Failed:", error);
      }
    };
    
  



  // Open Edit Drawer
  const showDrawerEdit = (user) => {
    setEditingUser({
      ...user,
      phone: user.phone || "", // Ensure phone number is populated
      password: "", // Always keep password empty for security reasons
    });
    setOpenEdit(true);
  };
  
  
  const onCloseEdit = () => {
    setEditingUser(null);
    setOpenEdit(false);
  };

  //  Function to Toggle Active Users
  const toggleActiveUsers = (checked) => {
    setShowActive(checked);
  };



 
  const columns = [
    { title: "S.NO", dataIndex: "sno", key: "sno", render: (_, __, index) => index + 1 },
    { title: "Name", dataIndex: "name", key: "name", render: (text) => <strong>{text}</strong> },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "volcano"}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
        <Button type="link" onClick={() => showDrawerEdit(record)}>Edit</Button>


        <Popconfirm 
  title="Are you sure delete ?" 
  onConfirm={() => handleDelete(record._id)} 
  onCancel={cancel} 
  okText="Yes" 
  cancelText="No"
>
  <Button type="link" danger>Delete</Button>
</Popconfirm>


      
     
      </Space>
      ),
    },
  ];

  //  Corrected Sample Table Data
// Map fetched user data to table format
const data = users?.users?.map((user, index) => ({
  key: user._id,
  sno: (currentPage - 1) * itemsPerPage + index + 1,
  name: user.name,
  email: user.email,
  phone:user.phone,
  role: user.role,
  status: user.status,
  _id: user._id, // Ensure _id is included
})) || [];

  return (
    <div>
      <h1>Create Users</h1>
      <Row gutter={[16, 16]} justify="start" align="middle">
        <Col xs={24} sm={18} md={12} lg={12} xl={10} xxl={8}>
        <Input 
  placeholder="Search here..." 
  value={searchQuery} 
  onChange={(e) => setSearchQuery(e.target.value)}
  onPressEnter={() => refetch({ page: currentPage, itemsPerPage, search: searchQuery })}
/>

        </Col>
        <Col xs={24} sm={18} md={8} lg={6} xl={5} xxl={4}>
          <ConfigProvider>
            <Space
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "start",
              }}
            >
              <Button
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={showDrawer}
              >
                Create Users
              </Button>
            </Space>
          </ConfigProvider>
        </Col>
      </Row>

      {/*  Create User Drawer */}
      <Drawer title="Create User" onClose={onClose} open={open}>
        <Input name="name" placeholder="Name" onChange={handleChange}  style={{marginBottom:'15px'}}/>
        <Input name="email" placeholder="Email" onChange={handleChange}   style={{marginBottom:'15px'}}/>
        <Input name="password" placeholder="Password" type="password" onChange={handleChange}   style={{marginBottom:'15px'}}/>
        <Input name="phone" placeholder="Phone" onChange={handleChange}   style={{marginBottom:'15px'}}/>
        <Select
          name="role"
          
          placeholder="Select a Role"
          style={{ width: "100%",marginBottom:'15px' }}
          onChange={(value) => setUserData({ ...userData, role: value })}
        >
          <Select.Option value="superadmin">Super Admin</Select.Option>
          <Select.Option value="user">User</Select.Option>
          
        </Select>

        <Select
          name="status"
          
          placeholder="Select a status"
          style={{ width: "100%",marginTop:'15px' }}
          onChange={(value) => setUserData({ ...userData, status: value })}
        >
          <Select.Option value="active">Active</Select.Option>
          <Select.Option value="inactive">Iactive</Select.Option>
        
        </Select>
        <Button type="primary"  style={{marginTop:'25px'}} onClick={handleSubmit}>Submit</Button>
      </Drawer>






      {/*  Edit User Drawer */}
      <Drawer title="Edit User" onClose={onCloseEdit} open={openEdit}>
  <Row gutter={[16, 16]}>
    <Col span={24}>
      <Input 
        placeholder="Name" 
        value={editingUser?.name || ""} 
        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
      />
    </Col>
    <Col span={24}>
      <Input 
        placeholder="Email" 
        value={editingUser?.email || ""} 
        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
      />
    </Col>
    <Col span={24}>
      <Input 
        placeholder="Phone" 
        value={editingUser?.phone || ""} 
        onChange={(e) => setEditingUser({ ...editingUser, phone: e.target.value })}
      />
    </Col>
 
    <Col span={24}>
      <Select
        value={editingUser?.role || ""}
        placeholder="Select Role"
        style={{ width: "100%", marginBottom: "20px", marginTop: "15px" }}
        onChange={(value) => setEditingUser({ ...editingUser, role: value })}
      >
        <Select.Option value="superadmin">Super Admin</Select.Option>
        <Select.Option value="editor">Editor</Select.Option>
        <Select.Option value="user">User</Select.Option>
      </Select>
    </Col>
    <Col span={24}>
      <Select
        value={editingUser?.status || ""}
        placeholder="Select Status"
        style={{ width: "100%", marginBottom: "20px", marginTop: "15px" }}
        onChange={(value) => setEditingUser({ ...editingUser, status: value })}
      >
        <Select.Option value="active">Active</Select.Option>
        <Select.Option value="inactive">Inactive</Select.Option>
      </Select>
    </Col>
  </Row>
  <br />
  <Row gutter={[16, 16]}>
    <Col span={24}>
      <Button type="primary" size="large" onClick={handleUpdate}>Update</Button>
    </Col>
  </Row>
</Drawer>





      {/*  Active Users Filter */}
      <Row style={{ marginTop: "20px" }} align="middle">
        <Col>
          <Switch checked={showActive} onChange={toggleActiveUsers} />
          <span style={{ marginLeft: "10px" }}>
            {showActive ? "Showing Active Users" : "Showing All Users"}
          </span>
        </Col>
      </Row>

      {/*  Fixed Table Display */}
      <Row style={{ marginTop: "50px" }}>
        <Col span={24}>
         <Table
  columns={columns}
  dataSource={data}
  pagination={{
    current: currentPage,
    pageSize: itemsPerPage,
    total: users?.pagination?.totalUsers || 0,
    onChange: handlePageChange,
  }}
  loading={isLoading}
/>

        </Col>
      </Row>
    </div>
  );
};

export default CreateUsers;
