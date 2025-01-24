import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

export default function useCamera() {
  async function takePicture(): Promise<string> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      });

      return image.webPath || '';
    } catch (error) {
      console.error('Error: failed to take picture', error);
      throw error;
    }
  }

  async function selectFromGallery(): Promise<string> {
    const image = await Camera.getPhoto({
      source: CameraSource.Photos,
      resultType: CameraResultType.Uri,
    });

    return image.webPath || '';
  }

  return { takePicture, selectFromGallery };
}
