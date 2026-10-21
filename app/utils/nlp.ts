import type { EsiLevel, SymptomHit } from './types'

const LEXICON: Array<Omit<SymptomHit, 'phrase'> & { keys: string[] }> = [
  {
    keys: ['unresponsive', 'walay tubag', 'not breathing', 'no pulse', 'cardiac arrest'],
    system: 'Resuscitation',
    icd10: 'I46.9',
    icdLabel: 'Cardiac arrest, unspecified',
    specialty: 'Emergency Medicine',
    urgency: 10
  },
  {
    keys: ['severe bleeding', 'hemorrhage', 'dugo nga dili hunong', 'gunshot', 'stab'],
    system: 'Trauma',
    icd10: 'R58',
    icdLabel: 'Hemorrhage, not elsewhere classified',
    specialty: 'Emergency Medicine',
    urgency: 9
  },
  {
    keys: ['chest pain', 'chest discomfort', 'sakit sa dughan', 'sakit sa dibdib', 'pressure in chest', 'crushing chest'],
    system: 'Cardiovascular',
    icd10: 'R07.9',
    icdLabel: 'Chest pain, unspecified',
    specialty: 'Cardiology',
    urgency: 8
  },
  {
    keys: ['lisod pagginhawa', 'shortness of breath', 'cannot breathe', 'dyspnea', 'hapo'],
    system: 'Respiratory',
    icd10: 'R06.0',
    icdLabel: 'Dyspnea',
    specialty: 'Pulmonology',
    urgency: 8
  },
  {
    keys: ['stroke', 'weak one side', 'slurred speech', 'face droop', 'kalit nga paralisis'],
    system: 'Neurologic',
    icd10: 'I64',
    icdLabel: 'Stroke, not specified as hemorrhage or infarction',
    specialty: 'Emergency Medicine',
    urgency: 9
  },
  {
    keys: ['pregnant', 'buntis', 'bleeding in pregnancy', 'dugo samtang buntis', 'labor'],
    system: 'Obstetric',
    icd10: 'O20.9',
    icdLabel: 'Hemorrhage in early pregnancy, unspecified',
    specialty: 'OB-GYN',
    urgency: 7
  },
  {
    keys: ['fracture', 'broken bone', 'nabali', 'cannot walk after fall', 'dislocation'],
    system: 'Musculoskeletal',
    icd10: 'T14.2',
    icdLabel: 'Fracture of unspecified body region',
    specialty: 'Orthopedics',
    urgency: 6
  },
  {
    keys: ['joint swelling', 'hubag sa tuhod', 'sprain', 'sakit sa lutahan'],
    system: 'Musculoskeletal',
    icd10: 'M25.5',
    icdLabel: 'Pain in joint',
    specialty: 'Orthopedics',
    urgency: 4
  },
  {
    keys: ['polyuria', 'polydipsia', 'high sugar', 'diabetes', 'kanunay mo-ihi', 'kauhaw'],
    system: 'Endocrine',
    icd10: 'E11.9',
    icdLabel: 'Type 2 diabetes mellitus without complications',
    specialty: 'Endocrinology',
    urgency: 4
  },
  {
    keys: ['fever', 'hilanat', 'init ang lawas'],
    system: 'General',
    icd10: 'R50.9',
    icdLabel: 'Fever, unspecified',
    specialty: 'General Practice',
    urgency: 3
  },
  {
    keys: ['cough', 'ubo', 'tb', 'tuberculosis', 'night sweats'],
    system: 'Respiratory',
    icd10: 'R05',
    icdLabel: 'Cough',
    specialty: 'Pulmonology',
    urgency: 4
  },
  {
    keys: ['diarrhea', 'kalibanga', 'ors', 'dehydration', 'kusog mo-totoe'],
    system: 'Gastrointestinal',
    icd10: 'A09',
    icdLabel: 'Infectious gastroenteritis and colitis',
    specialty: 'Infectious Disease',
    urgency: 5
  },
  {
    keys: ['vomiting', 'nagsuka', 'nagsuka-suka'],
    system: 'Gastrointestinal',
    icd10: 'R11',
    icdLabel: 'Nausea and vomiting',
    specialty: 'Gastroenterology',
    urgency: 4
  },
  {
    keys: ['rash', 'pantal', 'itching', 'kati', 'hives'],
    system: 'Dermatologic',
    icd10: 'R21',
    icdLabel: 'Rash and other nonspecific skin eruption',
    specialty: 'Dermatology',
    urgency: 2
  },
  {
    keys: ['sore throat', 'sakit sa tutunlan', 'ear pain', 'sakit sa dalunggan'],
    system: 'ENT',
    icd10: 'J02.9',
    icdLabel: 'Acute pharyngitis, unspecified',
    specialty: 'ENT',
    urgency: 3
  },
  {
    keys: ['anxiety', 'depression', 'cannot sleep', 'suicidal', 'kaguol'],
    system: 'Mental health',
    icd10: 'F32.9',
    icdLabel: 'Major depressive disorder, unspecified',
    specialty: 'Psychiatry',
    urgency: 5
  },
  {
    keys: ['child', 'bata', 'infant', 'baby', 'pediatrics'],
    system: 'Pediatric',
    icd10: 'Z00.129',
    icdLabel: 'Encounter for routine child health examination',
    specialty: 'Pediatrics',
    urgency: 3
  },
  {
    keys: ['headache', 'sakit sa ulo', 'migraine'],
    system: 'Neurologic',
    icd10: 'R51',
    icdLabel: 'Headache',
    specialty: 'General Practice',
    urgency: 2
  },
  {
    keys: ['hypertension', 'high blood', 'tambok ang dugo', 'dizziness', 'lipong'],
    system: 'Cardiovascular',
    icd10: 'I10',
    icdLabel: 'Essential (primary) hypertension',
    specialty: 'General Practice',
    urgency: 3
  },
  {
    keys: ['uti', 'sakit mo-ihi', 'burning urination', 'flank pain'],
    system: 'Genitourinary',
    icd10: 'N39.0',
    icdLabel: 'Urinary tract infection, site not specified',
    specialty: 'Nephrology',
    urgency: 4
  }
]

const LABS: Record<string, string[]> = {
  Cardiology: ['12-lead ECG', 'Troponin I'],
  Orthopedics: ['X-ray of affected limb'],
  Endocrinology: ['FBS', 'HbA1c'],
  Pulmonology: ['Chest X-ray', 'Sputum AFB if TB risk'],
  'Infectious Disease': ['CBC', 'Stool exam / hydration status'],
  Nephrology: ['Urinalysis', 'Serum creatinine'],
  'OB-GYN': ['BP / fetal heart tones', 'CBC if bleeding'],
  'Emergency Medicine': ['ABCs / glucose / ECG as indicated']
}

export function extractSymptoms(text: string): SymptomHit[] {
  const hay = text.toLowerCase()
  const hits: SymptomHit[] = []
  for (const row of LEXICON) {
    const key = row.keys.find(k => hay.includes(k))
    if (key) {
      hits.push({
        phrase: key,
        system: row.system,
        icd10: row.icd10,
        icdLabel: row.icdLabel,
        specialty: row.specialty,
        urgency: row.urgency
      })
    }
  }
  return hits.sort((a, b) => b.urgency - a.urgency)
}

export function scoreEsi(hits: SymptomHit[], age: number, complaint: string): { esi: EsiLevel; label: string; bypass: boolean; transport: boolean } {
  const max = hits[0]?.urgency ?? 1
  const hay = complaint.toLowerCase()
  const pediatricFever = age < 5 && hits.some(h => h.phrase.includes('fever') || h.phrase.includes('hilanat'))

  if (max >= 9) return { esi: 1, label: 'Resuscitation', bypass: true, transport: true }
  if (max >= 8 || hay.includes('diaphoresis') || hay.includes('radiating to arm')) {
    return { esi: 2, label: 'Emergency', bypass: true, transport: true }
  }
  if (max >= 6 || pediatricFever || hay.includes('dehydration') || hay.includes('nagsuka-suka')) {
    return { esi: 3, label: 'Urgent', bypass: false, transport: false }
  }
  if (max >= 4) return { esi: 4, label: 'Less urgent', bypass: false, transport: false }
  return { esi: 5, label: 'Non-urgent', bypass: false, transport: false }
}

export function labsFor(specialty: string) {
  return LABS[specialty] ?? ['None required before GP consult']
}
