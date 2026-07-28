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
  capturedAt: '2026-07-28',
  impactFilter: 'Alto',
  countries: ['Estados Unidos', 'China', 'Eurozona / Alemania', 'Reino Unido', 'Japón'],
}

export const CALENDAR_WEEK: MacroDay[] = [
  {
    date: '2026-07-29',
    label: 'Miércoles, 29 de julio de 2026',
    events: [
      {
        time: '18:00',
        countryCode: 'USA',
        countryFlagCode: 'us',
        countryLabel: 'Estados Unidos',
        name: 'tipo de los fondos federales',
        actual: '-',
        forecast: '3.75%',
        previous: '3.75%',
      },
      {
        time: '18:00',
        countryCode: 'USA',
        countryFlagCode: 'us',
        countryLabel: 'Estados Unidos',
        name: 'Declaración del FOMC',
        actual: '-',
        forecast: '-',
        previous: '-',
      },
      {
        time: '18:30',
        countryCode: 'USA',
        countryFlagCode: 'us',
        countryLabel: 'Estados Unidos',
        name: 'Press conference',
        actual: '-',
        forecast: '-',
        previous: '-',
      },
    ],
  },
  {
    date: '2026-07-30',
    label: 'Jueves, 30 de julio de 2026',
    events: [
      {
        time: '11:00',
        countryCode: 'GBR',
        countryFlagCode: 'gb',
        countryLabel: 'Reino Unido',
        name: 'Informe de Política Monetaria del BOE',
        actual: '-',
        forecast: '-',
        previous: '-',
      },
      {
        time: '11:00',
        countryCode: 'GBR',
        countryFlagCode: 'gb',
        countryLabel: 'Reino Unido',
        name: 'Resumen de la política monetaria',
        actual: '-',
        forecast: '-',
        previous: '-',
      },
      {
        time: '11:00',
        countryCode: 'GBR',
        countryFlagCode: 'gb',
        countryLabel: 'Reino Unido',
        name: 'Votos de la tasa bancaria oficial del MPC',
        actual: '-',
        forecast: '2-0-7',
        previous: '2-0-7',
      },
      {
        time: '11:00',
        countryCode: 'GBR',
        countryFlagCode: 'gb',
        countryLabel: 'Reino Unido',
        name: 'Tasa bancaria oficial',
        actual: '-',
        forecast: '3.75%',
        previous: '3.75%',
      },
      {
        time: '11:30',
        countryCode: 'GBR',
        countryFlagCode: 'gb',
        countryLabel: 'Reino Unido',
        name: 'Habla el gobernador de BOE, Bailey',
        actual: '-',
        forecast: '-',
        previous: '-',
      },
      {
        time: '12:30',
        countryCode: 'USA',
        countryFlagCode: 'us',
        countryLabel: 'Estados Unidos',
        name: 'PIB t/t anticipado',
        actual: '-',
        forecast: '2.0%',
        previous: '2.0%',
      },
      {
        time: '12:30',
        countryCode: 'USA',
        countryFlagCode: 'us',
        countryLabel: 'Estados Unidos',
        name: 'Índice de precios de PCE básico m/m',
        actual: '-',
        forecast: '0.2%',
        previous: '0.3%',
      },
      {
        time: '02:30',
        countryCode: 'JPN',
        countryFlagCode: 'jp',
        countryLabel: 'Japón',
        name: 'Tasa de la póliza del Banco de Japón',
        actual: '-',
        forecast: '<1.00%',
        previous: '<1.00%',
      },
      {
        time: '02:30',
        countryCode: 'JPN',
        countryFlagCode: 'jp',
        countryLabel: 'Japón',
        name: 'Declaración de política monetaria',
        actual: '-',
        forecast: '-',
        previous: '-',
      },
      {
        time: '02:31',
        countryCode: 'JPN',
        countryFlagCode: 'jp',
        countryLabel: 'Japón',
        name: 'informe del Banco de Japón de perspectivas económicas',
        actual: '-',
        forecast: '-',
        previous: '-',
      },
    ],
  },
  {
    date: '2026-07-31',
    label: 'Viernes, 31 de julio de 2026',
    events: [
      {
        time: '05:30',
        countryCode: 'JPN',
        countryFlagCode: 'jp',
        countryLabel: 'Japón',
        name: 'Press conference',
        actual: '-',
        forecast: '-',
        previous: '-',
      },
    ],
  },
]
