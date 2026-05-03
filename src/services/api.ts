const API_BASE_URL = 'http://localhost:3000';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const message = errorBody?.message || `Erro ${response.status}: ${response.statusText}`;
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }
  if (response.status === 204) return undefined as T;
  return response.json();
}

export const api = {
  async get<T = any>(path: string): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`);
    return handleResponse<T>(res);
  },

  async upload<T = any>(path: string, file: File, fieldName = 'file'): Promise<T> {
    const formData = new FormData();
    formData.append(fieldName, file);
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse<T>(res);
  },

  async downloadBlob(path: string): Promise<Blob> {
    const res = await fetch(`${API_BASE_URL}${path}`);
    if (!res.ok) throw new Error(`Erro ${res.status}`);
    return res.blob();
  },
};

// ---- DTOs matching existing backend responses ----

export interface HorarioSalaDTO {
  id: number;
  diaSemana: string;
  turno: string;
  horaInicio: string;
  horaFim: string;
}

export interface SalaDTO {
  id: number;
  numeroSala: string;
  capacidade: number | null;
  tipoSala: string | null;
  horarios: HorarioSalaDTO[];
}

export interface PredioDTO {
  id: number;
  nome: string;
  salas: SalaDTO[];
}

// ---- Wrappers only for endpoints that EXIST in the backend ----

export const sagaApi = {
  // GET /predios — only GET endpoint for data listing
  predios: {
    getAll: () => api.get<PredioDTO[]>('/predios'),
    importCsv: (file: File) => api.upload<{ message: string }>('/predios/importar-csv', file),
  },

  // POST-only modules (import XLSX + delete)
  cursos: {
    importExcel: (file: File) => api.upload<{ message: string }>('/cursos/importar-excel', file),
  },
  disciplinas: {
    importExcel: (file: File) => api.upload<{ message: string }>('/disciplinas/importar-excel', file),
  },
  turmas: {
    importExcel: (file: File) => api.upload<{ message: string }>('/turmas/importar-excel', file),
  },
  professores: {
    downloadTemplate: () => api.downloadBlob('/professores/template-disponibilidade'),
    importDisponibilidade: (file: File) => api.upload<{ message: string }>('/professores/importar-disponibilidade', file),
  },
};
