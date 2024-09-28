# Image Uploader

## Description

Image Uploader is a Next.js application that allows users to upload images and automatically generates HTML and CSS code to replicate the visual design of the uploaded image. This tool leverages the power of AI to convert visual designs into code, making it easier for developers and designers to quickly prototype or implement designs.

## Features

- **Image Upload**: Drag and drop or select images up to 1MB in size.
- **AI-Powered Code Generation**: Utilizes advanced AI to generate HTML and CSS from uploaded images.
- **Code Preview**: Displays generated HTML and CSS with syntax highlighting.
- **Copy to Clipboard**: Easily copy generated code with a single click.
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing.
- **Responsive Design**: Fully responsive layout that works on desktop and mobile devices.
- **Image Preview**: View uploaded images with a full-screen preview option.

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Axios for API requests
- Prism.js for code syntax highlighting
- React Icons

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/briannjara/IMG-code.git
   ```

2. Navigate to the project directory:
   ```
   cd image-uploader
   ```

3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn install
   ```

4. Create a `.env.local` file in the root directory and add your API key:
   ```
   GOOGLE_API_KEY=your_google_api_key_here
   ```

5. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Upload an image by dragging and dropping it into the designated area or by clicking "Browse Files".
2. Once an image is uploaded, click "Generate Code" to create HTML and CSS based on the image.
3. View the generated code in the HTML and CSS sections.
4. Copy the code to your clipboard by clicking the copy icon next to each code block.
5. Use the dark mode toggle in the top right corner to switch between light and dark themes.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

- WhatsApp: [+254723752098](https://wa.me/254723752098)
- Email: [briannjaramba138@gmail.com](mailto:briannjaramba138@gmail.com)

## Acknowledgements

- [Google Gemini API](https://cloud.google.com/vertex-ai/docs/generative-ai/start/quickstarts/api-quickstart) for AI-powered code generation
- [Next.js](https://nextjs.org/) for the React framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Prism.js](https://prismjs.com/) for code syntax highlighting