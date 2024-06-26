const blogInfo = require("blog/model/blog.model");

const blogRepository = {
  getAll: async (req, page, perpage) => {
    try {
      var conditions = {};
      var and_clauses = [];
      and_clauses.push({
        isDeleted: false,
      });
      if (_.isObject(req.body.search) && _.has(req.body.search, "value")) {
        and_clauses.push({
          $or: [
            { title: { $regex: req.body.search.value.trim(), $options: "i" } },
            {
              dateString: {
                $regex: req.body.search.value.trim(),
                $options: "i",
              },
            },
          ],
        });
      }
      conditions["$and"] = and_clauses;

      if (req.body.columns && req.body.columns.length) {
        let statusFilter = _.findWhere(req.body.columns, { data: "status" });
        if (statusFilter && statusFilter.search && statusFilter.search.value) {
          and_clauses.push({
            status: statusFilter.search.value,
          });
        }
      }

      let sortOperator = { $sort: {} };
      if (_.has(req.body, "order") && req.body.order.length) {
        for (let order of req.body.order) {
          let sortField = req.body.columns[+order.column].data;
          if (order.dir == "desc") {
            var sortOrder = -1;
          } else if (order.dir == "asc") {
            var sortOrder = 1;
          }
          sortOperator["$sort"][sortField] = sortOrder;
        }
      } else {
        sortOperator["$sort"]["_id"] = -1;
      }

      var aggregate = blogInfo.aggregate([
        {
          $addFields: {
            dateOfPublish: "$publishDate",
          },
        },
        {
          $addFields: {
            dateString: {
              $dateToString: {
                date: "$dateOfPublish",
                format: "%m-%d-%Y",
              },
            },
          },
        },
        {
          $match: conditions,
        },
        sortOperator,
      ]);
      const options = {
        page: page,
        limit: perpage,
      };

      let allRecord = await blogInfo.aggregatePaginate(aggregate, options);
      console.log(allRecord);
      return allRecord;
    } catch (e) {
      throw e;
    }
  },

  getById: async (id) => {
    try {
      let record = await blogInfo.findById(id);
      if (!record) {
        return null;
      }
      return record;
    } catch (e) {
      return e;
    }
  },

  getByField: async (params) => {
    console.log("params =>", params);
    let record = await blogInfo.findOne(params).exec();
    console.log("record =>", record);
    try {
      if (!record) {
        return null;
      }
      return record;
    } catch (e) {
      console.log(e);
      return e;
    }
  },

  save: async (data) => {
    try {
      let save = await blogInfo.create(data);
      if (!save) {
        return null;
      }
      return save;
    } catch (e) {
      return e;
    }
  },

  updateById: async (data, id) => {
    try {
      let record = await blogInfo.findByIdAndUpdate(id, data, {
        new: true,
      });
      if (!record) {
        return null;
      }
      return record;
    } catch (e) {
      return e;
    }
  },
  getBlogCountByParam: async (params) => {
    try {
        let blog = await blogInfo.countDocuments(params);
        return blog;
    } catch (e) {
        throw (e);
    }
},
};

module.exports = blogRepository;
