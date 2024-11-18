import asyncHandler from "express-async-handler";
import Installment from "../models/InstallmentModel.js";
import UserTask from "../models/userTaskModel.js";

// Create a Loan
export const createInstallment = asyncHandler(async (req, res) => {
  const {
    loanId,
    date,
    balance,
    description,
    collectedDate,
    status,
 
  } = req.body;
  try {
    const InstallmentData = await Installment.create({
      loanId: loanId || undefined,
      date: date || undefined,
      balance: balance || undefined,
      description: description || undefined,
      collectedDate: collectedDate || undefined,
      status: status || undefined,
     
    });

    if (!InstallmentData) {
      return res
        .status(400)
        .json({ success: false, message: "Installment not created" });
    }
    return res
      .status(201)
      .json({
        success: true,
        message: "Installment created successfully",
        InstallmentData,
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export  const updatedInstallment = asyncHandler(async (req, res) => {
  const { loanId, date, balance, description, collectedDate, status } = req.body;
  try {
    const InstallmentData = await Installment.findByIdAndUpdate(req.params.id , {
      loanId: loanId || undefined,
      date: date || undefined,
      balance: balance || undefined,
      description: description || undefined,
      collectedDate: collectedDate || undefined,
      status: status || undefined,
     
    });
    if (!InstallmentData) {
      return res
        .status(400)
        .json({ success: false, message: "Installment not updated" });
    }
    return res
      .status(201)
      .json({ success: true, message: "Installment updated successfully", InstallmentData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
      }
})

export const getInstallment = asyncHandler(async (req, res) => {
  try {
    const InstallmentData = await Installment.find({
      loanId: req.params.id,
      isDeleted: false
    });
    if (InstallmentData) {
      return res
        .status(200)
        .json({ success: true, message: "Installment fetched successfully", Installment: InstallmentData });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Installment not found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});


export const deleteInstallment = asyncHandler(async (req, res) => {
  try {
    const InstallmentData = await Installment.findById(req.params.id);  
    if (InstallmentData) {

      const userTask = await UserTask.findOneAndDelete({ installmentId: req.params.id });
      
      await InstallmentData.remove();
      return res
        .status(200)
        .json({ success: true, message: "Installment removed successfully" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Installment not found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
    }
)




export const getReminderInstallment = asyncHandler(async (req, res) => {
  const {  page = 1, limit = 20 } = req.query;
  try {
    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const skip = (pageNumber - 1) * pageSize;
    const filter = {};

    const currentSriLankaTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" });
    const sriLankaEndDate =  new Date(currentSriLankaTime);

   
      filter.date = { $lt: sriLankaEndDate };
    
    filter.status = { $in: ["Reminded", "Pending"] };

    const ReminderInstallment = await Installment.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize).populate("loanId")
      ;
    const totalRecords = await Installment.countDocuments(filter);

    return res.status(200).json({
      success: true,
      totalPages: Math.ceil(totalRecords / pageSize),
      Installment: ReminderInstallment,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});