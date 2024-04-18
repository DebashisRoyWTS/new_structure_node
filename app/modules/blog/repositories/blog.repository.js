const blogInfo = require("../model/blog.model");

const blogRepository = {
    getByField: async (params) => {
        let record = await blogInfo.findOne(params).exec();
        try {
          if (!record) {
            return null;
          }
          return record;
        } catch (e) {
          return e;
        }
      },
    
      getAllByField: async (params) => {
        let record = await blogInfo
          .find(params)
          .sort({
            _id: 1,
          })
          .exec();
        try {
          if (!record) {
            return null;
          }
          return record;
        } catch (e) {
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
};

module.exports = blogRepository;
