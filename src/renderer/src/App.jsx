import { useEffect, useState } from 'react'

function App() {
  const [partners, setPartners] = useState([])

  useEffect(() => {
    window.api.getPartners().then(setPartners)
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: '1rem' }}>Партнёры</h1>

      {partners.length === 0 ? (
        <p>Нет данных о партнёрах</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {partners.map((partner) => (
            <div
              key={partner.partner_id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '6px',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}
            >
              <div>
                <strong>
                  {partner.partner_type} | {partner.partner_name}
                </strong>
                <br />
                Директор: {partner.director_name}
                <br />
                {partner.phone}
                <br />
                Рейтинг: {partner.rating}
              </div>
              <div style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                {partner.discount}%
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
