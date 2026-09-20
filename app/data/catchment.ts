/** 31 Valencia City barangays mapped to the nearest RHU / BHS in this prototype. */
export interface BarangayCatchment {
  name: string
  code: string
  homeFacilityId: string
}

export const BARANGAYS: BarangayCatchment[] = [
  { name: 'Bagontaas', code: 'BGT', homeFacilityId: 'rhu2' },
  { name: 'Banlag', code: 'BNL', homeFacilityId: 'rhu2' },
  { name: 'Barobo', code: 'BRB', homeFacilityId: 'bhs-sancarlos' },
  { name: 'Batangan', code: 'BTN', homeFacilityId: 'rhu2' },
  { name: 'Catumbalon', code: 'CTM', homeFacilityId: 'rhu1' },
  { name: 'Colonia', code: 'COL', homeFacilityId: 'rhu1' },
  { name: 'Concepcion', code: 'CNC', homeFacilityId: 'rhu2' },
  { name: 'Dagat-Kidavao', code: 'DKD', homeFacilityId: 'rhu2' },
  { name: 'Guinoyuran', code: 'GNY', homeFacilityId: 'rhu2' },
  { name: 'Kahapunan', code: 'KHP', homeFacilityId: 'rhu2' },
  { name: 'Laligan', code: 'LLG', homeFacilityId: 'bhs-mailag' },
  { name: 'Lilingayon', code: 'LLN', homeFacilityId: 'bhs-lumbayao' },
  { name: 'Lourdes', code: 'LRD', homeFacilityId: 'bhs-lumbayao' },
  { name: 'Lumbayao', code: 'LMB', homeFacilityId: 'bhs-lumbayao' },
  { name: 'Lumbo', code: 'LMO', homeFacilityId: 'rhu1' },
  { name: 'Lurugan', code: 'LRG', homeFacilityId: 'bhs-lumbayao' },
  { name: 'Maapag', code: 'MPG', homeFacilityId: 'rhu1' },
  { name: 'Mabuhay', code: 'MBH', homeFacilityId: 'bhs-sancarlos' },
  { name: 'Mailag', code: 'MLG', homeFacilityId: 'bhs-mailag' },
  { name: 'Mt. Nebo', code: 'NEB', homeFacilityId: 'bhs-lumbayao' },
  { name: 'Nabag-o', code: 'NBO', homeFacilityId: 'rhu1' },
  { name: 'Pinatilan', code: 'PNT', homeFacilityId: 'rhu1' },
  { name: 'Poblacion', code: 'POB', homeFacilityId: 'rhu1' },
  { name: 'San Carlos', code: 'SCL', homeFacilityId: 'bhs-sancarlos' },
  { name: 'San Isidro', code: 'SID', homeFacilityId: 'bhs-sancarlos' },
  { name: 'Sinabuagan', code: 'SNB', homeFacilityId: 'bhs-sancarlos' },
  { name: 'Sinayawan', code: 'SNY', homeFacilityId: 'bhs-mailag' },
  { name: 'Sugod', code: 'SGD', homeFacilityId: 'bhs-mailag' },
  { name: 'Tongantongan', code: 'TNG', homeFacilityId: 'bhs-mailag' },
  { name: 'Tugaya', code: 'TGY', homeFacilityId: 'rhu1' },
  { name: 'Vintar', code: 'VNT', homeFacilityId: 'rhu1' }
]

const STATION_NAME: Record<string, string> = {
  rhu1: 'Valencia RHU 1',
  rhu2: 'Valencia RHU 2',
  'bhs-mailag': 'BHS Mailag',
  'bhs-lumbayao': 'BHS Lumbayao',
  'bhs-sancarlos': 'BHS San Carlos'
}

export function catchmentOf(barangay: string): BarangayCatchment {
  const key = barangay.trim().toLowerCase()
  return BARANGAYS.find(b => b.name.toLowerCase() === key)
    ?? BARANGAYS.find(b => key.includes(b.name.toLowerCase()) || b.name.toLowerCase().includes(key))
    ?? BARANGAYS.find(b => b.name === 'Poblacion')!
}

export function stationName(facilityId: string) {
  return STATION_NAME[facilityId] ?? facilityId
}

export function homeStationOf(barangay: string) {
  const home = catchmentOf(barangay)
  return { ...home, station: stationName(home.homeFacilityId) }
}

export function nextResidentId(barangay: string, existing: { residentId?: string }[]) {
  const prefix = `VLC-${catchmentOf(barangay).code}-`
  let max = 0
  for (const row of existing) {
    const id = row.residentId || ''
    if (!id.startsWith(prefix)) continue
    const n = Number(id.slice(prefix.length))
    if (Number.isFinite(n) && n > max) max = n
  }
  return `${prefix}${String(max + 1).padStart(4, '0')}`
}
