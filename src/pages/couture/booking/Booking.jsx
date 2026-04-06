// ── Booking.jsx ───────────────────────────────────────────────────────────────
// Multi-step appointment booking page.
//
// ADAPT FOR YOUR PROJECT:
// - Replace the Header/MobileNav/Footer imports with your project's layout components,
//   or remove them if your layout wraps routes globally.
// - Update the privacy policy link (/privacy-policy) to match your route.
// - Update the "Back to Home" link (/home) to match your home route.
// - The confirmation screen shows VITE_ADMIN_EMAIL and VITE_BUSINESS_PHONE —
//   set these in your .env.local and Vercel environment variables.

import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
// TODO: Replace these with your project's layout components
// import Header from '../../components/Header/Header'
// import MobileNav from '../../components/MobileNav/MobileNav'
// import Footer from '../../components/Footer/Footer'
import './Booking.css'

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || ''
const BUSINESS_PHONE = import.meta.env.VITE_BUSINESS_PHONE || ''

const STEPS = ['Service', 'Date', 'Time', 'Meeting', 'Details', 'Confirm']

// ── Mini Calendar Component ──────────────────────────────────────────────────
function BookingCalendar({ selectedDate, onSelectDate, serviceId }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [unavailableDates, setUnavailableDates] = useState(new Set())
  const [loadingDates, setLoadingDates] = useState(false)

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

  useEffect(() => {
    if (!serviceId) return
    setLoadingDates(true)

    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
    const checks = []

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const dayDate = new Date(dateStr + 'T00:00:00')
      if (dayDate >= today) {
        checks.push(
          fetch(`/api/booking/availability?date=${dateStr}&serviceId=${serviceId}`)
            .then(r => r.json())
            .then(data => ({ date: dateStr, available: data.slots && data.slots.length > 0 }))
            .catch(() => ({ date: dateStr, available: false }))
        )
      }
    }

    Promise.all(checks).then(results => {
      const unavail = new Set(results.filter(r => !r.available).map(r => r.date))
      setUnavailableDates(unavail)
      setLoadingDates(false)
    })
  }, [viewYear, viewMonth, serviceId])

  const firstDay = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="booking-calendar">
      <div className="cal-header">
        <button className="cal-nav-btn" onClick={prevMonth} aria-label="Previous month">&#8249;</button>
        <span className="cal-month-label">{monthNames[viewMonth]} {viewYear}</span>
        <button className="cal-nav-btn" onClick={nextMonth} aria-label="Next month">&#8250;</button>
      </div>
      <div className="cal-day-names">
        {dayNames.map(d => <span key={d} className="cal-day-name">{d}</span>)}
      </div>
      <div className={`cal-grid ${loadingDates ? 'cal-loading' : ''}`}>
        {cells.map((day, idx) => {
          if (!day) return <span key={`e${idx}`} className="cal-cell empty" />
          const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const dayDate = new Date(dateStr + 'T00:00:00')
          const isPast = dayDate < today
          const isUnavail = unavailableDates.has(dateStr)
          const isSelected = selectedDate === dateStr
          const isDisabled = isPast || isUnavail
          return (
            <button
              key={dateStr}
              className={`cal-cell ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : 'available'}`}
              onClick={() => !isDisabled && onSelectDate(dateStr)}
              disabled={isDisabled}
              aria-label={`${day} ${monthNames[viewMonth]}`}
              aria-pressed={isSelected}
            >
              {day}
            </button>
          )
        })}
      </div>
      {loadingDates && <p className="cal-loading-text">Checking availability…</p>}
    </div>
  )
}

// ── Main Booking Page ─────────────────────────────────────────────────────────
export default function Booking() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [step, setStep] = useState(0)

  const [services, setServices] = useState([])
  const [selectedService, setSelectedService] = useState(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [availableSlots, setAvailableSlots] = useState([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [meetingType, setMeetingType] = useState('')

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', notes: '',
    gdprConsent: false, honeypot: '',
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [booking, setBooking] = useState(null)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => { window.scrollTo(0, 0) }, [])

  useEffect(() => {
    fetch('/api/booking/services')
      .then(r => r.json())
      .then(data => setServices(data.services || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!selectedDate || !selectedService) return
    setLoadingSlots(true)
    setAvailableSlots([])
    setSelectedSlot(null)
    fetch(`/api/booking/availability?date=${selectedDate}&serviceId=${selectedService.id}`)
      .then(r => r.json())
      .then(data => { setAvailableSlots(data.slots || []); setLoadingSlots(false) })
      .catch(() => setLoadingSlots(false))
  }, [selectedDate, selectedService])

  const toggleMobileMenu = () => setIsMobileMenuOpen(o => !o)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateDetails = () => {
    const errs = {}
    if (!formData.firstName.trim()) errs.firstName = 'First name is required'
    if (!formData.lastName.trim()) errs.lastName = 'Last name is required'
    if (!formData.email.trim()) errs.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Enter a valid email'
    if (!formData.gdprConsent) errs.gdprConsent = 'Please agree to the privacy policy to continue'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validateDetails()) return
    setIsSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/booking/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: selectedService.id, date: selectedDate,
          startTime: selectedSlot.start, meetingType,
          firstName: formData.firstName, lastName: formData.lastName,
          email: formData.email, phone: formData.phone,
          notes: formData.notes, gdprConsent: formData.gdprConsent,
          honeypot: formData.honeypot,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setBooking(data)
        setStep(5)
        window.scrollTo(0, 0)
      } else {
        setSubmitError(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setSubmitError('Could not connect. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (d) => {
    if (!d) return ''
    const [y, m, day] = d.split('-').map(Number)
    return new Date(y, m - 1, day).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }

  const progressPct = Math.round((step / (STEPS.length - 1)) * 100)

  return (
    <div className="booking-page">
      {/* TODO: Add your Header here */}
      {/* <Header onMobileMenuToggle={toggleMobileMenu} /> */}
      {/* <MobileNav isOpen={isMobileMenuOpen} onClose={closeMobileMenu} /> */}

      <main className="booking-main">
        <div className="booking-container">

          <div className="booking-header">
            <h1 className="booking-title">Book a Consultation</h1>
            <p className="booking-subtitle">Free, no-obligation — let's find a time that works for you.</p>
          </div>

          {step < 5 && (
            <div className="booking-progress">
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPct}%` }} />
              </div>
              <p className="progress-label">Step {step + 1} of {STEPS.length - 1}: <strong>{STEPS[step]}</strong></p>
            </div>
          )}

          <div className="booking-card">

            {/* Step 0: Service */}
            {step === 0 && (
              <div className="booking-step">
                <h2 className="step-title">What can I help you with?</h2>
                <div className="service-grid">
                  {services.map(svc => (
                    <button
                      key={svc.id}
                      className={`service-card ${selectedService?.id === svc.id ? 'selected' : ''}`}
                      onClick={() => { setSelectedService(svc); setStep(1) }}
                    >
                      <span className="service-name">{svc.name}</span>
                      <span className="service-duration">{svc.duration_minutes} min</span>
                      {svc.description && <p className="service-desc">{svc.description}</p>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 1: Date */}
            {step === 1 && (
              <div className="booking-step">
                <h2 className="step-title">Choose a date</h2>
                {selectedService && (
                  <p className="step-subtitle"><strong>{selectedService.name}</strong> · {selectedService.duration_minutes} min</p>
                )}
                <BookingCalendar
                  selectedDate={selectedDate}
                  onSelectDate={(d) => { setSelectedDate(d); setStep(2) }}
                  serviceId={selectedService?.id}
                />
                <div className="step-actions">
                  {services.length > 1 && (
                    <button className="btn-back" onClick={() => setStep(0)}>← Back</button>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Time */}
            {step === 2 && (
              <div className="booking-step">
                <h2 className="step-title">Choose a time</h2>
                <p className="step-subtitle">{formatDate(selectedDate)}</p>
                {loadingSlots && <p className="slots-loading">Loading available times…</p>}
                {!loadingSlots && availableSlots.length === 0 && (
                  <div className="slots-empty">
                    <p>No times available on this date.</p>
                    <button className="btn-secondary" onClick={() => { setSelectedDate(''); setStep(1) }}>Choose another date</button>
                  </div>
                )}
                {!loadingSlots && availableSlots.length > 0 && (
                  <div className="slots-grid">
                    {availableSlots.map(slot => (
                      <button
                        key={slot.start}
                        className={`slot-pill ${selectedSlot?.start === slot.start ? 'selected' : ''}`}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {slot.label}
                      </button>
                    ))}
                  </div>
                )}
                <div className="step-actions">
                  <button className="btn-back" onClick={() => { setSelectedDate(''); setSelectedSlot(null); setStep(1) }}>← Back</button>
                  {selectedSlot && <button className="btn-next" onClick={() => setStep(3)}>Continue →</button>}
                </div>
              </div>
            )}

            {/* Step 3: Meeting type */}
            {step === 3 && (
              <div className="booking-step">
                <h2 className="step-title">How would you like to meet?</h2>
                <p className="step-subtitle">{formatDate(selectedDate)} · {selectedSlot?.label}</p>
                <div className="meeting-type-grid">
                  <button className={`meeting-type-card ${meetingType === 'phone' ? 'selected' : ''}`} onClick={() => setMeetingType('phone')}>
                    <span className="meeting-icon">📞</span>
                    <span className="meeting-label">Phone Call</span>
                    <span className="meeting-desc">I'll call you at your preferred number</span>
                  </button>
                  <button className={`meeting-type-card ${meetingType === 'in_person' ? 'selected' : ''}`} onClick={() => setMeetingType('in_person')}>
                    <span className="meeting-icon">🤝</span>
                    <span className="meeting-label">In Person</span>
                    <span className="meeting-desc">Meet at a location we agree on</span>
                  </button>
                </div>
                <div className="step-actions">
                  <button className="btn-back" onClick={() => setStep(2)}>← Back</button>
                  <button className="btn-next" disabled={!meetingType} onClick={() => meetingType && setStep(4)}>Continue →</button>
                </div>
              </div>
            )}

            {/* Step 4: Details */}
            {step === 4 && (
              <div className="booking-step">
                <h2 className="step-title">Your details</h2>
                <p className="step-subtitle">Almost there — just a few things so I can reach you.</p>
                <input type="text" name="honeypot" value={formData.honeypot} onChange={handleFormChange}
                  style={{ display: 'none' }} tabIndex={-1} autoComplete="off" aria-hidden="true" />
                <div className="details-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="firstName">First Name <span className="required">*</span></label>
                      <input id="firstName" name="firstName" type="text" value={formData.firstName}
                        onChange={handleFormChange} className={errors.firstName ? 'error' : ''}
                        placeholder="First" autoComplete="given-name" />
                      {errors.firstName && <span className="form-error">{errors.firstName}</span>}
                    </div>
                    <div className="form-group">
                      <label htmlFor="lastName">Last Name <span className="required">*</span></label>
                      <input id="lastName" name="lastName" type="text" value={formData.lastName}
                        onChange={handleFormChange} className={errors.lastName ? 'error' : ''}
                        placeholder="Last" autoComplete="family-name" />
                      {errors.lastName && <span className="form-error">{errors.lastName}</span>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address <span className="required">*</span></label>
                    <input id="email" name="email" type="email" value={formData.email}
                      onChange={handleFormChange} className={errors.email ? 'error' : ''}
                      placeholder="you@example.com" autoComplete="email" />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">
                      Phone Number {meetingType === 'phone' && <span className="recommended">(recommended for phone calls)</span>}
                    </label>
                    <input id="phone" name="phone" type="tel" value={formData.phone}
                      onChange={handleFormChange} placeholder="+1 (000) 000-0000" autoComplete="tel" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="notes">Anything you'd like me to know? <span className="optional">(optional)</span></label>
                    <textarea id="notes" name="notes" value={formData.notes} onChange={handleFormChange}
                      placeholder="Tell me a bit about what you'd like to discuss…" rows={4} />
                  </div>
                  <div className="form-group gdpr-group">
                    <label className={`gdpr-label ${errors.gdprConsent ? 'error' : ''}`}>
                      <input type="checkbox" name="gdprConsent" checked={formData.gdprConsent} onChange={handleFormChange} />
                      <span>
                        I agree to the{' '}
                        <Link to="#" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>
                        {' '}and consent to my data being processed to schedule this consultation.
                      </span>
                    </label>
                    {errors.gdprConsent && <span className="form-error">{errors.gdprConsent}</span>}
                  </div>
                </div>
                <div className="step-actions">
                  <button className="btn-back" onClick={() => setStep(3)}>← Back</button>
                  <button className="btn-next" onClick={() => { if (validateDetails()) setStep(5) }}>Review Booking →</button>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {step === 5 && !booking && (
              <div className="booking-step">
                <h2 className="step-title">Review your booking</h2>
                <div className="booking-summary">
                  <div className="summary-row"><span className="summary-label">Service</span><span className="summary-value">{selectedService?.name}</span></div>
                  <div className="summary-row"><span className="summary-label">Date</span><span className="summary-value">{formatDate(selectedDate)}</span></div>
                  <div className="summary-row"><span className="summary-label">Time</span><span className="summary-value">{selectedSlot?.label}</span></div>
                  <div className="summary-row"><span className="summary-label">Format</span><span className="summary-value">{meetingType === 'phone' ? '📞 Phone Call' : '🤝 In Person'}</span></div>
                  <div className="summary-row"><span className="summary-label">Name</span><span className="summary-value">{formData.firstName} {formData.lastName}</span></div>
                  <div className="summary-row"><span className="summary-label">Email</span><span className="summary-value">{formData.email}</span></div>
                  {formData.phone && <div className="summary-row"><span className="summary-label">Phone</span><span className="summary-value">{formData.phone}</span></div>}
                  {formData.notes && <div className="summary-row"><span className="summary-label">Notes</span><span className="summary-value">{formData.notes}</span></div>}
                </div>
                {submitError && (
                  <div className="submit-error">
                    <p>{submitError}</p>
                    {submitError.includes('no longer available') && (
                      <button className="btn-secondary" onClick={() => { setSelectedSlot(null); setStep(2) }}>Choose another time</button>
                    )}
                  </div>
                )}
                <div className="step-actions">
                  <button className="btn-back" onClick={() => setStep(4)}>← Edit Details</button>
                  <button className="btn-confirm" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? 'Confirming…' : 'Confirm Booking'}
                  </button>
                </div>
              </div>
            )}

            {/* Confirmed */}
            {step === 5 && booking && (
              <div className="booking-step booking-confirmed">
                <div className="confirmed-icon">
                  <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="26" cy="26" r="25" stroke="currentColor" strokeWidth="2"/>
                    <path d="M14 26l8 8 16-16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="confirmed-title">You're booked!</h2>
                <p className="confirmed-subtitle">A confirmation has been sent to <strong>{formData.email}</strong></p>
                <div className="confirmed-reference">
                  <span className="ref-label">Reference</span>
                  <span className="ref-value">{booking.reference}</span>
                </div>
                <div className="confirmed-details">
                  <p><strong>{selectedService?.name}</strong></p>
                  <p>{formatDate(selectedDate)} · {selectedSlot?.label}</p>
                  <p>{meetingType === 'phone' ? '📞 Phone Call' : '🤝 In Person'}</p>
                </div>
                <p className="confirmed-note">Need to reach us before then?</p>
                <div className="confirmed-contact">
                  {ADMIN_EMAIL && <a href={`mailto:${ADMIN_EMAIL}`}>{ADMIN_EMAIL}</a>}
                  {ADMIN_EMAIL && BUSINESS_PHONE && <span>·</span>}
                  {BUSINESS_PHONE && <a href={`tel:${BUSINESS_PHONE.replace(/\D/g, '')}`}>{BUSINESS_PHONE}</a>}
                </div>
                {/* TODO: Update this link to match your home route */}
                <Link to="/kootis-couture" className="btn-home">Back to Home</Link>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* TODO: Add your Footer here */}
      {/* <Footer /> */}
    </div>
  )
}
