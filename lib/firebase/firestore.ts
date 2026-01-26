import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';

/**
 * Create a new document
 */
export const createDocument = async (
  collectionName: string,
  docId: string,
  data: any
) => {
  try {
    await setDoc(doc(db, collectionName, docId), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

/**
 * Get a single document
 */
export const getDocument = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { data: { id: docSnap.id, ...docSnap.data() }, error: null };
    } else {
      return { data: null, error: 'Document not found' };
    }
  } catch (error: any) {
    return { data: null, error: error.message };
  }
};

/**
 * Update a document
 */
export const updateDocument = async (
  collectionName: string,
  docId: string,
  data: any
) => {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

/**
 * Delete a document
 */
export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return { success: true, error: null };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

/**
 * Query documents with filters
 */
export const queryDocuments = async (
  collectionName: string,
  constraints: QueryConstraint[] = []
) => {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    
    const documents = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return { data: documents, error: null };
  } catch (error: any) {
    return { data: [], error: error.message };
  }
};

/**
 * Get all user reports
 */
export const getUserReports = async (userId: string) => {
  return queryDocuments('reports', [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc'),
  ]);
};

/**
 * Get a specific report
 */
export const getReport = async (reportId: string) => {
  return getDocument('reports', reportId);
};

/**
 * Create a new report
 */
export const createReport = async (reportId: string, reportData: any) => {
  return createDocument('reports', reportId, reportData);
};

/**
 * Update report status
 */
export const updateReportStatus = async (
  reportId: string,
  status: 'uploading' | 'processing' | 'ready' | 'error'
) => {
  return updateDocument('reports', reportId, { status });
};

/**
 * Update report data
 */
export const updateReportData = async (reportId: string, data: any) => {
  return updateDocument('reports', reportId, { data });
};