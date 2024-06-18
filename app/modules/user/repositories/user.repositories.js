const User = require("user/model/user.model");


const userRepository = {
  fineOneWithRole: async (params) => {
    try {
      
      let user = await User.findOne({
        email: params.email,
        role: { $in: params.roles },
        isDeleted: false,
        isActive: true,
      })
        .populate("role")
        .exec();
      if (!user) {
        throw {
          status: 500,
          data: null,
          message: "Authentication failed. User not found.",
        };
      }

      if (!user.validPassword(params.password, user.password)) {
        throw {
          status: 500,
          data: null,
          message: "Authentication failed. Wrong password.",
        };
      } else {
        return { status: 200, data: user, message: "" };
      }
    } catch (e) {
      return e;
    }
  },

  getAllUsers: async (req) => {
    try {
      var conditions = {};
      var and_clauses = [];

      and_clauses.push({ isDeleted: false });
      //and_clauses.push({ "user_role.role": req.body.role });

      if (_.has(req.body, "role") && req.body.role != "") {
        and_clauses.push({
          "user_role.role": req.body.role,
        });
      }

      if (_.has(req.body, "roles") && _.isArray(req.body.roles)) {
        and_clauses.push({
          "user_role.role": { $in: req.body.roles },
        });
      }

      if (_.isObject(req.body.query) && _.has(req.body.query, "user_type")) {
        and_clauses.push({
          user_type: req.body.query.user_type,
        });
      }

      // console.log('req.body.query from repo', req.body.query);

      if (
        _.isObject(req.body.query) &&
        _.has(req.body.query, "generalSearch")
      ) {
        and_clauses.push({
          $or: [
            {
              first_name: {
                $regex: req.body.query.generalSearch.trim(),
                $options: "i",
              },
            },
            {
              last_name: {
                $regex: req.body.query.generalSearch.trim(),
                $options: "i",
              },
            },
            {
              full_name: {
                $regex: req.body.query.generalSearch.trim(),
                $options: "i",
              },
            },
            {
              email: {
                $regex: "^" + req.body.query.generalSearch.trim(),
                $options: "i",
              },
            },
          ],
        });
      }

      if (req.body.userStatus) {
        and_clauses.push({ isActive: true });
        and_clauses.push({ isBanned: false });
      }

      if (_.isObject(req.body.query) && _.has(req.body.query, "Status")) {
        if (req.body.query.Status == "banned") {
          and_clauses.push({ isBanned: true });
        } else {
          and_clauses.push({
            isActive: req.body.query.Status == "Active" ? true : false,
          });
          and_clauses.push({ isBanned: false });
        }
      }

      conditions["$and"] = and_clauses;

      var sortOperator = { $sort: {} };
      if (_.has(req.body, "sort")) {
        var sortField = req.body.sort.field;
        if (req.body.sort.sort == "desc") {
          var sortOrder = -1;
        } else if (req.body.sort.sort == "asc") {
          var sortOrder = 1;
        }
        sortOperator["$sort"][sortField] = sortOrder;
      } else {
        sortOperator["$sort"]["_id"] = -1;
      }

      var aggregate = User.aggregate([
        {
          $lookup: {
            from: "roles",
            localField: "role",
            foreignField: "_id",
            as: "user_role",
          },
        },
        { $unwind: "$user_role" },
        { $match: conditions },
        sortOperator,
      ]);

      var options = {
        page: req.body.pagination.page,
        limit: req.body.pagination.perpage,
      };
      let allUsers = await User.aggregatePaginate(aggregate, options);

      //   console.log(allUsers, 'iiiiiiiiiiiiiiiiiiiioooooooooooooooooooooooooooooo');
      return allUsers;
    } catch (e) {
      throw e;
    }
  },

  getAllUsersByFields: async (params) => {
    try {
      return await User.aggregate([
        {
          $project: {
            _id: "$_id",
            first_name: 1,
            last_name: 1,
            full_name: { $concat: ["$first_name", " ", "$last_name"] },
            email: 1,
            isDeleted: 1,
            isActive: 1,
          },
        },
        { $match: params },
      ]);
    } catch (e) {
      return e;
    }
  },

  getById: async (id) => {
    try {
      let user = await User.findById(id).populate("role").exec();
      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      return e;
    }
  },

  getByIdWithParam: async (id) => {
    try {
      let user = await User.findById(id).populate("role").exec();
      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      return e;
    }
  },

  getByField: async (params) => {
    try {
      let user = await User.findOne(params).lean().exec();
      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      return e;
    }
  },

  getAllByField: async (params) => {
    try {
      let user = await User.find(params).populate("role").lean().exec();
      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      return e;
    }
  },

  getAllByFieldWithProjection: async (params, projection) => {
    try {
      let user = await User.find(params, projection)
        .populate("role")
        .sort({
          _id: -1,
        })
        .lean()
        .exec();

      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      return e;
    }
  },

  getLimitUserByField: async (params, limit) => {
    try {
      let user = await User.find(params)
        .populate("role")
        .limit(limit)
        .sort({
          _id: -1,
        })
        .exec();
      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      return e;
    }
  },

  delete: async (id) => {
    try {
      let user = await User.findById(id);
      if (user) {
        let userDelete = await User.remove({
          _id: id,
        }).exec();
        if (!userDelete) {
          return null;
        }
        return userDelete;
      }
    } catch (e) {
      return e;
    }
  },

  deleteByField: async (field, fieldValue) => {
    //todo: Implement delete by field
  },

  updateById: async (data, id) => {
    try {
      let user = await User.findByIdAndUpdate(id, data, {
        new: true,
      });

      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      return e;
    }
  },

  updateByField: async (data, param) => {
    try {
      let user = await User.updateOne(param, data, {
        new: true,
      });
      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      return e;
    }
  },

  updateAllByParams: async (data, params) => {
    try {
      let datas = await User.updateMany(params, data, { new: true });
      if (!datas) {
        return null;
      }
      return datas;
    } catch (e) {
      return e;
    }
  },

  save: async (data) => {
    try {
      let user = await User.create(data);

      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      //console.log(e.message);
      return e;
    }
  },

  getUser: async (id) => {
    try {
      let user = await User.findOne({
        id,
      }).exec();
      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      return e;
    }
  },

  getUserByField: async (data) => {
    try {
      let user = await User.findOne(data).populate("role").exec();
      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      return e;
    }
  },

  getUserCountByParam: async (params) => {
    try {
        let user = await User.countDocuments(params);
        return user;
    } catch (e) {
        throw (e);
    }
}

};

module.exports = userRepository;
