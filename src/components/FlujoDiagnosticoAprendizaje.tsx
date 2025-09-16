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
  const [trail, setTrail] = useState<TrailStep[]>([
    { id: 'A', label: '¿Existe déficit sensorial, afectación neurológica?' },
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

    setCurrent(nextKey);
    setTrail((prev) => [
      ...prev,
      {
        id: nextKey,
        label: (() => {
          const responseLabel = `${node.text} → ${answer === 'yes' ? 'Sí' : 'No'}`;
          return nextNode.type === 'end'
            ? `${responseLabel} → ${nextNode.title}`
            : responseLabel;
        })(),
      },
    ]);
  };

  const restart = () => {
    setCurrent('A');
    setTrail([{ id: 'A', label: '¿Existe déficit sensorial, afectación neurológica?' }]);
  };

  const back = () => {
    if (trail.length <= 1) {
      return;
    }
    const newTrail = trail.slice(0, -1);
    const previous = newTrail[newTrail.length - 1];
    setTrail(newTrail);
    setCurrent(previous.id);
  };

  return (
    <div className="mx-auto space-y-6 p-6 md:p-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Flujo diagnóstico de dificultades de aprendizaje</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={back} disabled={trail.length <= 1}>
            Retroceder
          </Button>
          <Button onClick={restart} className="gap-2">
            <RotateCw className="h-4 w-4" /> Reiniciar
          </Button>
        </div>
      </div>

      <Breadcrumb trail={trail} />

      <NodeView nodeId={current} onAnswer={handleAnswer} />

      <div className="pt-2 text-sm text-muted-foreground">
        <p>
          Esta herramienta guía paso a paso replicando la lógica del diagrama original. Responde{' '}
          <strong>Sí / No</strong> para avanzar.
        </p>
      </div>
    </div>
  );
}
