import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from '../page'

// Mock visual components to avoid jsdom/IntersectionObserver issues
vi.mock('@/components/KoreLogo', () => ({
  default: () => <svg data-testid="logo" />,
}))
vi.mock('@/components/BackgroundBlobs', () => ({
  default: () => <div data-testid="blobs" />,
}))
vi.mock('@/components/ThemeToggle', () => ({
  default: () => <button data-testid="theme-toggle" />,
}))
vi.mock('@/components/ScrollReveal', () => ({
  default: () => <div data-testid="scroll-reveal" />,
}))

// Mock global fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('Home page', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('affiche le formulaire d\'inscription', () => {
    render(<Home />)
    expect(screen.getByLabelText(/adresse email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/prenom/i)).toBeInTheDocument()
    // Button text is "S\u2019inscrire" (curly apostrophe) — match with /inscrire/i
    expect(screen.getByRole('button', { name: /inscrire/i })).toBeInTheDocument()
  })

  it('n\'appelle pas fetch si email vide', async () => {
    render(<Home />)
    const submitBtn = screen.getByRole('button', { name: /inscrire/i })
    fireEvent.click(submitBtn)
    expect(mockFetch).not.toHaveBeenCalled()
  })

  it('affiche "Inscription..." pendant le chargement', async () => {
    // fetch qui ne résout jamais (simule loading)
    mockFetch.mockReturnValue(new Promise(() => {}))

    render(<Home />)
    const emailInput = screen.getByLabelText(/adresse email/i)
    await userEvent.type(emailInput, 'test@example.com')

    const form = screen.getByRole('form', { name: /formulaire d'inscription/i })
    fireEvent.submit(form)

    expect(await screen.findByText(/inscription\.\.\./i)).toBeInTheDocument()
  })

  it('affiche le message success après inscription réussie', async () => {
    mockFetch.mockResolvedValue({ ok: true })

    render(<Home />)
    const emailInput = screen.getByLabelText(/adresse email/i)
    await userEvent.type(emailInput, 'test@example.com')

    const form = screen.getByRole('form', { name: /formulaire d'inscription/i })
    fireEvent.submit(form)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/inscription reussie/i)
  })

  it('affiche le message d\'erreur si l\'API échoue', async () => {
    mockFetch.mockResolvedValue({ ok: false })

    render(<Home />)
    const emailInput = screen.getByLabelText(/adresse email/i)
    await userEvent.type(emailInput, 'test@example.com')

    const form = screen.getByRole('form', { name: /formulaire d'inscription/i })
    fireEvent.submit(form)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent(/erreur/i)
  })

  it('appelle fetch avec email et name corrects', async () => {
    mockFetch.mockResolvedValue({ ok: true })

    render(<Home />)
    await userEvent.type(screen.getByLabelText(/adresse email/i), 'test@example.com')
    await userEvent.type(screen.getByLabelText(/prenom/i), 'Gabriel')

    const form = screen.getByRole('form', { name: /formulaire d'inscription/i })
    fireEvent.submit(form)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', name: 'Gabriel' }),
      })
    })
  })
})
