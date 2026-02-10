/**
 * Sube una imagen a Cloudinary a través de nuestra API
 * @param file - Archivo de imagen a subir
 * @param reportId - ID del reporte (opcional, para organizar en carpetas)
 * @returns URL de la imagen subida o error
 */
export async function uploadClientLogo(
  file: File,
  reportId?: string
): Promise<{ url: string; error: null } | { url: null; error: string }> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    if (reportId) {
      formData.append('reportId', reportId);
    }

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return { url: null, error: data.error || 'Error al subir imagen' };
    }

    return { url: data.url, error: null };
  } catch (error) {
    console.error('Error uploading logo:', error);
    return {
      url: null,
      error: error instanceof Error ? error.message : 'Error desconocido al subir logo',
    };
  }
}
