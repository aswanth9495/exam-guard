function createUploadForm(signedS3Post) {
  const formData = new FormData();
  formData.append('key', signedS3Post.key);
  formData.append('acl', signedS3Post.acl);
  formData.append('AWSAccessKeyId', signedS3Post.access_key);
  formData.append('policy', signedS3Post.policy);
  formData.append('signature', signedS3Post.signature);

  return formData;
}

export default createUploadForm;
