const { getAllUsers, getUserInfo } = require("../../services/usersService");

exports.getUsers = async (req, res) => {
    const users = await getAllUsers();
    res.status(200).json({message: "okay", users: users});
}

exports.getUser =async (req, res) => {
    //return specific user based on id
    const user_id = req.body.user_id;

    const user = await getUserInfo(user_id);
    res.status(200).json({message: "okay", user: user});
}