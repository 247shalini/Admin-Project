const { message } = require("../common/messages");
const {
  generateToken,
  comparePassword,
  encryptPassword,
} = require("../common/password");
const userModel = require("../models/user");

/**
 * login a super admin
 * @param { req, res }
 * @returns JsonResponse
 */
exports.loginAction = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    // check super admin exist or not
    const adminDetail = await userModel.findOne({
      role: { $eq: "Super_admin" },
    });
    // console.log("adminDetail ", adminDetail);

    if (adminDetail.email === email) {
      const isPasswordCorrect = await comparePassword(
        password,
        adminDetail.password
      );
      if (!isPasswordCorrect) {
        return res.status(422).json({
          error: message.PASSWORD_INCORRECT,
        });
      }
    } else {
      return res.status(422).json({
        error: EMAIL_INCORRECT,
      });
    }
    const token = await generateToken({
      id: adminDetail,
    });

    return res.status(200).json({
      token: token,
      message: message.LOGIN_SUCCESS,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errors: message.ERROR_MESSAGE,
    });
  }
};

/**
 * user registration action
 * @param { req, res }
 * @returns JsonResponse
 */
exports.addUser = async (req, res) => {
  try {
    // console.log("add user info ---", req.body);
    const { firstName, lastName, email, password, role } = req.body.userValues;
    const hashedPassword = await encryptPassword(password);
    const isEmailExist = await userModel.findOne({ email });
    if (isEmailExist) {
      return res.status(500).json({
        errors: message.EMAIL_ALREADY_EXISTS,
      });
    }
    // save the data in database of user
    const userData = await userModel.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
    });

    return res.status(200).json({
      message: message.USER_ADD_SUCCESS,
      userData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errors: message.ERROR_MESSAGE,
    });
  }
};

/**
 * update a user
 * @param { req, res }
 * @returns JsonResponse
 */
exports.updateUser = async (req, res) => {
  try {
    const { userInfo, userRole } = req.body;
    console.log("info ---", userInfo, req.body.status, userRole, req.params.id);

    if (userInfo === undefined && userRole === undefined) {
      const updateUserData = await userModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            status: req.body.status,
          },
        },
        {
          new: true,
        }
      );
      return res.status(200).json({
        message: message.STATUS_UPDATE,
      });
    } else {
      const updateUserData = await userModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            firstName: userInfo.firstName,
            lastName: userInfo.lastName,
            email: userInfo.email,
            role: userRole,
            status: userInfo.status,
          },
        },
        {
          new: true,
        }
      );
    }
    // console.log("user ---> ", updateUserData);
    return res.status(200).json({
      message: message.ADMIN_DATA_UPDATE,
    });
  } catch (error) {
    console.log("error ---> ", error);
    res.status(500).json({
      error: message.ERROR_MESSAGE,
    });
  }
};

/**
 * delete a user data
 * @param { req, res }
 * @returns JsonResponse
 */
exports.deleteUser = async (req, res) => {
  try {
    // find the id if user exist then delete the data of user
    const userData = await userModel.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: message.USER_DATA_DELETED,
    });
  } catch (error) {
    return res.status(500).json({
      message: message.ERROR_MESSAGE,
    });
  }
};

// /**
//  * get the data of all user
//  * @param { req, res }
//  * @returns JsonResponse
//  */
exports.getUserList = async (req, res) => {
  try {
    const { role, status, search, id, page } = req.query;
    // console.log("query ---> ", req.query);
    const pageNo = parseInt(page);
    const pageSize = 3;
    const query = [];

    // check the filter according query
    if (role) {
      if (role == "All") {
        query.push({
          $match: {
            role: { $ne: "Super_admin" },
          },
        });
      } else {
        query.push({
          $match: { role: role },
        });
      }
    }

    if (status) {
      if (status == "All") {
        query.push({
          $match: {
            role: { $ne: "Super_admin" },
          },
        });
      } else {
        query.push({
          $match: { status: status, role: { $ne: "Super_admin" } },
        });
      }
    }

    if (search) {
      query.push({
        $match: {
          firstName: { $regex: search, $options: "i" },
          role: { $ne: "Super_admin" },
        },
      });
    }
    if (id) {
      query.push({
        $match: { _id: id },
      });
    }

    const getAllUserData = await userModel
      .find({
        role: { $ne: "Super_admin" },
      })
      .sort({ createdAt: -1 });

    const indexOfLastRecord = pageNo * pageSize;
    const indexOfFirstRecord = indexOfLastRecord - pageSize;
    const currentRecords = getAllUserData.slice(
      indexOfFirstRecord,
      indexOfLastRecord
    );
    const nPages = Math.ceil(getAllUserData.length / pageSize);

    if (role || search || status) {
      console.log("CHECK IN IF CONDITION ==>");
      const userData = await userModel.aggregate(query).sort({ createdAt: -1 });
      const currentRecord = userData.slice(
        indexOfFirstRecord,
        indexOfLastRecord
      );
      const nPages = Math.ceil(userData.length / pageSize);
      return res.status(200).json({
        details: currentRecord,
        nPages: nPages,
        currentPage: pageNo,
        recordsPerPage: pageSize,
      });
    } else {
      return res.status(200).json({
        details: currentRecords,
        nPages: nPages,
        currentPage: pageNo,
        recordsPerPage: pageSize,
      });
    }
  } catch (error) {
    res.status(500).json({
      message: message.ERROR_MESSAGE,
    });
  }
};

/**
 * get the data of all user
 * @param { req, res }
 * @returns JsonResponse
 */
exports.getUserInfo = async (req, res) => {
  try {
    const { id } = req.query;
    console.log(req.query, id);

    const userList = await userModel.findById(id);
    console.log(userList);
    return res.send({
      details: userList,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: message.ERROR_MESSAGE,
    });
  }
};
