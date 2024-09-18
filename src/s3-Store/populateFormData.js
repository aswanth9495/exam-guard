import createUploadForm from './createUploadForm';

function populateFormData(signedS3Post, uploadParams) {
  const uploadForm = createUploadForm(signedS3Post);
  uploadForm.append('Content-Type', uploadParams.ContentType);
  uploadForm.append('file', uploadParams.Body);

  return uploadForm;
}

export default populateFormData;
