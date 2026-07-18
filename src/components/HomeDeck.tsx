const sectors = ['port', 'core', 'starboard'] as const

export function HomeDeck() {
  return (
    <div className="home-deck" aria-label="Work workspace">
      {sectors.map((sector) => (
        <section
          key={sector}
          className={`home-deck__sector home-deck__sector--${sector}`}
          aria-label={`${sector} workspace section`}
        >
          <span className="home-deck__energy-rail" aria-hidden="true" />
          <span className="home-deck__corner home-deck__corner--start" aria-hidden="true" />
          <span className="home-deck__corner home-deck__corner--end" aria-hidden="true" />
        </section>
      ))}
    </div>
  )
}
