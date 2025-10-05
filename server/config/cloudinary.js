import { v2 as cloudinery } from 'cloudinary'
import fs from 'fs'


cloudinery.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async (file) => {
    try {
        if (!file) return null
        const result = await cloudinery.uploader.upload(file, {
            resource_type: "auto"
        })
        fs.unlinkSync(file)
        return result.secure_url

    } catch (error) {
        fs.unlinkSync(file)
        console.log(error)
        return null
    }
}

export default uploadOnCloudinary