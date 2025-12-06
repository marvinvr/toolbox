# VS Image Generator

A lightweight, browser-based tool for creating stylish VS comparison images. Perfect for creating before/after comparisons, product comparisons, or any side-by-side visual matchups with a professional look.

## Features

- Upload two images for side-by-side comparison
- Customizable VS text styling (white or black with contrasting borders)
- Configurable dividing line style (bordered or plain black)
- Tilted dividing line for dynamic visual appeal
- Asymmetric layout with more space for the right image
- Export directly to PNG format
- Works entirely in the browser - no server required

## Usage

1. Open `index.html` in your web browser
2. Upload your left image using the first file input
3. Upload your right image using the second file input
4. Choose your preferred VS text style (white with black border or black with white border)
5. Select your dividing line style (white with black border or plain black)
6. Click "Download VS Image" to export your comparison as a PNG file

## Visual Features

- **Tilted Dividing Line**: The center line is tilted 8° to the right for a dynamic look
- **Asymmetric Layout**: Right side gets slightly more space (~52%) for better visual balance
- **Large VS Text**: Bold 96px text prominently displays "VS" in the center
- **Professional Styling**: Clean borders and contrasting colors ensure readability

## Technical Details

The tool uses:
- TailwindCSS for styling
- HTML5 Canvas for image rendering and export
- FileReader API for image uploads
- Custom clipping paths for precise image placement

## Getting Started

Simply download the repository and open `index.html` in your web browser. No installation or build process required!

## Browser Compatibility

Works in modern browsers that support:
- HTML5 Canvas
- FileReader API
- Canvas clipping paths
- Canvas export (toDataURL)

## License

MIT License