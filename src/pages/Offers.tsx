import { useState } from 'react'
import type { FormEvent } from 'react'
import { categories, formatNaira } from '../data'
import type { Category } from '../data'
import { useMarketplace } from '../marketplace'
import { Icon } from '../icons'
import { useToast } from '../toast'

type OfferCategory = Exclude<Category, 'All'>

interface Draft {
  title: string
  category: OfferCategory
  price: string
  location: string
  time: string
  blurb: string
}

const emptyDraft: Draft = {
  title: '',
  category: 'Academics',
  price: '',
  location: 'Cafeteria, Main Campus',
  time: '',
  blurb: '',
}

export default function OffersPage() {
  const { offers, publishOffer } = useMarketplace()
  const { showToast } = useToast()
  const [open, setOpen] = useState(offers.length === 0)
  const [draft, setDraft] = useState<Draft>(emptyDraft)

  const update = (key: keyof Draft, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const title = draft.title.trim()
    if (!title) {
      showToast('Give your offer a clear title first.')
      return
    }

    publishOffer({
      title,
      category: draft.category,
      price: Math.max(0, Number(draft.price) || 0),
      location: draft.location,
      time: draft.time.trim() || 'Flexible',
      blurb: draft.blurb.trim(),
    })

    setDraft(emptyDraft)
    setOpen(false)
  }

  return (
    <div className='dash-page'>
      <header className='dash-page__head'>
        <div>
          <p className='section-kicker'>Your listings</p>
          <h1>My offers</h1>
          <p>
            Publish what you do well. New offers appear in Explore immediately
            and are recorded on your activity log.
          </p>
        </div>
        <button
          className='btn btn--primary btn--small'
          onClick={() => setOpen((current) => !current)}
          type='button'
        >
          <Icon name={open ? 'x' : 'plus'} size={16} />
          {open ? 'Close form' : 'New offer'}
        </button>
      </header>

      {open && (
        <section className='panel offer-compose'>
          <div className='panel__head'>
            <div>
              <p className='section-kicker'>Give campus a hand</p>
              <h2>Offer a service</h2>
            </div>
            <span className='panel__hint'>
              <Icon name='shield' size={14} />
              Visible to verified students
            </span>
          </div>

          <form className='offer-form' onSubmit={handleSubmit}>
            <label className='field offer-form__wide'>
              <span>What are you offering?</span>
              <input
                maxLength={90}
                onChange={(event) => update('title', event.target.value)}
                placeholder='e.g. Calculus II crash course before Friday'
                required
                value={draft.title}
              />
            </label>

            <div className='field-row offer-form__wide'>
              <label className='field'>
                <span>Category</span>
                <select
                  onChange={(event) =>
                    update('category', event.target.value as OfferCategory)
                  }
                  value={draft.category}
                >
                  {categories
                    .filter((category) => category.name !== 'All')
                    .map((category) => (
                      <option key={category.name} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                </select>
              </label>

              <label className='field'>
                <span>Price (₦)</span>
                <input
                  min='0'
                  onChange={(event) => update('price', event.target.value)}
                  placeholder='3000'
                  required
                  step='500'
                  type='number'
                  value={draft.price}
                />
              </label>
            </div>

            <div className='field-row offer-form__wide'>
              <label className='field'>
                <span>Where</span>
                <select
                  onChange={(event) => update('location', event.target.value)}
                  value={draft.location}
                >
                  <option>Cafeteria, Main Campus</option>
                  <option>Main Library</option>
                  <option>Lecture Hall B</option>
                  <option>Cyber Café, Block C</option>
                  <option>Online · Google Meet</option>
                  <option>Main Campus</option>
                </select>
              </label>

              <label className='field'>
                <span>When</span>
                <input
                  onChange={(event) => update('time', event.target.value)}
                  placeholder='Today · 3:00 PM'
                  required
                  value={draft.time}
                />
              </label>
            </div>

            <label className='field offer-form__wide'>
              <span>
                Details <em>optional</em>
              </span>
              <textarea
                onChange={(event) => update('blurb', event.target.value)}
                placeholder='What should a student expect from the session?'
                rows={3}
                value={draft.blurb}
              />
            </label>

            <div className='offer-form__actions offer-form__wide'>
              <p>
                <Icon name='shield' size={15} />
                Your offer is visible to verified Anchor students only.
              </p>
              <button className='btn btn--primary btn--small' type='submit'>
                Publish offer
                <Icon name='arrow-right' size={16} />
              </button>
            </div>
          </form>
        </section>
      )}

      <div className='section-head'>
        <div>
          <p className='section-kicker'>Live on campus</p>
          <h2>Your active offers</h2>
        </div>
        <span className='section-count'>
          {offers.length} {offers.length === 1 ? 'offer' : 'offers'}
        </span>
      </div>

      {offers.length > 0 ? (
        <div className='offer-list'>
          {offers.map((offer) => (
            <article className='offer-row' key={offer.id}>
              <span className='offer-row__icon'>
                <Icon name='package' size={18} />
              </span>
              <div className='offer-row__body'>
                <span className='service-tag'>{offer.category}</span>
                <h3>{offer.title}</h3>
                <p>
                  {offer.location} · {offer.time}
                </p>
              </div>
              <div className='offer-row__side'>
                <strong>{formatNaira(offer.price)}</strong>
                <span className='live-pill'>
                  <span />
                  Live
                </span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        !open && (
          <div className='empty-state empty-state--tall'>
            <span className='empty-state__icon'>
              <Icon name='package' size={24} />
            </span>
            <h3>No offers yet</h3>
            <p>
              Publish your first offer and it will show up in Explore for every
              verified student on campus.
            </p>
            <button
              className='btn btn--soft'
              onClick={() => setOpen(true)}
              type='button'
            >
              Create an offer
              <Icon name='plus' size={17} />
            </button>
          </div>
        )
      )}

      {open && offers.length === 0 && (
        <p className='dash-inline-note'>
          <Icon name='sparkles' size={15} />
          Your first offer will appear here as soon as you publish it.
        </p>
      )}
    </div>
  )
}
