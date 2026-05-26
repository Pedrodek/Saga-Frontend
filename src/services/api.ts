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

  async post<T = any>(path: string, body: Record<string, unknown>): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return handleResponse<T>(res);
  },

  async put<T = any>(path: string, body: Record<string, unknown>): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    return handleResponse<T>(res);
  },

  async del<T = any>(path: string): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${path}`, { method: 'DELETE' });
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

// ---- DTOs matching backend responses ----

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

export interface CursoDTO {
  id_curso: number;
  nome: string;
  codigo_curso: string;
  _count: { turmas: number };
}

export interface DisciplinaDTO {
  id_disciplina: number;
  codigo_disciplina: string;
  nome: string;
}

export interface TurmaDTO {
  id_turma: number;
  codigo_turma: string;
  turno: string;
  quantidade: number | null;
  semestre: number;
  curso: { nome: string };
}

export interface ProfessorDTO {
  id_professor: number;
  nome: string;
  email: string;
  _count: { disciplinas: number; horarios: number };
}

export interface AgendamentoDTO {
  id_agendamento: number;
  dia_semana: string;
  hora_inicio: string;
  hora_fim: string;
  professor: { id_professor: number; nome: string };
  turma: {
    id_turma: number;
    codigo_turma: string;
    turno: string;
    quantidade: number | null;
    semestre: number;
    curso: { nome: string; codigo_curso: string };
  };
  sala: {
    id_sala: number;
    numero_sala: string;
    capacidade: number | null;
    predio: { nome: string };
  };
}

// ---- API wrappers for all endpoints ----

export const sagaApi = {
  predios: {
    getAll: () => api.get<PredioDTO[]>('/predios'),
    importCsv: (file: File) => api.upload<{ message: string }>('/predios/importar-csv', file),
  },
  cursos: {
    getAll: () => api.get<CursoDTO[]>('/cursos'),
    importExcel: (file: File) => api.upload<{ message: string }>('/cursos/importar-excel', file),
  },
  disciplinas: {
    getAll: () => api.get<DisciplinaDTO[]>('/disciplinas'),
    importExcel: (file: File) => api.upload<{ message: string }>('/disciplinas/importar-excel', file),
  },
  turmas: {
    getAll: () => api.get<TurmaDTO[]>('/turmas'),
    importExcel: (file: File) => api.upload<{ message: string }>('/turmas/importar-excel', file),
  },
  professores: {
    getAll: () => api.get<ProfessorDTO[]>('/professores'),
    downloadTemplate: () => api.downloadBlob('/professores/template-disponibilidade'),
    importDisponibilidade: (file: File) => api.upload<{ message: string }>('/professores/importar-disponibilidade', file),
  },
  agendamentos: {
    getAll: (dia?: string) => api.get<AgendamentoDTO[]>(dia ? `/agendamentos?dia=${dia}` : '/agendamentos'),
    create: (data: { id_professor: number; id_turma: number; id_sala: number; dia_semana: string; hora_inicio: string; hora_fim: string }) =>
      api.post<AgendamentoDTO>('/agendamentos', data),
    update: (id: number, data: { id_professor: number; id_turma: number; id_sala: number; dia_semana: string; hora_inicio: string; hora_fim: string }) =>
      api.put<AgendamentoDTO>(`/agendamentos/${id}`, data),
    remove: (id: number) => api.del<void>(`/agendamentos/${id}`),
  },
};
