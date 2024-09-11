// eslint-disable-next-line max-len
const imageLocation = 'https://dajh2p2mfq4ra.cloudfront.net/assets/icons/ib-logo-hire-8f3406787bc4241628bb7e5bea43d56a7ab275401134c297b6631c8b81cd3996.png';
const LINK_SPEED_THRESHOLD = 400;

export async function checkBandwidth() {
  return new Promise((resolve, reject) => {
    const download = new Image();
    const startTime = (new Date()).getTime();

    download.onload = function () {
      const endTime = (new Date()).getTime();
      const duration = (endTime - startTime) / 1000;
      const imageSizeInBytes = download.width * download.height * 4;
      const imageSizeInKilobits = (imageSizeInBytes * 8) / 1024;
      const userDownloadSpeed = imageSizeInKilobits / duration;

      resolve(userDownloadSpeed < LINK_SPEED_THRESHOLD);
    };

    download.onerror = reject;
    download.src = imageLocation;
  });
}
