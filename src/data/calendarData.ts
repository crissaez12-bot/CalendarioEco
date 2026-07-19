// NOTA: este archivo lo sobreescribe scripts/update-calendar.mjs una vez que
// el cron job de Render corra por primera vez con exito. Mientras tanto,
// contiene los datos reales capturados a mano desde Flickflow el 18/07/2026.

export interface MacroEvent {
  time: string
  countryCode: string
  countryFlag: string
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
  provider: 'Flickflow (captura manual, pendiente primer corrida automática)',
  weekLabel: 'Julio 14-20, 2026',
  capturedAt: '2026-07-18',
  impactFilter: 'Alto',
  countries: ['Estados Unidos', 'China', 'Alemania', 'Zona euro', 'Reino Unido', 'Japón'],
}

export const CALENDAR_WEEK: MacroDay[] = [
  {
    date: '2026-07-14',
    label: 'Martes, 14 de julio de 2026',
    events: [
      {
        time: '08:30',
        countryCode: 'USA',
        countryFlag: '🇺🇸',
        countryLabel: 'Estados Unidos',
        name: 'Inflation Rate Mom',
        actual: '-0.4%',
        forecast: '-0.1%',
        previous: '0.5%',
      },
      {
        time: '08:30',
        countryCode: 'USA',
        countryFlag: '🇺🇸',
        countryLabel: 'Estados Unidos',
        name: 'Tasa de inflación subyacente (Interanual)',
        actual: '2.6%',
        forecast: '2.8%',
        previous: '2.9%',
      },
      {
        time: '08:30',
        countryCode: 'USA',
        countryFlag: '🇺🇸',
        countryLabel: 'Estados Unidos',
        name: 'Tasa de Inflación (IR) interanual (YoY)',
        actual: '3.5%',
        forecast: '3.8%',
        previous: '4.2%',
      },
      {
        time: '08:30',
        countryCode: 'USA',
        countryFlag: '🇺🇸',
        countryLabel: 'Estados Unidos',
        name: 'Tasa de inflación subyacente (Mensual)',
        actual: '0%',
        forecast: '0.2%',
        previous: '0.2%',
      },
      {
        time: '22:00',
        countryCode: 'CHN',
        countryFlag: '🇨🇳',
        countryLabel: 'China',
        name: 'Tasa de crecimiento del PIB interanual',
        actual: '4.3%',
        forecast: '4.5%',
        previous: '5%',
      },
      {
        time: '22:00',
        countryCode: 'CHN',
        countryFlag: '🇨🇳',
        countryLabel: 'China',
        name: 'Ventas al por menor (Interanual)',
        actual: '1%',
        forecast: '-0.1%',
        previous: '-0.6%',
      },
      {
        time: '22:00',
        countryCode: 'CHN',
        countryFlag: '🇨🇳',
        countryLabel: 'China',
        name: 'Producción Industrial interanual',
        actual: '5.3%',
        forecast: '4.6%',
        previous: '4.5%',
      },
    ],
  },
  {
    date: '2026-07-15',
    label: 'Miércoles, 15 de julio de 2026',
    events: [
      {
        time: '08:30',
        countryCode: 'USA',
        countryFlag: '🇺🇸',
        countryLabel: 'Estados Unidos',
        name: 'IPP (Mensual)',
        actual: '-0.3%',
        forecast: '0%',
        previous: '0.6%',
      },
    ],
  },
  {
    date: '2026-07-16',
    label: 'Jueves, 16 de julio de 2026',
    events: [
      {
        time: '02:00',
        countryCode: 'GBR',
        countryFlag: '🇬🇧',
        countryLabel: 'Reino Unido',
        name: 'PIB (Mensual)',
        actual: '0.1%',
        forecast: '0.1%',
        previous: '-0.1%',
      },
      {
        time: '08:30',
        countryCode: 'USA',
        countryFlag: '🇺🇸',
        countryLabel: 'Estados Unidos',
        name: 'Ventas al por menor (Mensual)',
        actual: '0.2%',
        forecast: '0.2%',
        previous: '1%',
      },
    ],
  },
  {
    date: '2026-07-17',
    label: 'Viernes, 17 de julio de 2026',
    events: [
      {
        time: '08:30',
        countryCode: 'USA',
        countryFlag: '🇺🇸',
        countryLabel: 'Estados Unidos',
        name: 'Inicios de vivienda',
        actual: '1.427M',
        forecast: '1.31M',
        previous: '1.199M',
      },
      {
        time: '08:30',
        countryCode: 'USA',
        countryFlag: '🇺🇸',
        countryLabel: 'Estados Unidos',
        name: 'Permisos de construcción preliminar',
        actual: '1.367M',
        forecast: '1.40M',
        previous: '1.41M',
      },
      {
        time: '10:00',
        countryCode: 'USA',
        countryFlag: '🇺🇸',
        countryLabel: 'Estados Unidos',
        name: 'Sentimiento del consumidor Michigan preliminar',
        actual: '54.4',
        forecast: '51',
        previous: '49.5',
      },
    ],
  },
]
