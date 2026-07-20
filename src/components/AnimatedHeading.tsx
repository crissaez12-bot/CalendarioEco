import { useEffect, useState, type CSSProperties } from 'react'

interface AnimatedHeadingProps {
  text: string
  className?: string
  style?: CSSProperties
  initialDelay?: number
  charDelay?: number
  charDuration?: number
}

export default function AnimatedHeading({
  text,
  className = '',
  style,
  initialDelay = 200,
  charDelay = 30,
  charDuration = 500,
}: AnimatedHeadingProps) {
  const [started, setStarted] = useState(false)
  const lines = text.split('\n')

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), initialDelay)
    return () => clearTimeout(timer)
  }, [initialDelay])

  return (
    <h1 className={className} style={style}>
      {lines.map((line, lineIndex) => {
        // Se agrupan los caracteres por palabra (inline-block por palabra) para
        // que el navegador solo pueda cortar la linea entre palabras, nunca en
        // medio de una — si no, cada letra es su propia caja y corta donde quiera.
        const tokens = line.split(/(\s+)/).filter((t) => t.length > 0)
        let charCount = 0

        return (
          <span key={lineIndex} className="block">
            {tokens.map((token, tokenIndex) => {
              const isSpace = /^\s+$/.test(token)

              if (isSpace) {
                const delay = lineIndex * line.length * charDelay + charCount * charDelay
                charCount += token.length
                return (
                  <span
                    key={tokenIndex}
                    className="inline-block"
                    style={{
                      opacity: started ? 1 : 0,
                      transition: `opacity ${charDuration}ms`,
                      transitionDelay: `${delay}ms`,
                    }}
                  >
                    {token.replace(/ /g, ' ')}
                  </span>
                )
              }

              const chars = token.split('')
              const startIndex = charCount
              charCount += chars.length

              return (
                <span key={tokenIndex} className="inline-block whitespace-nowrap">
                  {chars.map((char, charIndex) => {
                    const delay = lineIndex * line.length * charDelay + (startIndex + charIndex) * charDelay
                    return (
                      <span
                        key={charIndex}
                        className="inline-block"
                        style={{
                          opacity: started ? 1 : 0,
                          transform: started ? 'translateX(0)' : 'translateX(-18px)',
                          transition: `opacity ${charDuration}ms, transform ${charDuration}ms`,
                          transitionDelay: `${delay}ms`,
                        }}
                      >
                        {char}
                      </span>
                    )
                  })}
                </span>
              )
            })}
          </span>
        )
      })}
    </h1>
  )
}
