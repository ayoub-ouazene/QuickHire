const prisma = require("../../config/prisma");
const redis = require("../../config/redis"); // ✅ Redis Import

const UpdateProfileImage = async (req,res)=>{

  try {
    const { accountType, id } = req.body; 
    
    // 1. Check if a file was actually uploaded
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No image file provided. Please use the "image" key.' 
      });
    }

    const imageUrl = req.file.path;
    let updatedAccount;

    // 2. Update based on account type
    if (accountType === 'user') {
      updatedAccount = await prisma.user.update({
        where: { User_id: parseInt(id) },
        data: { Photo: imageUrl }
      });

      // ✅ INVALIDATE USER PROFILE CACHE
      await redis.del(`user:profile:${parseInt(id)}`);

    } 
    
    else if (accountType === 'company') {
      updatedAccount = await prisma.company.update({
        where: { Company_id: parseInt(id) },
        data: { Logo: imageUrl }
      });

      // ✅ INVALIDATE COMPANY PROFILE CACHE
      await redis.del(`company:profile:${parseInt(id)}`);

    }
    
    else {
      return res.status(400).json({ success: false, error: 'Invalid account type' });
    }

    res.status(200).json({
      success: true,
      message: 'Image updated successfully',
      data: {
        imageUrl: imageUrl,
        accountType: accountType
      }
    });

  } catch (error) {
    console.error('Update Image Error:', error);
    res.status(500).json({ success: false, error: 'Failed to update image' });
  }

};

module.exports = {
    UpdateProfileImage
}