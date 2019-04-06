# Node server for crowd monitoring

### Features

- Returns image blob given the image name by searching on S3 Bucket
- Returns cropped faces in an image given the image name using Rekognition
- Returns all the images with a person in it given the Face ID of that person
- Returns images with zone alert by fetching image names from MongoDB and using names to fetch images from S3 Bucket
- Returns latest image from multiple cameras based
- Cropping of faces and getting images given image name is done in parallel to improve speed
