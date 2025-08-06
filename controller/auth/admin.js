const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("---registerUser---");
        
        return res.status(200).json({ message: "User registered successfully" });
 
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { registerUser };