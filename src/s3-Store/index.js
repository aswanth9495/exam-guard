import populateFormData from './populateFormData';
import request from './request';

const BUCKET_MAP = {
  scaler: {
    staging: {
      bucket: 'scaler-staging',
      region: 'ap-southeast-1',
    },
    production: {
      bucket: 'scaler-production-new',
      region: 'ap-southeast-1',
    },
    development: {
      bucket: 'watermarked-zoom-recordings',
      region: 'us-west-2',
    },
  },
  interviewbit: {
    staging: {
      bucket: 'interviewbit-staging-v2',
      region: 'ap-southeast-1',
    },
    production: {
      bucket: 'myinterviewtrainer',
      region: 'ap-southeast-1',
    },
    development: {
      bucket: 'watermarked-zoom-recordings',
      region: 'us-west-2',
    },
  },
};

class S3Store {
  constructor(region, bucket, baseUri, envVars = {}) {
    const bucketDetails = BUCKET_MAP[
      envVars?.application?.envId
    ]?.[envVars?.mode];
    this.bucket = bucket || bucketDetails.bucket;
    this.bucketRegion = region || bucketDetails.region;
    this.uploadParams = null;
    this.attachment = null;
    this.baseUri = baseUri;
  }

  createBucketUrl() {
    return `https://${this.bucket}.s3.amazonaws.com/`;
  }

  addPhoto(type, uploadParams, successCallback, errorCallback) {
    this.uploadParams = uploadParams;
    this.getPostPolicyDocument(
      type,
      uploadParams.Key.split('/').pop(),
      successCallback,
      errorCallback,
    );
  }

  async getPostPolicyDocument(type, fileName, successCallback, errorCallback) {
    const that = this;
    try {
      const response = await request(
        'GET',
        `${this.baseUri}ppd`,
        {
          record_type: type,
          file_name: fileName,
        },
      );
      if (response) {
        that.signedS3Post = response.signed_s3_post;
        const formData = populateFormData(
          that.signedS3Post,
          that.uploadParams,
        );
        that.uploadToS3(formData, successCallback, errorCallback);
      }
    } catch (error) {
      errorCallback?.(error);
    }
  }

  async uploadToS3(formData, successCallback, errorCallback) {
    try {
      const response = await request(
        'POST',
        this.createBucketUrl(),
        formData,
        {
          dataType: 'FormData',
        },
      );
      if (response) {
        successCallback?.(response);
      }
    } catch (error) {
      if (typeof errorCallback === 'function') {
        errorCallback?.(error);
      }
    }
  }

  cleanup() {
    // Reset properties
    this.uploadParams = null;
    this.attachment = null;
    this.signedS3Post = null;
  }
}

export default S3Store;
