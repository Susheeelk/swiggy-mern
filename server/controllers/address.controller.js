import Address from "../models/address.model.js";



//  create address controller here
export const createAddress = async (req, res) => {
    try {
        const { fullName, phone, pincode, house, area, landmark, city, state, default: isDefault } = req.body;

        const address = new Address({
            user: req.userId,
            fullName,
            phone,
            pincode,
            house,
            area,
            landmark,
            city,
            state,
            default: isDefault
        });

        const saved = await address.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.userId });
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) return res.status(404).json({ message: "Address not found" });

        if (address.user.toString() !== req.userId.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        Object.assign(address, req.body);
        const updated = await address.save();
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);
        if (!address) return res.status(404).json({ message: "Address not found" });

        if (address.user.toString() !== req.userId.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await address.deleteOne();
        res.json({ message: "Address deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
