# Image Placement Guide for Resell Marketplace

## 📸 Where to Place Product Images

For the Resell Marketplace feature, product images should be placed in the following directory:

```
client/public/assets/images/resell/
```

### Directory Structure

```
client/
└── public/
    └── assets/
        └── images/
            └── resell/
                ├── product-1.jpg
                ├── product-2.jpg
                ├── product-3.jpg
                └── ...
```

## 🖼️ Image Naming Convention

It's recommended to name your images using the product ID or a descriptive name:

- **Option 1 (Recommended)**: Use product ID
  - `1.jpg` (for product with id: '1')
  - `2.jpg` (for product with id: '2')
  - etc.

- **Option 2**: Use descriptive names
  - `scientific-calculator-ti84.jpg`
  - `hp-laptop-15s.jpg`
  - `clrs-book.jpg`
  - etc.

## 📝 How to Update Product Data

Once you've uploaded images, you can update the product data in:

```
client/src/data/demoProducts.js
```

Update the `image` property for each product:

```javascript
{
  id: '1',
  title: 'Scientific Calculator TI-84 Plus',
  // ... other properties
  image: '/assets/images/resell/1.jpg' // Update this path
}
```

## 🔗 Image Path Format

When referencing images in the product data, use paths relative to the `public` folder:

```javascript
image: '/assets/images/resell/product-1.jpg'
```

**Note**: The leading `/` is important - it tells the browser to look in the `public` folder.

## 📦 Supported Image Formats

- **JPEG** (.jpg, .jpeg) - Recommended for photos
- **PNG** (.png) - Recommended for graphics with transparency
- **WebP** (.webp) - Modern format with better compression
- **GIF** (.gif) - For animated images (not recommended for products)

## 🎨 Image Recommendations

- **Resolution**: Minimum 800x600px, recommended 1200x900px or higher
- **Aspect Ratio**: 4:3 or 16:9 works best
- **File Size**: Keep under 500KB per image for faster loading
- **Quality**: Use good lighting and clear backgrounds

## 🚀 After Uploading Images

1. Place images in `client/public/assets/images/resell/`
2. Update `demoProducts.js` with image paths
3. Images will be automatically served by Vite
4. No build step required - images are available immediately

## 💡 Example

If you have an image file named `calculator.jpg`:

1. Place it at: `client/public/assets/images/resell/calculator.jpg`
2. Update the product in `demoProducts.js`:
   ```javascript
   {
     id: '1',
     title: 'Scientific Calculator TI-84 Plus',
     // ...
     image: '/assets/images/resell/calculator.jpg'
   }
   ```
3. The image will be accessible at: `http://localhost:5173/assets/images/resell/calculator.jpg`

## 🔄 Backend Integration (Future)

When you integrate with the backend, you'll likely:

1. Upload images to a server storage (e.g., AWS S3, Cloudinary, or local server storage)
2. Store image URLs in the database
3. Update the frontend to fetch product data (including image URLs) from the API

For now, the demo products use placeholder icons until you upload actual images.

