class AdminControllers {
  async hello(req, res) {
    try {
      // res.render("/admin/views/content.ejs");
      res.render("admin/views/content.ejs",{
        title:"content page"
      })
    } catch (error) {
      throw error
    }
  }
}

module.exports = new AdminControllers();
