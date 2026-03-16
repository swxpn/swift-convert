/* global use, db */
// MongoDB Playground template for swift-convert/app.py
// Usage:
// 1) Connect to your MongoDB Atlas cluster in VS Code.
// 2) Open this file and run sections as needed.

use('swift-convert');

// 1) Create the conversions collection with schema validation.
//    This supports both conversion types used by app.py:
//    - pdf_to_image
//    - image_to_pdf
try {
  db.createCollection('conversions', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['type', 'session_id', 'created_at'],
        properties: {
          type: {
            enum: ['pdf_to_image', 'image_to_pdf'],
            description: 'Conversion type'
          },
          session_id: {
            bsonType: 'string',
            minLength: 8,
            description: 'UUID hex used by the Flask app'
          },
          created_at: {
            bsonType: 'date',
            description: 'UTC timestamp'
          },

          // Fields for pdf_to_image
          format: {
            enum: ['PNG', 'JPEG']
          },
          dpi: {
            enum: [72, 150, 300]
          },
          pages_converted: {
            bsonType: ['int', 'long', 'double']
          },
          total_pages: {
            bsonType: ['int', 'long', 'double']
          },

          // Fields for image_to_pdf
          page_size: {
            enum: ['A4', 'LETTER', 'A3']
          },
          orientation: {
            enum: ['portrait', 'landscape']
          },
          image_count: {
            bsonType: ['int', 'long', 'double']
          }
        },
        oneOf: [
          {
            properties: { type: { enum: ['pdf_to_image'] } },
            required: ['format', 'dpi', 'pages_converted', 'total_pages']
          },
          {
            properties: { type: { enum: ['image_to_pdf'] } },
            required: ['page_size', 'orientation', 'image_count']
          }
        ]
      }
    },
    validationLevel: 'strict',
    validationAction: 'error'
  });
  print('Created collection: conversions');
} catch (err) {
  print('Collection may already exist. Skipping createCollection.');
}

// 2) Indexes for common lookups.
db.getCollection('conversions').createIndex({ session_id: 1 }, { unique: true, name: 'uniq_session_id' });
db.getCollection('conversions').createIndex({ created_at: -1 }, { name: 'created_at_desc' });
db.getCollection('conversions').createIndex({ type: 1, created_at: -1 }, { name: 'type_created_at_desc' });

// 3) Optional sample docs to test dashboard/queries.
//    Comment out this block if you do not want sample data.
db.getCollection('conversions').insertMany([
  {
    type: 'pdf_to_image',
    session_id: 'sample_pdf2img_001',
    format: 'PNG',
    dpi: 150,
    pages_converted: 5,
    total_pages: 8,
    created_at: new Date()
  },
  {
    type: 'image_to_pdf',
    session_id: 'sample_img2pdf_001',
    page_size: 'A4',
    orientation: 'portrait',
    image_count: 4,
    created_at: new Date()
  }
]);

// 4) Quick checks.
print('Total conversions: ' + db.getCollection('conversions').countDocuments({}));
print('Latest records:');
db.getCollection('conversions')
  .find({}, { _id: 0 })
  .sort({ created_at: -1 })
  .limit(10);
