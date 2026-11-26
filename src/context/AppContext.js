import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  initDatabase,
  getPerfil,
  savePerfil,
  getServiciosWithProgress,
} from '../db/database';
import { scaleFont } from '../theme';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [ready, setReady] = useState(false);
  const [perfil, setPerfil] = useState(null);
  const [servicios, setServicios] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [apiKey, setApiKey] = useState(process.env.EXPO_PUBLIC_GEMINI_API_KEY || '');

  useEffect(() => {
    try {
      initDatabase();
      const loadedPerfil = getPerfil();
      const loadedServicios = getServiciosWithProgress();
      setPerfil(loadedPerfil);
      setServicios(loadedServicios);
      if (loadedServicios.length > 0) {
        setSelectedServiceId(loadedServicios[0].id);
      }
      setReady(true);
    } catch (e) {
      console.error('Error inicializando SQLite:', e);
    }
  }, []);

  const refreshServicios = (categoria = null) => {
    const list = getServiciosWithProgress(categoria);
    setServicios(list);
    return list;
  };

  const updatePerfil = (nextData) => {
    if (!perfil) return;
    const updated = savePerfil({ ...perfil, ...nextData, id: perfil.id });
    setPerfil(updated);
    return updated;
  };

  const fs = (base) => scaleFont(base, Boolean(perfil?.texto_grande));

  return (
    <AppContext.Provider
      value={{
        ready,
        perfil,
        updatePerfil,
        servicios,
        refreshServicios,
        selectedServiceId,
        setSelectedServiceId,
        apiKey,
        setApiKey,
        fs,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
