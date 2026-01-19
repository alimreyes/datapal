// lib/firebase/storage.ts
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './config';

/**
 * Sube un logo de cliente a Firebase Storage
 * @param file - Archivo de imagen a subir
 * @param reportId - ID del reporte para asociar el logo
 * @returns URL pública del logo subido
 */
export async function uploadClientLogo(
  file: File,
  reportId: string
): Promise<{ url: string; error: null } | { url: null; error: string }> {
  try {
    // Validar que sea imagen
    if (!file.type.startsWith('image/')) {
      return { url: null, error: 'El archivo debe ser una imagen' };
    }

    // Validar tamaño (máximo 2MB)
    if (file.size > 2 * 1024 * 1024) {
      return { url: null, error: 'La imagen debe ser menor a 2MB' };
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const fileName = `client-logos/${reportId}/${timestamp}.${extension}`;

    // Crear referencia en Storage
    const storageRef = ref(storage, fileName);

    // Configurar metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        reportId,
        uploadedAt: new Date().toISOString(),
      },
    };

    // Subir archivo
    await uploadBytes(storageRef, file, metadata);

    // Obtener URL pública
    const downloadURL = await getDownloadURL(storageRef);

    return { url: downloadURL, error: null };
  } catch (error) {
    console.error('Error uploading logo:', error);
    return {
      url: null,
      error: error instanceof Error ? error.message : 'Error desconocido al subir logo',
    };
  }
}

/**
 * Redimensiona una imagen antes de subirla (opcional para optimizar)
 * @param file - Archivo de imagen
 * @param maxWidth - Ancho máximo
 * @param maxHeight - Alto máximo
 * @returns Promise con el archivo redimensionado
 */
export async function resizeImage(
  file: File,
  maxWidth: number = 128,
  maxHeight: number = 128
): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Calcular nuevas dimensiones manteniendo aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo obtener contexto del canvas'));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convertir canvas a blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Error al crear blob'));
              return;
            }

            // Crear nuevo archivo con el blob redimensionado
            const resizedFile = new File([blob], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });

            resolve(resizedFile);
          },
          file.type,
          0.9 // Calidad
        );
      };

      img.onerror = () => reject(new Error('Error al cargar imagen'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Error al leer archivo'));
    reader.readAsDataURL(file);
  });
}