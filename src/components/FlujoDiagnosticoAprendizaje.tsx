import { useState } from 'react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { CheckCircle, RotateCw, XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

type QuestionNode = {
  type: 'q';
  text: string;
  yes: string;
  no: string;
  color?: string;
};

type EndNode = {
  type: 'end';
  title: string;
  color: string;
  icon?: LucideIcon;
};

type NodeDefinition = QuestionNode | EndNode;

const NODES = {
  A: {
    type: 'q',
    text: '¿Existe déficit sensorial, afectación neurológica?',
    yes: 'B',
    no: 'C',
  },
  B: {
    type: 'q',
    text: '¿Explican los trastornos de aprendizaje?',
    yes: 'Z_NO_CONT',
    no: 'C',
  },
  C: { type: 'q', text: '¿Es retraso mental?', yes: 'D', no: 'E' },
  D: {
    type: 'q',
    text: '¿Justifica los problemas de aprendizaje?',
    yes: 'Z_NO_CONT',
    no: 'E',
  },
  E: {
    type: 'q',
    text: '¿Trastorno profundo del desarrollo?',
    yes: 'F',
    no: 'G',
  },
  F: {
    type: 'q',
    text: '¿Justifica los problemas de aprendizaje?',
    yes: 'Z_NO_CONT',
    no: 'G',
  },
  G: { type: 'q', text: '¿TDAH? ¿Dislexia?', yes: 'H', no: 'I' },
  H: {
    type: 'q',
    text: '¿Justifica los problemas de aprendizaje?',
    yes: 'Z_NO_CONT',
    no: 'I',
  },
  I: {
    type: 'q',
    text: '¿Es el lenguaje adecuado al nivel de desarrollo?',
    yes: 'K',
    no: 'J',
  },
  J: { type: 'q', text: '¿Problemas de articulación?', yes: 'M', no: 'L' },
  L: {
    type: 'end',
    title: 'Diagnóstico: trastorno de expresión del lenguaje',
    color: 'bg-emerald-50 border-emerald-300',
    icon: CheckCircle,
  },
  M: {
    type: 'q',
    text: '¿Explica el retraso del lenguaje?',
    yes: 'N',
    no: 'Z_NO_CONT',
  },
  N: {
    type: 'q',
    text: '¿Explica los problemas de aprendizaje?',
    yes: 'O',
    no: 'Z_NO_CONT',
  },
  O: {
    type: 'end',
    title: 'Trastorno de la percepción',
    color: 'bg-emerald-50 border-emerald-300',
    icon: CheckCircle,
  },
  K: {
    type: 'q',
    text: '¿Tiene adecuada coordinación?',
    yes: 'Q',
    no: 'P',
  },
  P: {
    type: 'q',
    text: '¿Justifica los problemas de aprendizaje?',
    yes: 'Z_NO_CONT',
    no: 'Q',
  },
  Q: {
    type: 'q',
    text: '¿Las tareas son adecuadas al desarrollo del niño?',
    yes: 'R',
    no: 'S',
  },
  R: {
    type: 'end',
    title: 'Destacar: depresión y/o trastornos de ajuste social o del desarrollo',
    color: 'bg-amber-50 border-amber-300',
    icon: CheckCircle,
  },
  S: {
    type: 'q',
    text: '¿Desajuste de resultados escolares con otras actividades?',
    yes: 'T',
    no: 'U',
  },
  U: {
    type: 'end',
    title: 'Buscar otras causas de retraso del desarrollo',
    color: 'bg-sky-50 border-sky-300',
    icon: CheckCircle,
  },
  T: {
    type: 'q',
    text: '¿Escolarización inadecuada?',
    yes: 'W',
    no: 'V',
  },
  V: {
    type: 'end',
    title: 'Buscar otros diagnósticos',
    color: 'bg-sky-50 border-sky-300',
    icon: CheckCircle,
  },
  W: {
    type: 'q',
    text: 'Diagnóstico adecuado de bajo rendimiento escolar justifica el trastorno del aprendizaje',
    yes: 'Z_FIN_DIAG',
    no: 'Z_NO_CONT_DIAG',
  },
  Z_NO_CONT: {
    type: 'end',
    title: 'No continuar',
    color: 'bg-rose-50 border-rose-300',
    icon: XCircle,
  },
  Z_NO_CONT_DIAG: {
    type: 'end',
    title: 'No continuar diagnóstico',
    color: 'bg-rose-50 border-rose-300',
    icon: XCircle,
  },
  Z_FIN_DIAG: {
    type: 'end',
    title: 'Trastorno del aprendizaje justificado',
    color: 'bg-emerald-50 border-emerald-300',
    icon: CheckCircle,
  },
} satisfies Record<string, NodeDefinition>;

type NodeKey = keyof typeof NODES;
type Answer = 'yes' | 'no';

type TrailStep = {
  id: NodeKey;
  label: string;
  type: NodeDefinition['type'];
  question?: string;
  answer?: Answer;
  result?: string;
};

interface BreadcrumbProps {
  trail: TrailStep[];
}

function Breadcrumb({ trail }: BreadcrumbProps) {
  return (
    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
      {trail.map((step, index) => (
        <span key={`${step.id}-${index}`} className="inline-flex items-center gap-2">
          <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5">
            {step.label}
          </span>
          {index < trail.length - 1 && <span>→</span>}
        </span>
      ))}
    </div>
  );
}

interface NodeViewProps {
  nodeId: NodeKey;
  onAnswer: (answer: Answer) => void;
}

interface TrailDiagramProps {
  trail: TrailStep[];
  clientName: string;
}

function TrailDiagram({ trail, clientName }: TrailDiagramProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-1">
        <h2 className="text-lg font-semibold">Gráfico de trazabilidad</h2>
        <p className="text-sm text-muted-foreground">
          {clientName
            ? `Cliente: ${clientName}`
            : 'Añade el nombre del cliente para personalizar el seguimiento.'}
        </p>
      </div>

      <div className="mt-8 flex flex-col items-center gap-6">
        <div className="rounded-lg border-2 border-slate-200 bg-slate-50 px-6 py-3 text-center font-semibold text-slate-700 shadow-sm">
          Inicio
        </div>

        {trail.map((step, index) => (
          <div key={`${step.id}-${index}`} className="flex flex-col items-center gap-4">
            <div className="h-6 w-px bg-slate-200" aria-hidden />

            {step.type === 'q' ? (
              <div className="flex flex-col items-center gap-4">
                <div className="rounded-lg border-2 border-sky-200 bg-sky-50 px-6 py-4 text-center shadow-sm">
                  <p className="text-base font-semibold text-slate-900">
                    {step.question ?? step.label}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {step.answer
                      ? `Respuesta seleccionada: ${step.answer === 'yes' ? 'Sí' : 'No'}`
                      : 'Respuesta pendiente.'}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <div
                    className={`min-w-[120px] rounded-lg border-2 px-4 py-2 text-sm font-medium transition ${
                      step.answer === 'yes'
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-500'
                    }`}
                  >
                    Opción Sí
                  </div>
                  <div
                    className={`min-w-[120px] rounded-lg border-2 px-4 py-2 text-sm font-medium transition ${
                      step.answer === 'no'
                        ? 'border-rose-300 bg-rose-50 text-rose-700 shadow-sm'
                        : 'border-slate-200 bg-white text-slate-500'
                    }`}
                  >
                    Opción No
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border-2 border-emerald-300 bg-emerald-50 px-6 py-4 text-center shadow-sm">
                <p className="text-base font-semibold text-emerald-800">{step.result}</p>
                <p className="mt-2 text-sm text-emerald-700">Estado final alcanzado.</p>
              </div>
            )}

            {index === trail.length - 1 ? null : <div className="h-6 w-px bg-slate-200" aria-hidden />}
          </div>
        ))}
      </div>
    </section>
  );
}

function PrintableReport({ trail, clientName }: TrailDiagramProps) {
  const now = new Date();
  const formattedDate = new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'long',
  }).format(now);
  const formattedTime = new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(now);

  return (
    <section className="print-visible hidden rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">Reporte del flujo diagnóstico</h2>
      <p className="text-sm text-muted-foreground">
        Reporte generado el {formattedDate} a las {formattedTime}.
      </p>

      <div className="mt-4 space-y-4 text-sm text-slate-700">
        <p>
          <span className="font-semibold text-slate-900">Cliente:</span>{' '}
          {clientName || 'No especificado'}
        </p>

        <ol className="list-decimal space-y-3 pl-5">
          {trail.map((step, index) => (
            <li key={`${step.id}-${index}`} className="space-y-1">
              {step.type === 'q' ? (
                <>
                  <p className="font-medium text-slate-900">
                    Paso {index + 1}: {step.question ?? step.label}
                  </p>
                  <p>
                    Respuesta:{' '}
                    <span className="font-medium text-slate-900">
                      {step.answer ? (step.answer === 'yes' ? 'Sí' : 'No') : 'Pendiente'}
                    </span>
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium text-slate-900">Resultado final</p>
                  <p>{step.result}</p>
                </>
              )}
            </li>
          ))}
        </ol>

        <p className="text-xs text-muted-foreground">
          Este documento se genera automáticamente con las respuestas registradas en la herramienta digital.
        </p>
      </div>
    </section>
  );
}

function NodeView({ nodeId, onAnswer }: NodeViewProps) {
  const node: NodeDefinition | undefined = NODES[nodeId];
  if (!node) {
    return null;
  }

  if (node.type === 'q') {
    const questionNode = node as QuestionNode;
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <Card className={`border-2 shadow-sm ${questionNode.color ?? ''}`}>
          <CardContent className="space-y-6 p-6">
            <h2 className="text-xl font-semibold">{node.text}</h2>
            <div className="flex gap-3">
              <Button size="lg" onClick={() => onAnswer('yes')}>
                Sí
              </Button>
              <Button variant="secondary" size="lg" onClick={() => onAnswer('no')}>
                No
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const Icon = node.icon ?? CheckCircle;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
      <Card className={`border-2 shadow-sm ${node.color}`}>
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center gap-2">
            <Icon className="h-6 w-6" />
            <h2 className="text-xl font-semibold">{node.title}</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Fin de la ruta. Puedes reiniciar o retroceder para explorar otras ramas.
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function FlujoDiagnosticoAprendizaje() {
  const [current, setCurrent] = useState<NodeKey>('A');
  const [clientName, setClientName] = useState('');
  const [trail, setTrail] = useState<TrailStep[]>([
    {
      id: 'A',
      label: '¿Existe déficit sensorial, afectación neurológica?',
      type: 'q',
      question: '¿Existe déficit sensorial, afectación neurológica?',
    },
  ]);

  const handleAnswer = (answer: Answer) => {
    const node = NODES[current];
    if (!node || node.type !== 'q') {
      return;
    }

    const nextKey = (answer === 'yes' ? node.yes : node.no) as NodeKey;
    const nextNode = NODES[nextKey];

    if (!nextNode) {
      return;
    }

    const readableAnswer = answer === 'yes' ? 'Sí' : 'No';

    setCurrent(nextKey);
    setTrail((prev) => {
      const updatedTrail = [...prev];
      const lastIndex = updatedTrail.length - 1;
      const lastStep = updatedTrail[lastIndex];

      if (lastStep) {
        updatedTrail[lastIndex] = {
          ...lastStep,
          answer,
          label: `${lastStep.question ?? lastStep.label} → ${readableAnswer}`,
        };
      }

      if (nextNode.type === 'q') {
        updatedTrail.push({
          id: nextKey,
          label: nextNode.text,
          type: 'q',
          question: nextNode.text,
        });
      } else {
        updatedTrail.push({
          id: nextKey,
          label: `Resultado → ${nextNode.title}`,
          type: 'end',
          result: nextNode.title,
        });
      }

      return updatedTrail;
    });
  };

  const restart = () => {
    setCurrent('A');
    setTrail([
      {
        id: 'A',
        label: '¿Existe déficit sensorial, afectación neurológica?',
        type: 'q',
        question: '¿Existe déficit sensorial, afectación neurológica?',
      },
    ]);
  };

  const back = () => {
    if (trail.length <= 1) {
      return;
    }

    const newTrail = trail.slice(0, -1);
    const previousIndex = newTrail.length - 1;
    const previous = newTrail[previousIndex];

    if (!previous) {
      return;
    }

    if (previous.type === 'q') {
      newTrail[previousIndex] = {
        ...previous,
        answer: undefined,
        label: previous.question ?? previous.label,
      };
    }

    setTrail(newTrail);
    setCurrent(previous.id);
  };

  const handleDownloadReport = () => {
    if (typeof window === 'undefined') {
      return;
    }

    window.print();
  };

  return (
    <div
      id="diagnostico-root"
      className="mx-auto flex min-h-screen max-w-6xl flex-col gap-8 p-6 md:p-10 print-container"
    >
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Flujo diagnóstico de dificultades de aprendizaje
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sigue cada pregunta y registra las respuestas para obtener un reporte descargable.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 print-hidden">
          <Button variant="outline" onClick={back} disabled={trail.length <= 1}>
            Retroceder
          </Button>
          <Button onClick={restart} className="gap-2">
            <RotateCw className="h-4 w-4" /> Reiniciar
          </Button>
          <Button onClick={handleDownloadReport} className="gap-2">
            Descargar reporte (PDF)
          </Button>
        </div>
      </header>

      <section className="max-w-xl space-y-2">
        <label htmlFor="client-name" className="text-sm font-medium text-slate-700">
          Nombre del cliente o paciente
        </label>
        <input
          id="client-name"
          type="text"
          value={clientName}
          onChange={(event) => setClientName(event.target.value)}
          placeholder="Ingresa el nombre del cliente"
          className="flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm transition focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-200"
        />
        <p className="text-xs text-muted-foreground">
          El nombre se incluye automáticamente en el reporte descargable.
        </p>
      </section>

      <Breadcrumb trail={trail} />

      <NodeView nodeId={current} onAnswer={handleAnswer} />

      <p className="text-sm text-muted-foreground">
        Esta herramienta guía paso a paso replicando la lógica del diagrama original. Responde{' '}
        <strong>Sí / No</strong> para avanzar y genera el resumen con un clic.
      </p>

      <TrailDiagram trail={trail} clientName={clientName} />

      <PrintableReport trail={trail} clientName={clientName} />

      <footer className="mt-auto border-t border-slate-200 pt-4 text-center text-xs text-muted-foreground">
        Derechos reservados Aparicio Armando Capcha Chavez
      </footer>
    </div>
  );
}
