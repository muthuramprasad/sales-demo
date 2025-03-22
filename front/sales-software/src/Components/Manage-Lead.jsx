import React, { useState } from "react";

import { Col, Row, Input, Space, Table, Button, Drawer, Select,Form,Popconfirm ,Avatar, List,DatePicker  } from "antd";
const { TextArea } = Input;
const { RangePicker } = DatePicker;
import {  useCreateLeadMutation, useGetLeadsQuery, useUpdateLeadMutation, useDeleteLeadMutation} from "../Redux/LeadSlice";

import { useGetNotesByLeadQuery, useAddNoteToLeadMutation } from "../Redux/notes";


const ManageLead = () => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [size, setSize] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]); 
  const showLargeDrawer = () => {
    setSize('large');
    setOpen(true);
  };


  // Fetch Leads
  const { data: leads, refetch, isLoading } = useGetLeadsQuery({
    page: 1,
    itemsPerPage: 10,
    search: searchQuery,
    startDate: dateRange?.[0] ? dateRange[0].toISOString() : "", // Convert to ISO format
    endDate: dateRange?.[1] ? dateRange[1].toISOString() : "",  // Convert to ISO format
  });
  
  
  // Create, Update & Delete Mutations
  const [createLeadSlice] = useCreateLeadMutation();
  const [updateLead] = useUpdateLeadMutation();
  const [deleteLead] = useDeleteLeadMutation();


// craete  Lead form

const [createLead,setCreateLead]=useState({
   firstName:"",
  lastName:"",
  email:'',
  phone:"",
  company:'',
  address:'',
  landmark:'',
  pincode:'',
  businessName:'',
  source:'',
  leadStatus:'',
  assignedTo:'',


})




const handleChange=(e)=>{
  setCreateLead({ ...createLead, [e.target.name]: e.target.value });
}

const handleSelectChange = (name, value) => {
  setCreateLead({ ...createLead, [name]: value });
};

const handleCreateLeadSubmit = async () => {
  try {
    await createLeadSlice(createLead).unwrap();
    setOpen(false);
 
    refetch(); 
     // Reset form fields after submission
     setCreateLead({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      address: "",
      landmark: "",
      pincode: "",
      businessName: "",
      source: "",
      leadStatus: "",
      assignedTo: "",
    });
  } catch (err) {
    console.error("Failed to create lead:", err);
  }
};



const handleEditClick = (lead) => {
  setSelectedLead(lead);
  setCreateLead({
    firstName: lead.firstName || "",
    lastName: lead.lastName || "",
    email: lead.email || "",
    phone: lead.phone || "",
    company: lead.company || "",
    address: lead.address || "", // Ensure address is included
    landmark: lead.landmark || "",
    pincode: lead.pincode || "",
    businessName: lead.businessName || "",
    source: lead.source || "",
    leadStatus: lead.leadStatus || "",
    assignedTo: lead.assignedTo || "",
  });
  setEditOpen(true);
};

// Update Lead
const handleUpdateLead = async () => {
  try {
    await updateLead({ id: selectedLead._id, updatedLead: createLead }).unwrap();
    setEditOpen(false);
    refetch();
  } catch (err) {
    console.error("Failed to update lead:", err);
  }
};

// Delete Lead
const handleDeleteLead = async (id) => {
  try {
    await deleteLead(id).unwrap();
    refetch();
  } catch (err) {
    console.error("Failed to delete lead:", err);
  }
};
const handlePageChange = (page) => {
  setCurrentPage(page);
};


// chat box 


const [chatopen, setChatopen] = useState(false);
const [selectedLeadId, setSelectedLeadId] = useState(null);
const [noteContent, setNoteContent] = useState("");



  // Fetch notes with renamed refetch function to avoid conflict
  const { data: notesData, refetch: refetchNotes } = useGetNotesByLeadQuery(selectedLeadId, { skip: !selectedLeadId });
  const [addNote] = useAddNoteToLeadMutation();


   // Open Notes Drawer
   const showNotesDrawer = (leadId) => {
    setSelectedLeadId(null);  // Reset previous lead ID
    setTimeout(() => {
      setSelectedLeadId(leadId);  // Set new lead ID after state resets
      refetchNotes();  // Ensure it fetches fresh data
    }, 0);
    setChatopen(true);
  };
  

  // Close Notes Drawer
  const onClose = () => {
    setChatopen(false);
    setSelectedLeadId(null);
  };

  // Handle Note Submission
  const handleAddNote = async () => {
    if (!noteContent.trim()) return;

    try {
        console.log("Sending Note:", { leadId: selectedLeadId, noteContent });
        
        await addNote({ leadId: selectedLeadId, noteContent }).unwrap();

        setNoteContent("");
        refetchNotes(); // Refresh notes list
    } catch (error) {
        console.error("Error adding note:", error);
    }
};

  

  // Define Table Columns
 // Table Columns
 const columns = [
  {
    title: "S.NO",
    dataIndex: "sno",
    key: "sno",
  },
  { title: "Name", 
    dataIndex: "firstName", 
    key: "firstName" },
    
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Company",
    dataIndex: "company",
    key: "company",
  },
  {
    title: "Lead Status",
    dataIndex: "leadStatus",
    key: "leadStatus",
  },

  {
    title: "Follow up",
    dataIndex: "_id", // Use _id from the lead data
    key: "notes",
    render: (leadId) => (
      <Space size="middle">
        <Button type="link" onClick={() => showNotesDrawer(leadId)}>Notes</Button>
      </Space>
    ),
  },
  {
    title: "Action",
    key: "action",
    render: (record) => (
      <Space size="middle">
        <Button type="link" onClick={() => handleEditClick(record)}>Edit</Button>
        <Popconfirm title="Are you sure?" onConfirm={() => handleDeleteLead(record._id)}>
          <Button type="link" danger >Delete</Button>
        </Popconfirm>
      </Space>
    ),
  },
];


 // Define Current Page and Items Per Page
 const [currentPage, setCurrentPage] = useState(1);
 const itemsPerPage = 10;


 // Ensure leads exist before mapping
 const data = leads?.leads
 ? leads.leads.map((lead, index) => ({
     key: lead._id,
     sno: (currentPage - 1) * itemsPerPage + index + 1,
     firstName: lead.firstName || "N/A", // Corrected concatenation
     lastName: lead.lastName || "N/A", // Corrected concatenation
     email: lead.email || "N/A",
     phone: lead.phone || "N/A",
     company: lead.company || "N/A",
     address: lead.address || "N/A",
     landmark: lead.landmark || "N/A",
     businessName: lead.businessName || "N/A",
     source: lead.source || "N/A",
     assignedTo: lead.assignedTo || "N/A",
     pincode: lead.pincode || "N/A",
     leadStatus: lead.leadStatus || "N/A",
     _id: lead._id, 
 }))
 : [];

  
 const handleFilter = () => {
  
  refetch();
};

 // Clear Filter (Resets Date Range)
 const clearFilter = () => {
  setDateRange([]);
  setSelectedDates([]);
  refetch();
};

const handleDateChange = (value) => {
  if (value) {
    setSelectedDates([value[0].toISOString(), value[1].toISOString()]); // Convert dates to ISO format
  } else {
    setSelectedDates([]);
  }
};



  
  return (
    <div>
      <h1>Manage Lead</h1>

    

     


      <Row gutter={[16, 16]}>
        <Col md={12} lg={12}>
                <Input 
            placeholder="Search here..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)}
            onPressEnter={() => refetch({ page: currentPage, itemsPerPage, search: searchQuery })}
          />
        </Col>
        <Col md={12} lg={12}>
          <Space style={{ width: "100%", marginLeft: "20px" }}>
            <Button type="primary" size="large" onClick={showLargeDrawer}>
              Create Lead
            </Button>
          </Space>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{marginTop:'20px',marginBottom:'20px'}}>
      <Col md={6} lg={6}>
          <RangePicker
            style={{ width: "100%" }}
            showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD HH:mm"
            value={dateRange}
            onChange={(value) => setDateRange(value)}
          />
        </Col>
        <Col md={6} lg={6}>
          <Space>
            {/* <Button type="primary" onClick={handleFilter}>Filter</Button> */}
            <Button type="primary"  onClick={clearFilter}>Clear Filter</Button>
          </Space>
        </Col>
      </Row>

      <Row>
        <Col md={24} sm={24}>
               <Table
         columns={columns}
         dataSource={data}
         pagination={{
           current: currentPage,
           pageSize: itemsPerPage,
           total: leads?.pagination?.totalLeads|| 0,
           onChange: handlePageChange,
         }}
         loading={isLoading}
       />
        </Col>
      </Row>


      


{/* Create  Lead Drawer */}
      <Row>
        <Col md={24} sm={24}>
        {/* Create Lead Drawer */}
      <Drawer closable destroyOnClose title="Create Lead" placement="right" open={open} onClose={() => setOpen(false)}>
        <Form layout="vertical">
          <Form.Item ><Input name="firstName" placeholder="First Name" value={createLead.firstName} onChange={handleChange} /></Form.Item>
          <Form.Item ><Input name="lastName" placeholder="Last Name" value={createLead.lastName} onChange={handleChange} /></Form.Item>
          <Form.Item ><Input name="email" placeholder="Email" value={createLead.email} onChange={handleChange} /></Form.Item>
          <Form.Item ><Input name="phone" placeholder="Phone" value={createLead.phone} onChange={handleChange} /></Form.Item>
          <Form.Item ><Input name="company" placeholder="Company" value={createLead.company} onChange={handleChange} /></Form.Item>
          <Form.Item ><Input name="address" placeholder="Address" value={createLead.address} onChange={handleChange} /></Form.Item>
          <Form.Item ><Input name="landmark" placeholder="Landmark" value={createLead.landmark} onChange={handleChange} /></Form.Item>
          <Form.Item ><Input name="pincode" placeholder="Pincode" value={createLead.pincode} onChange={handleChange} /></Form.Item>
          <Form.Item ><Input name="businessName" placeholder="Business Name" value={createLead.businessName} onChange={handleChange} /></Form.Item>
          <Form.Item >
            <Select placeholder="Source" value={createLead.source} onChange={(value) => handleSelectChange("source", value)}>
              <Select.Option value="">Source</Select.Option>
              <Select.Option value="facebook">Facebook</Select.Option>
              <Select.Option value="instagram">Instagram</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="">
            <Select value={createLead.leadStatus} placeholder='Lead Status' onChange={(value) => handleSelectChange("leadStatus", value)}>
              <Select.Option value="">Lead Status</Select.Option>
              <Select.Option value="hot">Hot</Select.Option>
              <Select.Option value="warm">Warm</Select.Option>
              <Select.Option value="cold">Cold</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="">
            <Select value={createLead.assignedTo} placeholder='Assigned To' onChange={(value) => handleSelectChange("assignedTo", value)}>
              <Select.Option value="">Assigned To</Select.Option>
              <Select.Option value="karthik">Karthik</Select.Option>
              <Select.Option value="ram">Ram</Select.Option>
            </Select>
          </Form.Item>
          <Button type="primary" onClick={handleCreateLeadSubmit}>Submit</Button>
        </Form>
      </Drawer>
        </Col>

      </Row>

      <Row>
        <Col>
        {/* Edit Lead Drawer */}
<Drawer closable destroyOnClose title="Edit Lead" placement="right" open={editOpen} onClose={() => setEditOpen(false)}>
  <Form layout="vertical">
    <Form.Item label="">
      <Input name=" firstName" placeholder="Full Name" value={createLead.firstName} onChange={handleChange} />
    </Form.Item>
    <Form.Item label="">
      <Input name="lastName" placeholder="Last Name" value={createLead.lastName} onChange={handleChange} />
    </Form.Item>
    <Form.Item label="">
      <Input name="email" placeholder="Email" value={createLead.email} onChange={handleChange} />
    </Form.Item>
    <Form.Item label="">
      <Input name="phone" placeholder="Phone" value={createLead.phone} onChange={handleChange} />
    </Form.Item>
    <Form.Item label="">
      <Input name="company" placeholder="Company" value={createLead.company} onChange={handleChange} />
    </Form.Item>
    <Form.Item label="">
      <Input name="address" placeholder="Address" value={createLead.address} onChange={handleChange} />
    </Form.Item>
    <Form.Item label="">
      <Input name="landmark" placeholder="Landmark" value={createLead.landmark} onChange={handleChange} />
    </Form.Item>
    <Form.Item label="">
      <Input name="pincode" placeholder="Pincode" value={createLead.pincode} onChange={handleChange} />
    </Form.Item>
    <Form.Item label="">
      <Input name="businessName" placeholder="Business Name" value={createLead.businessName} onChange={handleChange} />
    </Form.Item>
    <Form.Item label="">
      <Select value={createLead.source} onChange={(value) => handleSelectChange("source", value)}>
        <Select.Option value="">Select Source</Select.Option>
        <Select.Option value="facebook">Facebook</Select.Option>
        <Select.Option value="instagram">Instagram</Select.Option>
        <Select.Option value="linkedIn">LinkedIn</Select.Option>
      </Select>
    </Form.Item>
    <Form.Item label="">
      <Select value={createLead.leadStatus} onChange={(value) => handleSelectChange("leadStatus", value)}>
      <Select.Option value="">Select Status</Select.Option>
        <Select.Option value="hot">Hot</Select.Option>
        <Select.Option value="warm">Warm</Select.Option>
        <Select.Option value="cold">Cold</Select.Option>
      </Select>
    </Form.Item>
    <Form.Item label="">
      <Select value={createLead.assignedTo} onChange={(value) => handleSelectChange("assignedTo", value)}>
      <Select.Option value="">Assigned To</Select.Option>

        <Select.Option value="karthik">Karthik</Select.Option>
        <Select.Option value="ram">Ram</Select.Option>
      </Select>
    </Form.Item>
    <Button type="primary" onClick={handleUpdateLead}>Update</Button>
  </Form>
</Drawer>

        </Col>
      </Row>


{/* Drawer */}
<Row>
 
</Row>
<Drawer title="Lead Notes" placement="right" onClose={onClose} open={chatopen}>
<List
  itemLayout="horizontal"
  dataSource={notesData?.notes || []} // Ensure empty array if no data
  renderItem={(item) => (
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png" />}
        title="Note"
        description={item.notes}
      />
    </List.Item>
  )}
/>

        <TextArea rows={4} value={noteContent} onChange={(e) => setNoteContent(e.target.value)} />
        <Button type="primary" onClick={handleAddNote} style={{ marginTop: "10px" }}>
          Send
        </Button>
      </Drawer>


    </div>
  );
};

export default ManageLead;
