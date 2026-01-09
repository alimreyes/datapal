import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadTaskSnapshot,
} from 'firebase/storage';
import { storage } from './config';

/**
 * Upload a file to Firebase Storage
 */
export const uploadFile = async (
  file: File,
  path: string,
  onProgress?: (progress: number) => void
): Promise<{ url: string | null; error: string | null }> => {
  try {
    const storageRef = ref(storage, path);
    
    if (onProgress) {
      // Upload with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file);
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot: UploadTaskSnapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(progress);
          },
          (error) => {
            reject({ url: null, error: error.message });
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({ url, error: null });
          }
        );
      });
    } else {
      // Simple upload without progress
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      return { url, error: null };
    }
  } catch (error: any) {
    return { url: null, error: error.message };
  }
};

/**
 * Upload multiple CSV files for a report
 */
export const uploadReportCSVs = async (
  reportId: string,
  platform: 'instagram' | 'facebook',
  category: string,
  file: File,
  onProgress?: (progress: number) => void
) => {
  const path = `reports/${reportId}/${platform}/${category}.csv`;
  return uploadFile(file, path, onProgress);
};

/**
 * Upload color palette image
 */
export const uploadPaletteImage = async (
  reportId: string,
  file: File,
  onProgress?: (progress: number) => void
) => {
  const path = `reports/${reportId}/palette/image.${file.name.split('.').pop()}`;
  return uploadFile(file, path, onProgress);
};

/**
 * Delete a file from Storage
 */
export const deleteFile = async (path: string) => {
  try {
    const fileRef = ref(storage, path);
    await deleteObject(fileRef);
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

/**
 * Get download URL for a file
 */
export const getFileURL = async (path: string) => {
  try {
    const fileRef = ref(storage, path);
    const url = await getDownloadURL(fileRef);
    return { url, error: null };
  } catch (error: any) {
    return { url: null, error: error.message };
  }
};

/**
 * List all files in a directory
 */
export const listFiles = async (path: string) => {
  try {
    const listRef = ref(storage, path);
    const result = await listAll(listRef);
    
    const files = await Promise.all(
      result.items.map(async (item) => {
        const url = await getDownloadURL(item);
        return {
          name: item.name,
          fullPath: item.fullPath,
          url,
        };
      })
    );

    return { files, error: null };
  } catch (error: any) {
    return { files: [], error: error.message };
  }
};

/**
 * Delete all files in a report folder
 */
export const deleteReportFiles = async (reportId: string) => {
  try {
    const folderRef = ref(storage, `reports/${reportId}`);
    const result = await listAll(folderRef);
    
    // Delete all files
    await Promise.all(
      result.items.map((item) => deleteObject(item))
    );

    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};