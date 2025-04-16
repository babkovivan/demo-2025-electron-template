import { useEffect, useState } from 'react'

function App() {
  const [partners, setPartners] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [newPartner, setNewPartner] = useState({
    partner_type: '',
    partner_name: '',
    director_name: '',
    email: '',
    phone: '',
    legal_address: '',
    inn: '',
    rating: ''
  })

  const fetchPartners = () => {
    window.api.getPartners().then(setPartners)
  }

  useEffect(() => {
    fetchPartners()
  }, [])

  const handleInputChange = (e) => {
    setNewPartner({ ...newPartner, [e.target.name]: e.target.value })
  }

  const handleAdd = () => {
    window.api.addPartner(newPartner).then(() => {
      fetchPartners()
      setNewPartner({
        partner_type: '',
        partner_name: '',
        director_name: '',
        email: '',
        phone: '',
        legal_address: '',
        inn: '',
        rating: ''
      })
      setShowForm(false)
    })
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Партнёры</h1>

      <button onClick={() => setShowForm(!showForm)} style={{ marginBottom: '1rem' }}>
        {showForm ? 'Скрыть форму' : 'Добавить партнёра'}
      </button>

      {showForm && (
        <div style={{ marginBottom: '2rem' }}>
          <input name="partner_type" placeholder="Тип (ООО, ЗАО...)" value={newPartner.partner_type} onChange={handleInputChange} /><br />
          <input name="partner_name" placeholder="Название" value={newPartner.partner_name} onChange={handleInputChange} /><br />
          <input name="director_name" placeholder="ФИО директора" value={newPartner.director_name} onChange={handleInputChange} /><br />
          <input name="email" placeholder="Email" value={newPartner.email} onChange={handleInputChange} /><br />
          <input name="phone" placeholder="Телефон" value={newPartner.phone} onChange={handleInputChange} /><br />
          <input name="legal_address" placeholder="Адрес" value={newPartner.legal_address} onChange={handleInputChange} /><br />
          <input name="inn" placeholder="ИНН" value={newPartner.inn} onChange={handleInputChange} /><br />
          <input name="rating" placeholder="Рейтинг" value={newPartner.rating} onChange={handleInputChange} /><br />
          <button onClick={handleAdd}>Добавить</button>
        </div>
      )}

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
    </div>
  )
}

export default App
