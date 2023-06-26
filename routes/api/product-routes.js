const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// The `/api/products` endpoint

// get all products
router.get("/", async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });
    if (!productData) {
      res.status(404).json({ message: "No products found!" });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get("/:id", async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });
    if (!productData) {
      res.status(404).json({ message: "No products found!" });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
/* expected structure for req.body
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
*/
router.post("/", async (req, res) => {
  try {
    const productData = await Product.create(req.body);
    if (req.body.tagIds.length) {
      const productTagArr = req.body.tagIds.map((tag_id) => {
        return {
          product_id: productData.id,
          tag_id,
        };
      });
      const productTags = await ProductTag.bulkCreate(productTagArr);
      res
        .status(200)
        .json({ new_product: productData, related_tags: productTags });
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// update product
/* expected structure for req.body
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
*/
router.put("/:id", async (req, res) => {
  try {
    const productData = await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (req.body.tagIds.length) {
      const requestTagIds = req.body.tagIds;
      const productTagData = await ProductTag.findAll({
        where: { product_id: req.params.id },
      });
      const tagsToRemove = [];
      const existingTags = [];
      productTagData.forEach(({ id, tag_id }) => {
        existingTags.push(tag_id);
        if (!requestTagIds.includes(tag_id)) {
          tagsToRemove.push(id);
        }
      });
      const tagsToAdd = [];
      requestTagIds.forEach((newTag) => {
        if (!existingTags.includes(newTag)) {
          tagsToAdd.push({ product_id: req.params.id, tag_id: newTag });
        }
      });
      const deletedTags = await ProductTag.destroy({
        where: { id: tagsToRemove },
      });
      const associatedTags = await ProductTag.bulkCreate(tagsToAdd);
      res.status(200).json({
        updatedProduct: productData,
        deletedTags: deletedTags,
        associatedTags: associatedTags,
      });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const productData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(productData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
