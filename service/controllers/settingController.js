import asyncHandler from 'express-async-handler'; 
import Setting from '../models/settingModel.js';



export const updateSetting = asyncHandler(async (req, res) => {
    const { rates , days } = req.body; 
  
    try {
      let setting = await Setting.findOne({});
      if (setting) {

        setting.interestRate = rates|| setting.interestRate;

        setting.days = days || setting.days


        const updatedSetting = await setting.save();


        return res.status(200).json({
          success: true,
          message: "Setting updated successfully",
          setting: updatedSetting,
        });
      } else {

        const newSetting = new Setting({ interestRate: rates || undefined , days: days || undefined });


        const createdSetting = await newSetting.save();



        return res.status(201).json({
          success: true,
          message: "Setting created successfully",
          setting: createdSetting,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });


  export const getSetting = asyncHandler(async (req, res) => {
    try {
      const setting = await Setting.findOne({});
  
      if (setting) {
        return res.status(200).json({
          success: true,
          message: "Setting retrieved successfully",
          setting: setting,
        });
      } else {
        return res.status(404).json({ success: false, message: "Setting not found" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });