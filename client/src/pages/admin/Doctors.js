import React, { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import axios from "axios";
import { message, Table } from "antd";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const getDoctors = async () => {
    try {
      const res = await axios.get("/api/v1/admin/getAllDoctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setDoctors(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // handle account
  const handleAccountStatus = async (record, status) => {
    try {
      const res = await axios.post(
        "/api/v1/admin/changeAccountStatus",
        { doctorId: record._id, userId: record.userId, status: status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
        message.success(res.data.message);
        window.location.reload();
      }
    } catch (error) {
      message.error("Something Went Wrong");
    }
  };

  useEffect(() => {
    getDoctors();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => (
        <span>
          {record.firstName} {record.lastName}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => (
        <div className="d-flex">
          {record.status === "pending" ? (
            <button
              className="btn btn-success"

            //   if clicked, status will be approved
              onClick={() => handleAccountStatus(record, "approved")}
            >
              Approve
            </button>
          ) : (
            <button className="bg-blue-500 rounded-lg px-2 py-1 text-white font-semibold">Reject</button>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout>
      <h1 className="text-center font-semibold text-lg mb-3">All Doctors</h1>
      <Table columns={columns} dataSource={doctors} />
    </Layout>
  );
};

export default Doctors;