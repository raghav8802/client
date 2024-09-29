'use client'
import React, { useContext, useEffect, useState } from "react"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator, } from "@/components/ui/breadcrumb"

import { Button } from "@/components/ui/button"
import { Modal } from "@/components/Modal"
import toast from "react-hot-toast"
import UserContext from "@/context/userContext"
import { apiGet, apiPost } from "@/helpers/axiosRequest"
import { PaymentList } from "./components/PaymentList"
import { PaymentChart } from "./components/PaymentChart"
import { PayoutList } from "./components/PayoutList"



const Payments = () => {

  const context = useContext(UserContext) || null
  const labelId = context?.user?._id



  const [data, setData] = useState({
    amount: ""
  })

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [paymentData, setPaymentData] = useState()
  const [payout, setPayout] = useState()
  const [totalPayoutBalance, setTotalPayoutBalance] = useState(0)
  const [availableBalance, setAvailableBalance] = useState(0)


  const fetchPayments = async () => {
    try {
      const response = await apiGet(`/api/payments/getPayments?labelId=${labelId}`)
      console.log("payments data");
      console.log(response.data);
      
      
      if (response.success) {
        setPaymentData(response.data.payments)
        setTotalPayoutBalance(response.data.totalPayoutBalance)
        setAvailableBalance(response.data.totalBalance)
      }
      
    } catch (error) {
      console.log("error");
    }
  }

  const fetchPayOut = async () => {
    // 
    try {
      const response = await apiGet(`/api/payments/payout/getPayouts?labelId=${labelId}`)
      console.log("payout response");
      console.log(response);
      if (response.success) {
        setPayout(response.data)
      }
      
    } catch (error) {
      console.log("error");
    }


  }

useEffect(() => {
  
  if (labelId) {
    fetchPayments()
    fetchPayOut()
  }
}, [labelId])



  const handleSave = async () => {
    
    // Handle save logic here
    try {

      const response = await apiPost('/api/payments/payout/payoutRequest', { labelId, amount: data.amount, })

      setIsModalVisible(false);
      if (response.success) {
        toast.success(response.message)
        fetchPayOut()
      } else {
        console.log('success not pay');
        toast.error(response.message)
      }
      setData({ amount: ""})

    } catch (error) {
      toast.error("Internal server")
    }

  };



  const handleClose = () => {
    setIsModalVisible(false);
  };

  return (

    <div className="w-full min-h-[80dvh] p-6 bg-white rounded-sm ">

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink>
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Payments</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex justify-between items-center mt-3">
        <h3 className="text-3xl font-bold mb-2 text-blue-500" >All Earnings Details</h3>
        {
          availableBalance > 500 && (
            <Button onClick={() => setIsModalVisible(true)} >Request Payout</Button>
          )
        }
      </div>

    <div className="my-3">
      {
        paymentData && (
          <PaymentChart data={paymentData} totalPayout={totalPayoutBalance} 
          availableBalance={availableBalance}
           
          />
        )
      }
    </div>

      <div className="bg-white ">
        {
          paymentData && (
            <PaymentList data={paymentData} />
          )
        }

        {
          payout && (
            <PayoutList data={payout} />
          )
        }
      </div>

{/* Pay request modal  */}
      <Modal
        isVisible={isModalVisible}
        triggerLabel="Submit Request"
        title="Payout Request"
        onSave={handleSave}
        onClose={handleClose}
        description="Please update your bank details before requesting a payout."
      >
        <div className="grid grid-cols-12 gap-2">
          <div className="col-span-12">
            <label className="m-0">Amount</label>
            <input type="text"
              placeholder="Enter Amount"
              className="form-control"
              value={data.amount}
              onChange={(e) => setData({ ...data, amount: e.target.value })}
            />
          </div>
          
        </div>


      </Modal>



    </div>

  )
}

export default Payments