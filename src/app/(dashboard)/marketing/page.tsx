"use client";
import UserContext from "@/context/userContext";
import { apiGet } from "@/helpers/axiosRequest";
import React, { useContext, useEffect, useState } from "react";
import { MarketingList } from "./components/MarketingList";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";




const page = () => {
  const context = useContext(UserContext);
  const labelId = context?.user?._id ?? "";
  const [marketingData, setMarketingData] = useState([])

  const fetchMarketingDetails = async () => {
    try {
      const response = await apiGet(`/api/marketing/get?labelId=${labelId}`);
      console.log("response : ");
      console.log(response);
      if (response.success) {
          setMarketingData(response.data)
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (labelId) {
      fetchMarketingDetails();
    }
  }, [labelId]);

  return (    <div className="w-full min-h-screen p-6 bg-white rounded-sm">
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink>Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Marketing</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>

    <h1 className="text-3xl font-bold mb-4 mt-5 text-blue-600">
      All marketings
    </h1>


  <MarketingList data={marketingData} />


  </div>);
};

export default page;
