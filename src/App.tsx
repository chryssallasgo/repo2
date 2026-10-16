/*
 * ACH 10/16/26
 * The dist and node_modules folder are not included in the zip file. Run "npm install", then "npm run dev" and open
 * the local URL printed by Vite.
 */
import { useState } from 'react'
import type { FormEvent } from 'react'
import { getAsciiTotal, shuffleNames } from './nameShuffler'
import type { Name } from './nameShuffler'
import './App.css'

const nameCount = 10

// ACH 10/16/26 Keep the form at exactly ten entries for the assignment.
function createEmptyNames(): Name[] {
  return Array.from({ length: nameCount }, () => ({
    firstName: '',
    lastName: '',
  }))
}

function App() {
  // ACH 10/16/26 Keep entered values separate from results so users can
  // review the submitted shuffle while retaining the original form values.
  const [names, setNames] = useState<Name[]>(createEmptyNames)
  const [submittedNames, setSubmittedNames] = useState<Name[] | null>(null)

  function handleNameChange(
    index: number,
    field: keyof Name,
    value: string,
  ) {
    setNames((currentNames) =>
      currentNames.map((name, nameIndex) =>
        nameIndex === index ? { ...name, [field]: value } : name,
      ),
    )
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // ACH 10/16/26 Shuffle each name part independently so original pairs
    // are not preserved in the submitted results.
    const firstNames = shuffleNames(
      names.map(({ firstName }) => ({ firstName, lastName: '' })),
    )
    const lastNames = shuffleNames(
      names.map(({ lastName }) => ({ firstName: '', lastName })),
    )

    setSubmittedNames(
      firstNames.map((name, index) => ({
        firstName: name.firstName,
        lastName: lastNames[index].lastName,
      })),
    )
  }

  const alphabeticallyOrderedNames =
    // ACH 10/16/26 localeCompare treats equality as zero and supports the
    // required first-name-before-or-equal-to-last-name condition.
    submittedNames?.filter(
      ({ firstName, lastName }) =>
        firstName.localeCompare(lastName) <= 0,
    ) ?? []

  const shuffledLastNames =
    // ACH 10/16/26 Reuse the displayed last-name order for ASCII totals.
    submittedNames?.map(({ lastName }) => lastName) ?? []

  return (
    <main className="app">
      <header className="page-header">
        <p className="eyebrow">React practice project</p>
        <h1>Name Shuffler</h1>
        <p>
          Enter ten names, then shuffle the first names and last names
          independently.
        </p>
      </header>

      <form className="name-form" onSubmit={handleSubmit}>
        <div className="form-heading">
          <h2>Enter names</h2>
          <span>All fields are required</span>
        </div>
        <div className="name-grid">
          {names.map((name, index) => (
            <fieldset className="name-row" key={index}>
              <legend>Name {index + 1}</legend>
              <label>
                First name
                <input
                  required
                  value={name.firstName}
                  onChange={(event) =>
                    handleNameChange(index, 'firstName', event.target.value)
                  }
                />
              </label>
              <label>
                Last name
                <input
                  required
                  value={name.lastName}
                  onChange={(event) =>
                    handleNameChange(index, 'lastName', event.target.value)
                  }
                />
              </label>
            </fieldset>
          ))}
        </div>
        <button type="submit">Submit</button>
      </form>

      {submittedNames && (
        <div className="results">
          <section className="result-card">
            <h2>Shuffled names</h2>
            <NameTable names={submittedNames} />
          </section>

          <section className="result-card">
            <h2>First name alphabetically before last name</h2>
            {alphabeticallyOrderedNames.length > 0 ? (
              <NameTable names={alphabeticallyOrderedNames} />
            ) : (
              <p className="empty-message">
                No shuffled names meet this condition.
              </p>
            )}
          </section>

          <section className="result-card">
            <h2>Last names and ASCII totals</h2>
            <table>
              <thead>
                <tr>
                  <th>Last name</th>
                  <th>ASCII total</th>
                </tr>
              </thead>
              <tbody>
                {shuffledLastNames.map((lastName, index) => (
                  <tr key={`${lastName}-${index}`}>
                    <td>{lastName}</td>
                    <td>{getAsciiTotal(lastName)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>
      )}
    </main>
  )
}

function NameTable({ names }: { names: Name[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>First name</th>
          <th>Last name</th>
        </tr>
      </thead>
      <tbody>
        {names.map((name, index) => (
          <tr key={`${name.firstName}-${name.lastName}-${index}`}>
            <td>{name.firstName}</td>
            <td>{name.lastName}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default App
