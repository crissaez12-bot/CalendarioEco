// Archivo generado automaticamente por scripts/update-calendar.mjs
// No editar a mano — se sobreescribe en cada corrida del cron job semanal.
// Fuente: ForexFactory (feed publico no oficial) · Chile no incluido, ningun
// feed de forex trackea CLP — se sigue cargando manual aparte si hace falta.

export interface MacroEvent {
  time: string
  countryCode: string
  countryFlagCode: string
  countryLabel: string
  name: string
  actual: string
  forecast: string
  previous: string
}

export interface MacroDay {
  date: string
  label: string
  events: MacroEvent[]
}

export const CALENDAR_SOURCE = {
  provider: 'ForexFactory',
  weekLabel: 'Semana actual',
  capturedAt: '2026-08-03',
  impactFilter: 'Alto',
  countries: ['Estados Unidos', 'China', 'Eurozona / Alemania', 'Reino Unido', 'Japón'],
}

export const CALENDAR_WEEK: MacroDay[] = [
  {
    date: '2026-08-03',
    label: 'Lunes, 3 de agosto de 2026',
    events: [
      {
        time: '14:00',
        countryCode: 'USA',
        countryFlagCode: 'us',
        countryLabel: 'Estados Unidos',
        name: 'PMI manufacturero del ISM',
        actual: '-',
        forecast: '54.0',
        previous: '53.3',
      },
    ],
  },
  {
    date: '2026-08-07',
    label: 'Viernes, 7 de agosto de 2026',
    events: [
      {
        time: '12:30',
        countryCode: 'USA',
        countryFlagCode: 'us',
        countryLabel: 'Estados Unidos',
        name: 'Ingresos medios por hora m/m',
        actual: '-',
        forecast: '0.3%',
        previous: '0.3%',
      },
      {
        time: '12:30',
        countryCode: 'USA',
        countryFlagCode: 'us',
        countryLabel: 'Estados Unidos',
        name: 'Cambio en el empleo no agrícola',
        actual: '-',
        forecast: '88K',
        previous: '57K',
      },
      {
        time: '12:30',
        countryCode: 'USA',
        countryFlagCode: 'us',
        countryLabel: 'Estados Unidos',
        name: 'Tasa de desempleo',
        actual: '-',
        forecast: '4.2%',
        previous: '4.2%',
      },
    ],
  },
]
