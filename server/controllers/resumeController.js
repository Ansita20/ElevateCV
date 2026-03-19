import Resume from "../models/Resume.js";
import fs from "fs";
import imagekit from "../configs/imageKit.js";

const applyBackgroundTransformToImageUrl = (imageUrl, removeBackground) => {
    if (!imageUrl || typeof imageUrl !== "string") return imageUrl;

    try {
        const parsed = new URL(imageUrl);
        const current = parsed.searchParams.get("tr") || "";
        const parts = current
            .split(",")
            .map((part) => part.trim())
            .filter(Boolean)
            .filter((part) => part !== "e-bgremove");

        const defaults = ["w-300", "h-300", "fo-face", "z-0.75"];
        for (const token of defaults) {
            if (!parts.includes(token)) parts.push(token);
        }

        if (String(removeBackground) === "true") {
            parts.push("e-bgremove");
        }

        if (parts.length) {
            parsed.searchParams.set("tr", parts.join(","));
        } else {
            parsed.searchParams.delete("tr");
        }

        return parsed.toString();
    } catch {
        return imageUrl;
    }
};

// contrller for creating a new resume
// POST: /api/resumes/create

export const createResume = async (req,res) => {
    try{
        const userId = req.userId;
        const {title} = req.body;

        const newResume = await Resume.create({userId, title});

        return res.status(201).json({message: 'Resume created successfully', resume: newResume})
    }catch (error){
        return res.status(400).json({message: error.message});
    }
}

// controller for deleting a resume
// DELETE: /api/resumes/delete
export const deleteResume = async (req,res) => {
    try{
        const userId = req.userId;
        const {resumeId} = req.params;

        const deletedResume = await Resume.findOneAndDelete({userId, _id: resumeId});

        if(!deletedResume){
            return res.status(404).json({message: 'Resume not found'});
        }

        return res.status(200).json({message: 'Resume deleted successfully'})
    }catch (error){
        return res.status(400).json({message: error.message});
    }
}

// get user resume by id
// GET: /api/resumes/get
export const getResumeById = async (req,res) => {
    try{
        const userId = req.userId;
        const {resumeId} = req.params;

        const resume = await Resume.findOne({userId, _id: resumeId}).lean();

        if(!resume){
            return res.status(404).json({message: 'Resume not found'});
        }

        delete resume.__v;
        delete resume.createdAt;
        delete resume.updatedAt;

        return res.status(200).json({resume})
    }catch (error){
        return res.status(400).json({message: error.message});
    }
}

// get resume by id public
// GET: /api/resumes/public
export const getPublicResumeById = async (req,res) => {
    try{
        const {resumeId} = req.params;
        const resume = await Resume.findOne({public: true, _id: resumeId})
        
        if(!resume){
            return res.status(404).json({message: 'Resume not found'});
        }

        return res.status(200).json({resume})
    } catch (error){
        return res.status(400).json({message: error.message});
    }
}

// controller for updating a resume
// PUT: /api/resumes/update
export const updateResume = async (req,res) => {
    try{
        const userId = req.userId;
        const {resumeId, resumeData, removeBackground} = req.body;
        const image = req.file;

        let resumeDataCopy = typeof resumeData === "string" ? JSON.parse(resumeData) : (resumeData || {});

        if(image){
            const response = await imagekit.files.upload({
                file: fs.createReadStream(image.path),
                fileName: image.originalname || 'resume.png',
                folder: '/user-resumes',
                transformation: {
                    pre: 'w-300,h-300,fo-face,z-0.75' + (removeBackground ? ',e-bgremove' : '')

                }
            });
            resumeDataCopy.personal_info.image = response.url;
        } else if (resumeDataCopy?.personal_info?.image) {
            // Toggle/remove background effect for already-uploaded image URLs.
            resumeDataCopy.personal_info.image = applyBackgroundTransformToImageUrl(
                resumeDataCopy.personal_info.image,
                removeBackground
            );
        }

        const resume = await Resume.findOneAndUpdate(
            {userId, _id: resumeId},
            { $set: resumeDataCopy },
            {new: true}
        );

        if(!resume){
            return res.status(404).json({message: 'Resume not found'});
        }

        return res.status(200).json({message: 'Resume updated successfully', resume})
    }catch(error){
        return res.status(400).json({message: error.message});
    }
}