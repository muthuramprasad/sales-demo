import React, { useState } from "react";
import { Space, Table, Tag, Input, DatePicker, Button } from "antd";
import { useGetAllNotesQuery } from "../Redux/notes";

const { Search } = Input;
const { RangePicker } = DatePicker;

const NotesTable = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
   const [currentPage, setCurrentPage] = useState(1);
  const [selectedDates, setSelectedDates] = useState([]); 
  const [dateRange, setDateRange] = useState([]); // Stores selected date range
  const itemsPerPage = 5;
  // Fetch notes with search and date filtering
  const { data, isLoading, refetch } = useGetAllNotesQuery({
    page,
    itemsPerPage: 5,
    searchQuery: searchQuery.trim() || "",
    startDate: dateRange?.[0] ? dateRange[0].toISOString() : "",
    endDate: dateRange?.[1] ? dateRange[1].toISOString() : "",
  });
  

  // Notes Data
  const notesData = data?.notes || [];

  // Handle Filter Button Click
  // Clear Filter (Resets Date Range)
  const clearFilter = () => {
    setDateRange([]);
    setSelectedDates([]);
    refetch();
  };
  
  
  const handleReset = () => {
    setSearchQuery("");
    setDateRange([]);
    refetch();
  };
  

  // Table Columns
  const columns = [
    {
      title: "S.NO",
      dataIndex: "sno",
      key: "sno",
    },
    {
      title: "Lead Name",
      dataIndex: "leadName",
      key: "leadName",
    },
    {
      title: "Business Name",
      dataIndex: "businessName",
      key: "businessName",
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
    },
    {
      title: "Date Created",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Tags",
      key: "tags",
      dataIndex: "tags",
      render: (_, { tags }) => (
        <>
          {tags &&
            tags.map((tag) => (
              <Tag color={tag.length > 5 ? "red" : "green"} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            ))}
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Notes Table</h2>

      {/* Search & Date Filters */}
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search Lead Name or Business Name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onPressEnter={() => refetch({ page: currentPage, itemsPerPage, search: searchQuery })}
          style={{ width: "300px" }}
        />

<RangePicker
            style={{ width: "100%" }}
            showTime={{ format: "HH:mm" }}
            format="YYYY-MM-DD HH:mm"
            value={dateRange}
            onChange={(value) => setDateRange(value)}
          />

      <Button type="primary"  onClick={clearFilter}>Clear Filter</Button>

    
      </Space>

      {/* Notes Table */}
      <Table
        columns={columns}
        dataSource={notesData.map((note, index) => ({
          key: note._id,
          sno: index + 1 + (page - 1) * 5,
          leadName: `${note.leadId?.firstName} ${note.leadId?.lastName}`,
          businessName: note.leadId?.businessName || "N/A",
          notes: note.notes,
          createdAt: new Date(note.createdAt).toLocaleDateString(), // Format date
          tags: note.tags || [],
        }))}
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: 5,
          total: data?.pagination?.totalNotes || 0,
          onChange: setPage,
        }}
      />
    </div>
  );
};

export default NotesTable;
