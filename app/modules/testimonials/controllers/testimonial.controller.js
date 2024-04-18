class testimonialControllers {
  /**
   *  // @Method: testimonial
   *  //@Description: To render testimonial form
   */
  async testimonial(req, res) {
    try {
      // res.render("/admin/views/content.ejs");
      res.render("testimonials/views/test.ejs", {
        title: "content page",
      });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new testimonialControllers();
