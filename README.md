---
name: Open Graph Image Generation
slug: og-image-generation
description: Compute and generate dynamic social card images with React components.
framework: Next.js
useCase: Edge Functions
css: Tailwind
deployUrl: https://vercel.com/new/clone?repository-url=https://github.com/vercel/examples/tree/main/edge-functions/vercel-og-nextjs&project-name=vercel-og-nextjs&repository-name=vercel-og-nextjs
demoUrl: https://og-examples.vercel.sh/api/static
relatedTemplates: 
  - nextjs-boilerplate
  - aws-s3-image-upload-nextjs
  - platforms-starter-kit
  - blog-starter-kit
---

## Dynamic Image Generation for Profile Cards

This project is a dynamic open graph image generation service, which generates images for sharing on social media platforms. It takes parameters from the URL and generates a customizable image with a title, subtitle, avatar, and a set of tags, each with an icon, label, and color.

## Usage
To use this service, make a GET request to the endpoint with the following URL parameters:

- title: The title of the image.
- subtitle: The subtitle of the image.
- color: The color of the image.
- avatar: The URL of the avatar image.
- tags: A semicolon-separated list of tags, with each tag having a comma-separated list of label, color, and icon.

For example, the following URL will generate the image below:

```
https://peatch-image-preview.vercel.app/api/image?title=John Doe&subtitle=Product &avatar=https://d262mborv4z66f.cloudfront.net/users/149/KO7uaU43.svg&color=FF8C42&tags=Mentor,17BEBB,e8d3;Founder,FF8C42,eb39;Business Developer,93961F,e992;AI Engineer,685155,f882;Investor,FE5F55,e2eb;Dog Father,685155,f149;Entrepreneur,EF5DA8,e7c8
```

![Preview](https://d262mborv4z66f.cloudfront.net/response.png)

## Next, run Next.js in development mode:

```bash
npm install
npm run dev

# or

yarn
yarn dev
```

