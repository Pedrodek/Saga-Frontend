import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Pencil, Loader2, AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { sagaApi, type PredioDTO, type ProfessorDTO, type TurmaDTO } from '../services/api'
import type { GradeEntry } from '../context/GradeContext'

const DIAS = [
  { value: 'SEGUNDA', label: 'Segunda-feira' },
  { value: 'TERCA', label: 'Terça-feira' },
  { value: 'QUARTA', label: 'Quarta-feira' },
  { value: 'QUINTA', label: 'Quinta-feira' },
  { value: 'SEXTA', label: 'Sexta-feira' },
  { value: 'SABADO', label: 'Sábado' },
]

const HORARIOS = [
  { inicio: '08:00', fim: '10:00', label: '08:00 – 10:00 (Matutino)' },
  { inicio: '10:00', fim: '12:00', label: '10:00 – 12:00 (Matutino)' },
  { inicio: '13:00', fim: '15:00', label: '13:00 – 15:00 (Vespertino)' },
  { inicio: '15:30', fim: '17:30', label: '15:30 – 17:30 (Diurno)' },
  { inicio: '19:30', fim: '21:10', label: '19:30 – 21:10 (Noturno)' },
  { inicio: '21:10', fim: '22:50', label: '21:10 – 22:50 (Noturno)' },
]

interface EditarAgendamentoDialogProps {
  entry: GradeEntry
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpdated: () => void
}

const selectStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 12px',
  borderRadius: '6px',
  border: '1px solid #D1D5DB',
  fontSize: '14px',
  backgroundColor: '#fff',
  color: '#1a1a2e',
  outline: 'none',
}

export function EditarAgendamentoDialog({ entry, open, onOpenChange, onUpdated }: EditarAgendamentoDialogProps) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [professores, setProfessores] = useState<ProfessorDTO[]>([])
  const [turmas, setTurmas] = useState<TurmaDTO[]>([])
  const [predios, setPredios] = useState<PredioDTO[]>([])
  const [loadingData, setLoadingData] = useState(true)

  // Parse the entry's room to get predio name and find IDs
  const roomParts = entry.room.split(' / ')
  const entryRoomNum = roomParts[0]?.trim() ?? ''
  const entryPredioName = roomParts[1]?.trim() ?? ''

  const [professorId, setProfessorId] = useState('')
  const [turmaId, setTurmaId] = useState('')
  const [predioId, setPredioId] = useState('')
  const [salaId, setSalaId] = useState('')
  const [diaSemana, setDiaSemana] = useState(entry.day)
  const [horarioIdx, setHorarioIdx] = useState('')

  useEffect(() => {
    if (!open) return
    setLoadingData(true)
    setError(null)

    Promise.allSettled([
      sagaApi.professores.getAll(),
      sagaApi.turmas.getAll(),
      sagaApi.predios.getAll(),
    ]).then(([prof, turm, pred]) => {
      if (prof.status === 'fulfilled') {
        setProfessores(prof.value)
        const match = prof.value.find(p => p.nome === entry.teacher)
        if (match) setProfessorId(String(match.id_professor))
      }
      if (turm.status === 'fulfilled') {
        setTurmas(turm.value)
        const match = turm.value.find(t => t.codigo_turma === entry.className || t.codigo_turma === entry.discipline)
        if (match) setTurmaId(String(match.id_turma))
      }
      if (pred.status === 'fulfilled') {
        setPredios(pred.value)
        const matchPredio = pred.value.find(p => p.nome === entryPredioName)
        if (matchPredio) {
          setPredioId(String(matchPredio.id))
          const matchSala = matchPredio.salas.find(s => s.numeroSala === entryRoomNum)
          if (matchSala) setSalaId(String(matchSala.id))
        }
      }

      // Match horario
      const timeMatch = entry.time.replace(/\s/g, '')
      const idx = HORARIOS.findIndex(h => `${h.inicio}-${h.fim}` === timeMatch)
      if (idx >= 0) setHorarioIdx(String(idx))

      setDiaSemana(entry.day)
      setLoadingData(false)
    })
  }, [open])

  const selectedPredio = predios.find(p => p.id === Number(predioId))
  const salas = selectedPredio?.salas ?? []

  const canSubmit = professorId && turmaId && salaId && diaSemana && horarioIdx !== '' && !submitting

  const handleSubmit = async () => {
    if (!canSubmit) return
    setSubmitting(true)
    setError(null)

    const horario = HORARIOS[Number(horarioIdx)]

    try {
      await sagaApi.agendamentos.update(entry.id, {
        id_professor: Number(professorId),
        id_turma: Number(turmaId),
        id_sala: Number(salaId),
        dia_semana: diaSemana,
        hora_inicio: horario.inicio,
        hora_fim: horario.fim,
      })

      toast.success('Agendamento atualizado com sucesso!')
      onOpenChange(false)
      onUpdated()
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao atualizar agendamento'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent style={{ maxWidth: '520px' }}>
        <DialogHeader>
          <DialogTitle style={{ color: '#1E3A8A' }}>Editar Agendamento</DialogTitle>
          <DialogDescription>
            Altere os dados do agendamento. Conflitos serão verificados automaticamente.
          </DialogDescription>
        </DialogHeader>

        {loadingData ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" style={{ color: '#1E3A8A' }} />
            <span className="ml-2 text-muted-foreground">Carregando dados...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '4px' }}>Professor</label>
              <select style={selectStyle} value={professorId} onChange={e => setProfessorId(e.target.value)}>
                <option value="">Selecione...</option>
                {professores.map(p => <option key={p.id_professor} value={p.id_professor}>{p.nome}</option>)}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '4px' }}>Turma</label>
              <select style={selectStyle} value={turmaId} onChange={e => setTurmaId(e.target.value)}>
                <option value="">Selecione...</option>
                {turmas.map(t => <option key={t.id_turma} value={t.id_turma}>{t.codigo_turma} — {t.curso.nome} ({t.turno})</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '4px' }}>Prédio</label>
                <select style={selectStyle} value={predioId} onChange={e => { setPredioId(e.target.value); setSalaId('') }}>
                  <option value="">Prédio...</option>
                  {predios.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '4px' }}>Sala</label>
                <select style={selectStyle} value={salaId} onChange={e => setSalaId(e.target.value)} disabled={!predioId}>
                  <option value="">Sala...</option>
                  {salas.map(s => <option key={s.id} value={s.id}>{s.numeroSala} {s.capacidade ? `(${s.capacidade})` : ''}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '4px' }}>Dia</label>
                <select style={selectStyle} value={diaSemana} onChange={e => setDiaSemana(e.target.value)}>
                  <option value="">Dia...</option>
                  {DIAS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 500, color: '#374151', display: 'block', marginBottom: '4px' }}>Horário</label>
                <select style={selectStyle} value={horarioIdx} onChange={e => setHorarioIdx(e.target.value)}>
                  <option value="">Horário...</option>
                  {HORARIOS.map((h, i) => <option key={i} value={i}>{h.label}</option>)}
                </select>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-lg" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" style={{ color: '#DC2626' }} />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#DC2626' }}>Conflito detectado</p>
                  <p style={{ fontSize: '12px', color: '#991B1B' }}>{error}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={!canSubmit} style={{ backgroundColor: canSubmit ? '#1E3A8A' : undefined }}>
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Pencil className="mr-2 h-4 w-4" />}
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
