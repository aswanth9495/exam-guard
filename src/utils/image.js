const resizeImage = (imageSrc, resizeOptions) => new Promise(
  (resolve, reject) => {
    const { width, height } = resizeOptions;

    // Create a new image object
    const img = new Image();
    img.src = imageSrc;

    img.onload = () => {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Set the canvas dimensions to the desired size
      canvas.width = width;
      canvas.height = height;

      // Draw the image on the canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Get the resized image data
      const resizedImageData = canvas.toDataURL('image/png');

      // Convert the resized image data to a blob
      fetch(resizedImageData)
        .then((res) => res.blob())
        .then((blob) => {
          resolve(blob);
        })
        .catch((err) => {
          reject(err);
        });
    };
  },
);

export default resizeImage;
