"use strict";

// Importar funciones de Firebase desde CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getDatabase, ref, set, push, get } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-database.js";

// Configuración de Firebase usando variables de entorno
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

/**
 * Guarda un voto por un producto en Firebase Realtime Database
 * @param {string} productId - ID del producto votado
 * @returns {Promise<{success: boolean, message: string}>} Resultado de la operación
 */
const saveVote = async (productId) => {
  try {
    const response = await fetch(`${firebaseConfig.databaseURL}/votes.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, timestamp: new Date().toISOString() })
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return { success: true, message: '¡Voto registrado con fetch POST!' };
  } catch (error) {
    console.error('Error guardando voto con fetch:', error);
    return { success: false, message: `Error: ${error.message}` };
  }
};

/**
 * Obtiene todos los votos almacenados en Firebase
 * @returns {Promise<{success: boolean, data?: object, message?: string}>} Votos obtenidos
 */
const getVotes = async () => {
  const votesRef = ref(database, 'votes');
  
  try {
    const snapshot = await get(votesRef);
    
    if (snapshot.exists()) {
      return { 
        success: true, 
        data: snapshot.val() 
      };
    } else {
      return { 
        success: true, 
        data: {},
        message: 'No hay votos registrados aún.' 
      };
    }
  } catch (error) {
    console.error('Error obteniendo votos:', error);
    return { 
      success: false, 
      message: `Error: ${error.message}` 
    };
  }
};

// Exportar funciones
export { saveVote, getVotes };