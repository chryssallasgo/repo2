export type Name = {
  firstName: string
  lastName: string
}

export function shuffleNames(names: Name[]): Name[] {
  const shuffledNames = [...names]

  for (let index = shuffledNames.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffledNames[index], shuffledNames[randomIndex]] = [
      shuffledNames[randomIndex],
      shuffledNames[index],
    ]
  }

  return shuffledNames
}

export function getAsciiTotal(value: string): number {
  return [...value].reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  )
}
