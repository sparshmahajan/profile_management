const User = require('../models/userSchema');
const { Encrypt, Decrypt } = require("../security/bcrypt");
const _ = require("lodash");
const { getToken } = require('../security/jwt')
const jwt = require('jsonwebtoken');

const signup = (req, res) => {
    const { firstName, middleName, lastName, password,role, department } = req.body;
    const email = _.toLower(req.body.email);
    try {
        User.findOne({ email: email }, async (error, foundUser) => {
            if (foundUser) {
                res.status(400).send({ message: "Email Already exists." });
            } else {
                const encryptedPassword = await Encrypt(password);
                const user = new User({
                    firstName: firstName,
                    middleName: middleName || null,
                    lastName: lastName,
                    email: email,
                    password: encryptedPassword,
                    role: role,
                    department: department || null
                });
                user.save((e) => {
                    if (!e) {
                        res.status(201).send({ message: "Successfully saved user data." });
                    }
                    else {
                        res.status(400).send({ message: "Error while saving data." });
                        console.log(e);
                    }
                });
            }
        });
    } catch (error) {
        res.status(400).send({ message: "SOMETHING WENT WRONG" });
        console.log(error);
    }
}

const login = (req, res) => {
    const { password } = req.body;
    const email = _.toLower(req.body.email);
    try {
        User.findOne({ email: email }, async (error, foundUser) => {
            if (foundUser) {
                const result = await Decrypt(password, foundUser.password);
                if (result === true) {
                    const token = getToken({ userId: foundUser._id, email: foundUser.email });
                    const { firstName, middleName, lastName, email, role, department, lastLogin } = foundUser;
                    foundUser.lastLogin = new Date();
                    foundUser.save();
                    res.status(200).send({ token, user: { firstName, middleName, lastName, email, role, department,lastLogin } });
                }
                else {
                    res.status(400).send({ message: "Invalid Password" });
                }
            }
            else {
                res.status(400).send({ message: "User not found" });
            }
        });
    } catch (error) {
        res.status(400).send({ message: "SOMETHING WENT WRONG" });
        console.log(error);
    }
}

const viewUsers = (req, res) => {
    const { userId } = req.user;
    try {
        User.findOne({ _id: userId }, (error, foundUser) => {
            if (foundUser) {
                if (foundUser.role === "admin") {
                    User.find({}, { password: 0 , __v: 0 , _id: 0 }, (error, users) => {
                        if (users) {
                            res.status(200).send(users);
                        }
                        else {
                            res.status(400).send({ message: "No users found" });
                        }
                    });
                }
                else {
                    User.find({ role: "user" }, { password: 0 , __v: 0 , _id: 0 }, (error, users) => {
                        if (users) {
                            res.status(200).send(users);
                        }
                        else {
                            res.status(400).send({ message: "No users found" });
                        }
                    });
                }
            } else {
                res.status(401).send({ message: "Unauthorized" });
            }
        });
    } catch (error) {
        res.status(400).send({ message: "SOMETHING WENT WRONG" });
        console.log(error);
    }
}

const updateUser = (req, res) => {
    const { userId } = req.user;
    const { firstName, middleName, lastName, role, department, id } = req.body;
    let query = { $set: { updatedAt: new Date() } };
    if (firstName) {
        query.$set.firstName = firstName;
    }
    if (middleName) {
        query.$set.middleName = middleName;
    }
    if (lastName) {
        query.$set.lastName = lastName;
    }
    if (role) {
        query.$set.role = role;
    }
    if (department) {
        query.$set.department = department;
    }
    try {
        User.findOne({ _id: userId }, async (error, foundUser) => {
            if (foundUser) {
                if (foundUser.role === "admin") {
                    User.findById(id, (error, user) => {
                        if (user) {
                            User.UpdateOne({ _id: id }, query, { new: true }, (error, updatedUser) => {
                                if (updatedUser) {
                                    res.status(200).send({ message: "User updated successfully" });
                                } else {
                                    res.status(400).send({ message: "Error while updating user" });
                                }
                            });
                        } else {
                            res.status(400).send({ message: "User not found" });
                        }
                    });
                } else {
                    User.findById(id, (error, user) => {
                        if (user) {
                            if (user.role === "user") {
                                User.UpdateOne({ _id: id }, query, { new: true }, (error, updatedUser) => {
                                    if (updatedUser) {
                                        res.status(200).send({ message: "User updated successfully" });
                                    } else {
                                        res.status(400).send({ message: "Error while updating user" });
                                    }
                                });
                            } else {
                                res.status(401).send({ message: "Unauthorized" });
                            }
                        } else {
                            res.status(400).send({ message: "User not found" });
                        }
                    });
                }
            } else {
                res.status(401).send({ message: "Unauthorized" });
            }
        });
    } catch (error) {
        res.status(400).send({ message: "SOMETHING WENT WRONG" });
        console.log(error);
    }
}

const addUser = (req, res) => {
    const { role } = req.body;
    const { userId } = req.user;
    try {
        User.findById(userId, (error, foundUser) => {
            if (foundUser) {
                if (foundUser.role === "admin") {
                    signup(req, res);
                } else if(foundUser.role === "user") {
                    if(role === "user") {
                        signup(req, res);
                    } else {
                        res.status(401).send({ message: "Unauthorized" });
                    }
                } else {
                    res.status(401).send({ message: "Unauthorized" });
                }
            } else {
                res.status(401).send({ message: "Unauthorized" });
            }
        });
    } catch (error) {
        res.status(400).send({ message: "SOMETHING WENT WRONG" });
        console.log(error);
    }
}

module.exports = {
    signup,
    login,
    viewUsers,
    updateUser,
    addUser
}