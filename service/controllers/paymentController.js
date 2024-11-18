import expressAsyncHandler from "express-async-handler";
import Payment from "../models/payment.js";

export const createPayment = expressAsyncHandler(async (req, res) => {
  const { customerName, date, balance, loanId } = req.body;

  try {
    const payment = await Payment.create({
      customerName,
      date,
      balance,
      loanId,
    });
    if (payment) {
      return res.status(201).json({
        success: true,
        message: "Payment created successfully",
        payment,
      });
    }else{
        return res.status(400).json({ success: false, message: "Payment not created" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

export const deletePayment = expressAsyncHandler(async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);
    if (payment) {
      payment.isDeleted = true;
      await payment.save();
      return res.status(200).json({ success: true, message: "Payment removed successfully", payment });
    } else {
      return res.status(404).json({ success: false, message: "Payment not found" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});


export const getPayment = expressAsyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const payment = await Payment.find({ loanId: id ,isDeleted: false});
        if (payment) {
            return res.status(200).json({ success: true, message: "Payment fetched successfully", payment });
        } else {
            return res.status(404).json({ success: false, message: "Payment not found" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
})