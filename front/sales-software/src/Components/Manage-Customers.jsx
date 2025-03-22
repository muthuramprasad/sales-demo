import React, { useState } from "react";

import { Col, Row, Input, Space, Table, Button, Drawer, Select,Form,Popconfirm ,theme,Avatar, List,DatePicker  } from "antd";
const { TextArea } = Input;
const { RangePicker } = DatePicker;


const onOk = (value) => {
  console.log('onOk: ', value);
};

const ManageCustomers = () => {
  const [open, setOpen] = useState(false);
 
  const [size, setSize] = useState();


  const showLargeDrawer = () => {
    setSize('large');
    setOpen(true);
  };



// chat box 

const { token } = theme.useToken();
const [chatopen, setChatopen] = useState(false);


const showNotesDrawer = () => {
  setChatopen(true);
};
const onClose = () => {
  setChatopen(false);
};



  // Sample Data
  const dataSource = [
    {
      key: "1",
      name: "Mike",
      age: 32,
      address: "10 Downing Street",
    },
    {
      key: "2",
      name: "John",
      age: 42,
      address: "10 Downing Street",
    },
    {
      key: "3",
      name: "Kane",
      age: 42,
      address: "10 Downing Street",
    },
  ];

  // Define Columns
  const columns = [
    {
      title: "S.NO",
      dataIndex: "key",
      key: "sno",
      render: (text, record, index) => index + 1, // Automatically generate serial numbers
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    
    {
      title: "Action",
      key: "action",
      render: () => (
        <Space size="middle">
   <Button type="link" variant="solid" cyan>
              Convert To Customers
            </Button>

          <Button type="link"  onClick={showLargeDrawer}>Edit</Button>

          <Popconfirm
            title="Are you sure you want to delete?"
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];





  // Notes 


  const data = [
    {
      title: 'Ant Design Title 1',
    },
    {
      title: 'Ant Design Title 2',
    },
    {
      title: 'Ant Design Title 3',
    },
    {
      title: 'Ant Design Title 4',
    },
  ];


  
  return (
    <div>
    

    

     


      <Row gutter={[16, 16]}>
        <Col md={12} lg={12}>
          <Input placeholder="Search here..." />
        </Col>
        <Col md={12} lg={12}>
          <Space style={{ width: "100%", marginLeft: "20px" }}>
          
          </Space>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{marginTop:'20px'}}>
        <Col md={6} lg={6} style={{marginBottom:'20px'}}>
        <RangePicker
        style={{width:'100%'}}
      showTime={{
        format: 'HH:mm',
      }}
      format="YYYY-MM-DD HH:mm"
      onChange={(value, dateString) => {
        console.log('Selected Time: ', value);
        console.log('Formatted Selected Time: ', dateString);
      }}
      onOk={onOk}
    />
        </Col>
        <Col md={12} lg={12}>
          <Space  style={{display:'flex' ,justifyContent:"flex-start"}}>
          <Button type="primary">Filter</Button>
          <Button type="primary">Clear Filter</Button>
          </Space>
        </Col>
      </Row>

      <Row>
        <Col md={24} sm={24}>
          <Table
            dataSource={dataSource}
            columns={columns}
            style={{ marginTop: "25px",overflowX:'auto' }}
            pagination={{ pageSize: 5 }}
          />
        </Col>
      </Row>


      


{/* Edit  Customers Drawer */}
      <Row>
        <Col md={24} sm={24}>
          <Drawer
            closable
            destroyOnClose
            title={<p>Edit Customers</p>}
            placement="right"
            open={open}
       
            onClose={() => setOpen(false)}
          >
          
          <Row>
            <Col md={24} sm={24}>
  <Input 
        placeholder="First Name" 
  style={{marginBottom:'10px'}}
     className="input-bottom"
      />
            </Col>
            <Col md={24} sm={24} >
            <Input 
        placeholder="Second Name" 
       className="input-bottom"
     
      />
            </Col>

{/* 2nd line */}
<Col md={24} sm={24}>
  <Input 
        placeholder=" Email ID" 
        style={{marginBottom:'10px'}}
      className="input-bottom"
      />
            </Col>
            <Col md={24} sm={24} >
            <Input 
        placeholder="Phone Number" 
       className="input-bottom"
     
      />
            </Col>



            {/* 3nd line */}
<Col md={24} sm={24}>
  <Input 
        placeholder=" company Name" 
        style={{marginBottom:'10px'}}
      className="input-bottom"
      />
            </Col>
            <Col md={24} sm={24} >
            <Input 
        placeholder="Business Name" 
       className="input-bottom"
     
      />
            </Col>


                  {/* 4th line */}
<Col md={24} sm={24}>
<Select
     
        placeholder="Select Source"
        style={{ width: "100%"}}
     className="input-bottom"
      >
        <Select.Option value="facebook">Facebook</Select.Option>
        <Select.Option value="instagram">Instagram</Select.Option>
        <Select.Option value="linkedIn">LinkedIn</Select.Option>
      </Select>
 </Col>

        

                            {/* 5th line */}


                            <Col md={24} sm={24}>
<Select
     
     placeholder="Work Assigned to"
     style={{ width: "100%",marginTop:'15px'}}
  className="input-bottom"
   >
     <Select.Option value="karthik">karthik</Select.Option>
     <Select.Option value="ram">ram</Select.Option>
  
   </Select>
            </Col>

<Col md={24} sm={24}>
<Select
     
     placeholder="Customers Status"
     style={{ width: "100%",marginTop:'15px'}}
  className="input-bottom"
   >
     <Select.Option value="hot">Hot</Select.Option>
     <Select.Option value="warm">Warm</Select.Option>
     <Select.Option value="cold">Cold</Select.Option>
  
   </Select>
            </Col>
      <Space style={{marginTop:'15px',width:'100%'}}>

      <Form.Item label={null}>
      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form.Item>
      </Space>
     

          </Row>
          </Drawer>
        </Col>

      </Row>


{/* Drawer */}
<Row>
  <Col md={24} sm={24}>



  
  </Col>
</Row>
      <Drawer
        title="Basic Drawer"
        placement="right"
        closable={false}
        onClose={onClose}
        open={chatopen}
        getContainer={false}
      >

 <List
    itemLayout="horizontal"
    dataSource={data}
    renderItem={(item) => (
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar src={`https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png`} />}
          title={item.title}
          description="Ant Design, a design language for background applications, is refined by Ant UED Team"
        />
      </List.Item>
      
    )}
  />
        <TextArea rows={4} />
        <Button type="primary" style={{marginTop:'10px '}}>Send</Button> 
      </Drawer>


    </div>
  );
};

export default ManageCustomers;
