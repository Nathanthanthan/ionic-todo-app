import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export default function useCamera() {
  async function takePicture(): Promise<string | undefined> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      if (image.webPath === undefined) return;

      return await base64FromPath(image.webPath);
    } catch (err) {
      console.error('Error: failed to take picture', err);
    }

    return;
  }

  async function selectFromGallery(): Promise<string | undefined> {
    const image = await Camera.getPhoto({
      source: CameraSource.Photos,
      resultType: CameraResultType.Uri,
    });

    if (image.webPath === undefined) return;

    return await base64FromPath(image.webPath);
  }

  async function base64FromPath(path: string): Promise<string> {
    const response = await fetch(path);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;

      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject('method did not return a string');
        }
      };

      reader.readAsDataURL(blob);
    });
  }

  return { takePicture, selectFromGallery, base64FromPath };
}
