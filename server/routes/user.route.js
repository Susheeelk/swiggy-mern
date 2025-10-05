import express from 'express'
import { changePassword, changeUserRole, currentUaser, deleteUser, editProfile, getAllUsers, logout, resetPassword, sendOtp, signIn, signUp, verifyOtp, verifyResetOtp } from '../controllers/user.controller.js'
import isAuth from '../middlewere/auth.middlewere.js'
import { upload } from '../middlewere/multer.js'

const userRouter = express.Router()

userRouter.post('/signup', signUp)
userRouter.post('/login', signIn)
userRouter.post('/logout', logout)
userRouter.post('/verifyOtp', verifyOtp)
userRouter.post('/sendOtp', sendOtp)
userRouter.post('/verify-reset', verifyResetOtp)
userRouter.post('/reset-password', resetPassword)
userRouter.get('/me', isAuth, currentUaser)
userRouter.put('/edit-profile', isAuth, upload.single('image'), editProfile)
userRouter.delete('/delete/:id', isAuth, deleteUser)
userRouter.put("/change-password/:id", isAuth, changePassword);
userRouter.get('/', getAllUsers)
userRouter.put('/:id/role', isAuth, changeUserRole)



export default userRouter