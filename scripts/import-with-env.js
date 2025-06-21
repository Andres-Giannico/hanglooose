// Script to import products with hardcoded Sanity credentials
const fs = require('fs');
const yaml = require('js-yaml');
const { createClient } = require('@sanity/client');

// Hardcoded Sanity credentials
process.env.NEXT_PUBLIC_SANITY_PROJECT_ID = 's7ph4773';
process.env.NEXT_PUBLIC_SANITY_DATASET = 'production';
process.env.SANITY_API_TOKEN = 'sk4nP5qg8YWZxQJR6FlABNQJcliqt0nYMAhwukXnhFkmxkedwjCFHmZgxzf5UbXWREq89d6OJvJzZ0OanDFCWjHu1tvAYJGg8rmwNpVmjrifz6ozppDFfE9qKHVfg8XzHLvKV46tEu6dSY7lHnZdvLwvfzD6zLvf15vYxh6rlqoSRBvEx1qD';

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// Function to load and process YAML file
async function importProducts(yamlFilePath) {
  try {
    // Read YAML file
    const fileContents = fs.readFileSync(yamlFilePath, 'utf8');
    const data = yaml.load(fileContents);

    // Check if there are products in the file
    if (!data.products || !data.products.length) {
      console.error('No products found in the YAML file.');
      return;
    }

    console.log(`Found ${data.products.length} products in the YAML file.`);

    // Process each product
    for (const product of data.products) {
      // Create a Sanity document for the product
      const sanityProduct = {
        _type: 'product',
        name: product.name,
        slug: {
          _type: 'slug',
          current: product.slug,
        },
        shortDescription: product.shortDescription,
        highlights: product.highlights,
        fullDescription: product.fullDescription,
        price: product.price,
        showFromPrice: product.showFromPrice,
        priceSubtitle: product.priceSubtitle,
        duration: product.duration,
        rating: product.rating,
        reviewCount: product.reviewCount,
        isBestSeller: product.isBestSeller,
        isLikelyToSellOut: product.isLikelyToSellOut,
        features: product.features,
        includes: product.includes,
        notIncludes: product.notIncludes,
        importantInformation: product.importantInformation,
        freeCancellation: product.freeCancellation,
        reserveNowPayLater: product.reserveNowPayLater,
        instructorInfo: product.instructorInfo,
        isPrivateGroup: product.isPrivateGroup,
        bookingGuarantees: product.bookingGuarantees,
        productType: product.productType,
        bookButtonText: product.bookButtonText,
        tripSummary: product.tripSummary,
        specificTime: product.specificTime,
        departurePoint: product.departurePoint,
        capacity: product.capacity,
        season: product.season,
        customDetails: product.customDetails,
        bookingWidget: product.bookingWidget,
        faqs: product.faqs,
      };

      // Add category reference if provided
      if (product.category) {
        // Find the category by slug
        const category = await client.fetch(
          `*[_type == "category" && slug.current == $slug][0]`,
          { slug: product.category }
        );

        if (category) {
          sanityProduct.category = {
            _type: 'reference',
            _ref: category._id,
          };
        } else {
          console.warn(`Category ${product.category} not found.`);
        }
      }

      // Check if product already exists
      const existingProduct = await client.fetch(
        `*[_type == "product" && slug.current == $slug][0]`,
        { slug: product.slug }
      );

      if (existingProduct) {
        console.log(`Updating existing product: ${product.name}`);
        await client
          .patch(existingProduct._id)
          .set(sanityProduct)
          .commit()
          .then((updatedProduct) => {
            console.log(`✅ Product updated: ${updatedProduct.name}`);
          })
          .catch((err) => {
            console.error('Error updating product:', err.message);
          });
      } else {
        console.log(`Creating new product: ${product.name}`);
        await client
          .create(sanityProduct)
          .then((createdProduct) => {
            console.log(`✅ Product created: ${product.name}`);
          })
          .catch((err) => {
            console.error('Error creating product:', err.message);
          });
      }
    }

    console.log('Import completed successfully.');
  } catch (error) {
    console.error('Error importing products:', error);
  }
}

// Get YAML file path from command line arguments
const yamlFilePath = process.argv[2] || 'scripts/products-tempest-900.yaml';

// Run the import
importProducts(yamlFilePath);
