"use client";

import { Subject, CurriculumMap, Student } from "@/lib/types";
import { StudentInfoContext } from "../layout";
import { createContext, useContext, useEffect, useState } from "react";
import { getCurriculumMaps, cacheSubjectInfo } from "@/lib/api/curriculumMap-by-key";
import { AxisCard } from "@/components/ui/dashboard/lccmap/axiscard";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { set } from "date-fns";

interface SubjectShowContext {
  showAll: boolean;
  showSubject: Map<string, boolean>;
  setShowAll?: (showAll: boolean) => void;
}

const SubjectShowContext = createContext<SubjectShowContext | null>(null);

export default function Page() {
  const student = useContext(StudentInfoContext);
  const key = student?.studyPlan;
  const [curriculumMap, setCurriculumMap] = useState<CurriculumMap | null>(null);
  const [cacheSubject, setCacheSubject] = useState<Map<string, Subject>>(new Map());
  const [showAll, setShowAll] = useState(true);
  const [showSubject, setShowSubject] = useState(new Map<string, boolean>());

  useEffect(() => {
    if (key) {
      getCurriculumMaps(key).then((curriculumMap) => {
        setCurriculumMap(curriculumMap);
        if (curriculumMap) {
          const program = curriculumMap.semesters;
          cacheSubjectInfo(program).then((cache) => {
            setCacheSubject(cache);
          });
        }
      });
    }
  }, [key]);
  return curriculumMap && (
    <SubjectShowContext.Provider value={{ showAll, showSubject, setShowAll }}>
    <div className="w-full items-center">
      <div className="container grid gap-8 px-4 md:px-6">
        <div className="grid gap-4">
          <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Explora tu progreso en el plan de estudios, y las materias serializadas.
          </p>
          <h2 className="text-xl font-bold">Total de créditos</h2>
          <p className="text-4xl font-bold">{curriculumMap.totalCredits}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <AxisCard title="Básico" credits={curriculumMap.basicCredits} color="#e8eef7" />
          <AxisCard title="Común" credits={curriculumMap.commonCredits} color="#ffff66" />
          <AxisCard title="Profesionalizante" credits={curriculumMap.electiveCredits} color="#ff9966" />
          <AxisCard title="Especializante" credits={curriculumMap.specialistCredits} color="#99ff66" />
          <AxisCard title="Integrador" credits={curriculumMap.integratorCredits} color="#9966ff" />
        </div>
      </div>
      <h2 className="text-xl font-bold py-6">Mapa curricular</h2>
      <div className="md:grid md:grid-cols-8 md:gap-10 md:w-full md:h-[800px]">
        <CurriculumMapSection semesters={curriculumMap.semesters} subjectCache={cacheSubject} />
        </div>
    </div>
    </SubjectShowContext.Provider>
  );
}


function CurriculumMapSection( { semesters, subjectCache } : { semesters: string[], subjectCache: Map<string, Subject> }) {
  return (
    <>
      {semesters.map((semester, i) => (
        <div key={i} className={cn(`grid grid-rows-8 gap-2`)}>
          <div className="bg-white border-2 rounded-full absolute">
            <h4 className="">{int2roman(i + 1)}</h4>
            </div>
        <SemesterCard key={i} semester={semester} subjectCache={subjectCache} />
        </div>
      ))}
    </>
  );
}

function SemesterCard({ semester, subjectCache }: { semester: string, subjectCache: Map<string, Subject> }) {
  const subjectKeys = semester.split("-");
  return (
    <>
        {subjectKeys.map((subjectKey, i) => (
          <SubjectCard key={i} subject={subjectCache.get(subjectKey)} />
        ))}
    </>
  );
}

function SubjectCard({ subject }: { subject: Subject | undefined }) {
  const { showAll, showSubject, setShowAll } = useContext(SubjectShowContext)!;

  function subjectClick() {
    setShowAll && setShowAll(false);
    if (subject?.tracklistSubject) {
      all2false(showSubject);
      for (const key of subject.tracklistSubject) showSubject.set(key, true);
    }
  }

  function subjectLeave() {
    setShowAll && setShowAll(true);
  }


  return (
      <Card className={cn(`w-[125px] h-[100px] text-center justify-between 
      ${axisColor(subject?.branch)} hover:scale-110
      ${showAll || subject && showSubject.get(subject.subjectKey)  ? "opacity-100" : "opacity-50"}
      hover:opacity-100
      `)}
      onClick={subjectClick}
      onMouseLeave={subjectLeave}
      >
        <CardHeader>
          <CardTitle>
            <h3 className="text-[12px]">{subject?.abbr || subject?.subjectName.trim()}</h3>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            <p>{subject?.credits}</p>
          </CardDescription>
        </CardContent>
        <CardFooter />
      </Card>
  );
}

function axisColor(axis: string | undefined) {
  if (axis == "Basico") return "bg-[#e8eef7]";
  if (axis == "Comun") return "bg-[#ffff66]";
  if (axis == "Profesional") return "bg-[#ff9966]";
  if (axis == "Especializante" || axis == "Selectiva") return "bg-[#99ff66]";
  if (axis == "Integrador") return "bg-[#9966ff]";
  return "bg-[#e8ef7]";
}

function int2roman(num: number) {
  const roman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];
  return roman[num];
}

function all2false(map: Map<string, boolean>) {
  const keys = Array.from(map.keys());
  for (const key of keys) {
    map.set(key, false);
  }
}