import { useRef, useState, type ChangeEvent } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import {
  Upload,
  Download,
  FileSpreadsheet,
  Info,
  CheckCircle2,
  Loader2,
  Building2,
  BookOpen,
  GraduationCap,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import { useGrade, type GradeEntry } from '../context/GradeContext'
import { sagaApi } from '../services/api'

export function GradeHorario() {
  const { gradeEntries, setGradeEntries } = useGrade()
  const localFileInputRef = useRef<HTMLInputElement | null>(null)
  const totvsFileInputRef = useRef<HTMLInputElement | null>(null)

  // Backend upload refs
  const salaCsvRef = useRef<HTMLInputElement | null>(null)
  const cursoExcelRef = useRef<HTMLInputElement | null>(null)
  const disciplinaExcelRef = useRef<HTMLInputElement | null>(null)
  const turmaExcelRef = useRef<HTMLInputElement | null>(null)
  const professorExcelRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState<string | null>(null)

  const normalizeJoin = (value: string | undefined) => {
    if (!value) return 'N'
    const normalized = value.trim().toLowerCase()
    if (normalized === 's' || normalized === 'sim' || normalized === 'yes') return 'S'
    return 'N'
  }

  const inferPeriodFromTime = (time: string): GradeEntry['period'] => {
    const normalized = time.replace(/\s+/g, '').toLowerCase()
    if (normalized.includes('08:00-10:00')) return 'Matutino'
    if (normalized.includes('13:00-15:00')) return 'Vespertino'
    if (normalized.includes('15:30-17:30')) return 'Diurno'
    if (normalized.includes('19:30-21:10')) return 'Noite'
    return 'Noite'
  }

  const parseCsv = (text: string, delimiter = ',') => {
    const rows = text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)

    if (rows.length <= 1) {
      return []
    }

    return rows.slice(1).map((line, index) => {
      const cols = line.split(delimiter).map((cell) => cell.trim())
      const [course, discipline, time, className, teacher, room, join, students] = cols
      const period = inferPeriodFromTime(time)

      return {
        id: Date.now() + index,
        course: course ?? '',
        discipline: discipline ?? '',
        time: time ?? '',
        className: className ?? '',
        teacher: teacher ?? '',
        room: room ?? '',
        join: normalizeJoin(join),
        students: Number(students ?? 0),
        period,
        day: 'Atual' as const,
        hasClass: true,
      }
    })
  }

  const handleImportLocal = () => {
    localFileInputRef.current?.click()
  }

  const handleImportTotvs = () => {
    totvsFileInputRef.current?.click()
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>, format: 'local' | 'totvs') => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = () => {
      const text = String(reader.result ?? '')
      const delimiter = format === 'totvs' ? ';' : ','
      const importedEntries = parseCsv(text, delimiter)

      if (importedEntries.length > 0) {
        setGradeEntries((prev) => [...prev, ...importedEntries])
        toast.success(
          `Importação ${format === 'totvs' ? 'TOTVS' : 'local'} concluída — ${importedEntries.length} registro(s) adicionados`
        )
      } else {
        toast.error('Arquivo inválido ou sem registros')
      }

      event.target.value = ''
    }

    reader.readAsText(file, 'utf-8')
  }

  // Backend upload handler
  const handleBackendUpload = async (
    event: ChangeEvent<HTMLInputElement>,
    uploadFn: (file: File) => Promise<{ message: string }>,
    label: string
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(label)
    try {
      const result = await uploadFn(file)
      toast.success(result.message)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : `Erro ao importar ${label}`)
    } finally {
      setUploading(null)
      event.target.value = ''
    }
  }

  // Download professor template
  const handleDownloadTemplate = async () => {
    try {
      const blob = await sagaApi.professores.downloadTemplate()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'Template_Disponibilidade.xlsx')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
      toast.success('Template baixado com sucesso')
    } catch {
      toast.error('Erro ao baixar template. Verifique se o backend está rodando.')
    }
  }

  const handleExport = () => {
    const csvRows = [
      ['Curso', 'Disciplina', 'Horário', 'Turma', 'Professor', 'Sala+Prédio', 'Junção (S/N)', 'Alunos'],
      ...gradeEntries.map((entry) => [
        entry.course,
        entry.discipline,
        entry.time,
        entry.className,
        entry.teacher,
        entry.room,
        normalizeJoin(entry.join),
        String(entry.students),
      ]),
    ]

    const csvContent = csvRows.map((row) => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'grade-horario.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    toast.success('Grade exportada como grade-horario.csv')
  }

  // Estatísticas
  const totalStudents = gradeEntries.reduce((sum, e) => sum + e.students, 0)
  const uniqueCourses = new Set(gradeEntries.map((e) => e.course)).size
  const uniqueTeachers = new Set(gradeEntries.map((e) => e.teacher)).size

  return (
    <div className="space-y-6">
      <div>
        <h1>Grade de Horários</h1>
        <p className="text-muted-foreground">
          Importe, visualize e exporte a grade de horários em formato CSV
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Registros</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gradeEntries.length}</div>
            <p className="text-xs text-muted-foreground">na grade atual</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Alunos</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents}</div>
            <p className="text-xs text-muted-foreground">total na metodologia</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Cursos</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueCourses}</div>
            <p className="text-xs text-muted-foreground">cursos distintos</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Professores</CardTitle>
            <Info className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueTeachers}</div>
            <p className="text-xs text-muted-foreground">professores atuantes</p>
          </CardContent>
        </Card>
      </div>

      {/* Ações de Import/Export — Local (CSV) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Importação Local (CSV)
          </CardTitle>
          <CardDescription>
            Importar dados localmente para a grade do frontend
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 flex-wrap">
            <Button onClick={handleImportLocal} variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Importar Local (CSV)
            </Button>
            <Button onClick={handleImportTotvs} variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Importar TOTVS (CSV)
            </Button>
            <Button onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Exportar Grade
            </Button>
          </div>

          {/* File inputs ocultos — local */}
          <input
            type="file"
            accept=".csv"
            ref={localFileInputRef}
            style={{ display: 'none' }}
            onChange={(event) => handleFileChange(event, 'local')}
          />
          <input
            type="file"
            accept=".csv"
            ref={totvsFileInputRef}
            style={{ display: 'none' }}
            onChange={(event) => handleFileChange(event, 'totvs')}
          />
        </CardContent>
      </Card>

      {/* Importação para o Backend (API) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar para o Backend
          </CardTitle>
          <CardDescription>
            Enviar arquivos diretamente para a API Saga-Backend (porta 3000)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Button
              onClick={() => salaCsvRef.current?.click()}
              variant="outline"
              disabled={uploading !== null}
              className="justify-start"
            >
              {uploading === 'Salas' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Building2 className="mr-2 h-4 w-4" />}
              Importar Salas (CSV)
            </Button>

            <Button
              onClick={() => cursoExcelRef.current?.click()}
              variant="outline"
              disabled={uploading !== null}
              className="justify-start"
            >
              {uploading === 'Cursos' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BookOpen className="mr-2 h-4 w-4" />}
              Importar Cursos (XLSX)
            </Button>

            <Button
              onClick={() => disciplinaExcelRef.current?.click()}
              variant="outline"
              disabled={uploading !== null}
              className="justify-start"
            >
              {uploading === 'Disciplinas' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSpreadsheet className="mr-2 h-4 w-4" />}
              Importar Disciplinas (XLSX)
            </Button>

            <Button
              onClick={() => turmaExcelRef.current?.click()}
              variant="outline"
              disabled={uploading !== null}
              className="justify-start"
            >
              {uploading === 'Turmas' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <GraduationCap className="mr-2 h-4 w-4" />}
              Importar Turmas (XLSX)
            </Button>

            <Button
              onClick={() => professorExcelRef.current?.click()}
              variant="outline"
              disabled={uploading !== null}
              className="justify-start"
            >
              {uploading === 'Professores' ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Users className="mr-2 h-4 w-4" />}
              Importar Disponibilidade (XLSX)
            </Button>

            <Button
              onClick={handleDownloadTemplate}
              variant="outline"
              className="justify-start"
            >
              <Download className="mr-2 h-4 w-4" />
              Baixar Template Professor
            </Button>
          </div>

          {/* File inputs ocultos — backend */}
          <input type="file" accept=".csv" ref={salaCsvRef} style={{ display: 'none' }}
            onChange={(e) => handleBackendUpload(e, sagaApi.predios.importCsv, 'Salas')} />
          <input type="file" accept=".xlsx" ref={cursoExcelRef} style={{ display: 'none' }}
            onChange={(e) => handleBackendUpload(e, sagaApi.cursos.importExcel, 'Cursos')} />
          <input type="file" accept=".xlsx" ref={disciplinaExcelRef} style={{ display: 'none' }}
            onChange={(e) => handleBackendUpload(e, sagaApi.disciplinas.importExcel, 'Disciplinas')} />
          <input type="file" accept=".xlsx" ref={turmaExcelRef} style={{ display: 'none' }}
            onChange={(e) => handleBackendUpload(e, sagaApi.turmas.importExcel, 'Turmas')} />
          <input type="file" accept=".xlsx" ref={professorExcelRef} style={{ display: 'none' }}
            onChange={(e) => handleBackendUpload(e, sagaApi.professores.importDisponibilidade, 'Professores')} />
        </CardContent>
      </Card>

      {/* Tabela de Grade */}
      <Card>
        <CardHeader>
          <CardTitle>Dados da Grade</CardTitle>
          <CardDescription>
            {gradeEntries.length} registro(s) na grade de horários
          </CardDescription>
        </CardHeader>
        <CardContent>
          {gradeEntries.length === 0 ? (
            <div className="text-center py-8">
              <FileSpreadsheet className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3>Nenhum dado na grade</h3>
              <p className="text-muted-foreground">
                Importe um arquivo CSV para visualizar a grade de horários
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Curso</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Horário</TableHead>
                  <TableHead>Turma</TableHead>
                  <TableHead>Professor</TableHead>
                  <TableHead>Sala+Prédio</TableHead>
                  <TableHead>Junção</TableHead>
                  <TableHead>Alunos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {gradeEntries.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Badge variant="outline">{row.course}</Badge>
                    </TableCell>
                    <TableCell>{row.discipline}</TableCell>
                    <TableCell className="font-mono text-sm">{row.time}</TableCell>
                    <TableCell className="font-medium">{row.className}</TableCell>
                    <TableCell>{row.teacher}</TableCell>
                    <TableCell>{row.room}</TableCell>
                    <TableCell>
                      <Badge variant={normalizeJoin(row.join) === 'S' ? 'default' : 'secondary'}>
                        {normalizeJoin(row.join) === 'S' ? 'Sim' : 'Não'}
                      </Badge>
                    </TableCell>
                    <TableCell>{row.students}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Nota de Observação */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Observação</AlertTitle>
        <AlertDescription>
          A grade de horários é gerada a partir do processo de ensalamento. 
          Ao importar dados via CSV, certifique-se de que as colunas estejam na ordem correta: 
          Curso, Disciplina, Horário, Turma, Professor, Sala+Prédio, Junção (S/N), Alunos.
          Para importação TOTVS, utilize delimitador ponto-e-vírgula (;).
          Importações para o backend são enviadas via API para localhost:3000.
        </AlertDescription>
      </Alert>
    </div>
  )
}
