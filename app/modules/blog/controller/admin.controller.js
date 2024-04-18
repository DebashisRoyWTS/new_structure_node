class AdminControllers {
/**
 *  // @Method: form
 *  //@Description: To render Blog form 
 */
  async form(req, res) {
    try {
      // res.render("/admin/views/content.ejs");
      res.render("blog/views/add.ejs", {
        title: "content page",
      });
    } catch (error) {
      throw error;
    }
  }
/**
 *  // @Method: list
 *  //@Description: To render Blog list 
 */
  async list(req, res) {
    try {
      // res.render("/admin/views/content.ejs");
      res.render("blog/views/list.ejs", {
        title: "list page",
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AdminControllers();
