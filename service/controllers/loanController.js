import Installment from "../models/InstallmentModel.js";
import Loan from "../models/loanModel.js";
import asyncHandler from "express-async-handler";

// Create a Loan
export const createLoan = asyncHandler(async (req, res) => {
  const {
    location,
    customerCode,
    LoanCode,
    loanDuration,
    ofInstallments,
    guarantorCode,
    areaId,
    collectWeek,
    collectDay,
    loanAmount,
    interestRate,
    startDate,
    endDate,
    description,
    status,
    loanCode,
  } = req.body;

  try {
    const newLoan = await Loan.create({
      location: location || undefined,
      customerCode: customerCode || undefined,
      LoanCode: LoanCode || undefined,
      loanDuration: loanDuration || undefined,
      ofInstallments: ofInstallments || undefined,
      areaId: areaId || undefined,
      collectWeek: collectWeek || undefined,
      collectDay: collectDay || undefined,
      loanAmount: loanAmount || undefined,
      interestRate: interestRate || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      description: description || undefined,
      status: status || undefined,
      guarantorCode: guarantorCode || undefined,
      loanCode: loanCode || undefined,
    });

    if(loanAmount && ofInstallments && interestRate){
      let AmountPerInstallment;
      AmountPerInstallment = ((Number(loanAmount) * Number(interestRate) / 100) + Number(loanAmount)) / Number(ofInstallments);
      for (let i = 1; i <= ofInstallments; i++) {
        const installment = new Installment({
          loanId: newLoan._id,
          date: startDate,
          balance: AmountPerInstallment.toFixed(2),
          collectedDate: startDate,
          status: "Pending",
        });
      const newInstallment =  await installment.save();
      // console.log(newInstallment);
      }
    }




    return res
      .status(201)
      .json({
        success: true,
        message: "Loan created successfully",
        Loan: newLoan,
      });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern.loanCode) {
      res
        .status(400)
        .json({ success: false, message: "Loan code already exists" });
    } else {
      res.status(500).json({ success: false, message: error.message });
    }
  }
});

export const getALoan = asyncHandler(async (req, res) => {
  try {
    const LoanData = await Loan.findById(req.params.id)
      .populate("customerCode")
      .populate("guarantorCode")
      .populate("areaId");
    if (LoanData) {
      return res
        .status(200)
        .json({
          success: true,
          message: "Loan fetched successfully",
          Loan: LoanData,
        });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Loan not found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// Get all Loans
export const getAllLoans = asyncHandler(async (req, res) => {
  try {
    const {
      location,
      customerCode,
      LoanCode,
      status,
      guarantorCode,
      areaId,
      minLoanAmount,
      maxLoanAmount,
      sortBy = "createdAt",
      sortOrder = "desc",
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};
    if (location) filter.location = location;
    if (customerCode) filter.customerCode = customerCode;
    if (LoanCode) filter.LoanCode = LoanCode;
    if (status) filter.status = status;
    if (guarantorCode) filter.guarantorCode = guarantorCode;
    if (areaId) filter.areaId = areaId;
    if (minLoanAmount || maxLoanAmount) {
      filter.loanAmount = {};
      if (minLoanAmount) filter.loanAmount.$gte = Number(minLoanAmount);
      if (maxLoanAmount) filter.loanAmount.$lte = Number(maxLoanAmount);
    }

    const sortOptions = { [sortBy]: sortOrder === "asc" ? 1 : -1 };

    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const skip = (pageNumber - 1) * pageSize;

    const totalLoans = await Loan.countDocuments(filter);

    const Loans = await Loan.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(pageSize)
      .populate("customerCode")
      .populate("guarantorCode");

    return res.status(200).json({
      success: true,
      totalLoans,
      currentPage: pageNumber,
      totalPages: Math.ceil(totalLoans / pageSize),
      loans: Loans,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export const updateLoan = asyncHandler(async (req, res) => {
  const {
    location,
    customerCode,
    LoanCode,
    loanDuration,
    ofInstallments,
    guarantorCode,
    areaId,
    collectWeek,
    collectDay,
    loanAmount,
    interestRate,
    startDate,
    endDate,
    description,
    loanCode,
    reminderDescription,
  } = req.body;

  try {
    const LoanData = await Loan.findById(req.params.id);

    if (LoanData) {
      LoanData.location = location || LoanData.location;
      LoanData.customerCode = customerCode || LoanData.customerCode;
      LoanData.loanCode = LoanCode || LoanData.loanCode;
      LoanData.loanDuration = loanDuration || LoanData.loanDuration;
      LoanData.ofInstallments = ofInstallments || LoanData.ofInstallments;
      LoanData.guarantorCode = guarantorCode || LoanData.guarantorCode;
      LoanData.areaId = areaId || LoanData.areaId;
      LoanData.collectWeek = collectWeek || LoanData.collectWeek;
      LoanData.collectDay = collectDay || LoanData.collectDay;
      LoanData.loanAmount = loanAmount || LoanData.loanAmount;
      LoanData.interestRate = interestRate || LoanData.interestRate;
      LoanData.startDate = startDate || LoanData.startDate;
      LoanData.endDate = endDate || LoanData.endDate;
      LoanData.description = description || LoanData.description;
      LoanData.status = LoanData.status;
      LoanData.loanCode = loanCode || LoanData.loanCode;
      LoanData.reminderDescription =
        reminderDescription || LoanData.reminderDescription;

      const updatedLoan = await LoanData.save();
      return res
        .status(200)
        .json({
          success: true,
          message: "Loan updated successfully",
          Loan: updatedLoan,
        });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Loan not found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export const deleteLoan = asyncHandler(async (req, res) => {
  try {
    const Loan = await Loan.findById(req.params.id);
    if (Loan) {
      await Loan.remove();
      return res
        .status(200)
        .json({ success: true, message: "Loan removed successfully" });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Loan not found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export const actionLoan = asyncHandler(async (req, res) => {
  const { description, status, imageUrl } = req.body;

  try {
    const LoanData = await Loan.findById(req.params.id);

    if (LoanData) {
      LoanData.action.description =
        description || LoanData.action.description || undefined;
      LoanData.action.status = status || LoanData.action.status || undefined;
      LoanData.action.imageUrl =
        imageUrl || LoanData.action.imageUrl || undefined;
      LoanData.status = status || LoanData.status || undefined;
      const actionLoan = await LoanData.save();

      return res
        .status(200)
        .json({
          success: true,
          message: "Loan action updated successfully",
          Loan: actionLoan,
        });
    } else {
      return res
        .status(404)
        .json({ success: false, message: "Loan not found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export const getReminderLoan = asyncHandler(async (req, res) => {
  const { endDate, page = 1, limit = 20 } = req.query;
  try {
    const pageNumber = Number(page);
    const pageSize = Number(limit);
    const skip = (pageNumber - 1) * pageSize;
    const filter = {};
    if (endDate) {
      filter.endDate = { $lt: new Date(endDate) };
    }
    filter.status = "Approved";

    const ReminderLoan = await Loan.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize);
    const totalRecords = await Loan.countDocuments(filter);

    return res.status(200).json({
      success: true,
      totalPages: Math.ceil(totalRecords / pageSize),
      loans: ReminderLoan,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});
