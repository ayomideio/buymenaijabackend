import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ExceptionInterceptor } from './common/interceptors/exception.interceptor';
import multer from 'multer';
import { v4 as uuid } from 'uuid';
import { ProductService } from './models/product/product.service';

function generateProducts() {
  const userId = '29de3210-3b78-409c-80cb-5d8926adc7b9'; // Replace with your actual userId

  const products = [];

  for (let i =2 ; i <= 40; i++) {
    const productId = uuid(); // Generate a unique UUID for each product
    const productName = `Product ${i}`;
    const productDescription = `This is a detailed description for ${productName}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed fermentum tempus dapibus. Nullam eget luctus justo. Sed lacinia scelerisque mi, at tincidunt odio gravida non. Phasellus accumsan sollicitudin leo, in pretium risus aliquam vel. Proin eu diam nec mi convallis consequat.`;
    const basePrice = getRandomNumber(50, 500); // Random price between 50 and 500
    const stock = getRandomNumber(10, 100); // Random stock between 10 and 100

    const product = {
      id: productId,
      name: productName,
      urlName: productName.toLowerCase().replace(/ /g, '-'), // Example: product-1
      picture: generateProductPictures(), // Function to generate random picture URLs
      basePrice: basePrice,
      discountPercentage: getRandomNumber(0, 30), // Random discount percentage between 0 and 30
      stock: stock,
      description: productDescription,
      shortDescription: `Short description for ${productName}.`,
      longDescription: productDescription,
      specifications: generateProductSpecifications(), // Function to generate random specifications
      createdAt: new Date().toISOString(),
      userId: userId,
      categories: generateProductCategories(), // Function to generate random categories
     
    };

    products.push(product);
  }

  return products;
}

// Helper function to generate a random number within a range
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function to generate random product pictures (placeholders)
function generateProductPictures() {
  const pictureCount = getRandomNumber(1, 4); // Random number of pictures (1 to 4)
  const pictureUrls = [];

  for (let i = 1; i <= pictureCount; i++) {
    const randomImageId = getRandomNumber(1000, 9999);
    const imageUrl = `https://example.com/images/${randomImageId}.jpg`; // Example URL format
    pictureUrls.push(imageUrl);
  }

  return pictureUrls;
}

// Helper function to generate random product specifications
function generateProductSpecifications() {
  const specifications = [
    { "name": 'Dimensions', "value": `${getRandomNumber(5, 20)} x ${getRandomNumber(5, 20)} x ${getRandomNumber(2, 10)} cm` },
    { "name": 'Weight', "value": `${getRandomNumber(50, 200)} g` },
    { "name": 'Material', "value": `Material ${getRandomNumber(1, 5)}` },
    { "name": 'Color', "value": `Color ${getRandomNumber(1, 10)}` },
    { "name": 'Brand', "value": `Brand ${getRandomNumber(1, 5)}` },
    { "name": 'Model', "value": `Model ${getRandomNumber(1, 10)}` },
  ];

  return specifications;
}

// Helper function to generate random product categories
function generateProductCategories() {
  const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Sports', 'Books', 'Toys'];
  const categoryCount = getRandomNumber(1, 3); // Random number of categories (1 to 3)
  const selectedCategories = [];

  for (let i = 0; i < categoryCount; i++) {
    const randomIndex = getRandomNumber(0, categories.length - 1);
    selectedCategories.push({ name: categories[randomIndex] });
  }

  return ['95a86077-7502-486e-9537-d76a110e722c'];
}




/** Starts the application */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.enableCors()

  app.useGlobalInterceptors(new ExceptionInterceptor());
  
  // const productService = app.get(ProductService); 
  // const produc=generateProducts()
  // console.log(produc[0].id)
  // for (const product of produc) {
  //   await productService.create(product);
  // }
  
  // console.log(`product == ${JSON.stringify(produc)}`)
  const config = new DocumentBuilder()
    .setTitle('eCommerce Back End')
    .setDescription('Back End for eCommerces')
    .setVersion('0.0.1')
    .addBearerAuth()
    .addTag('authentication')
    .addTag('user')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'eCommerce Swagger API',
  });

  
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
