import {
  AppState,
  BudgetItem,
  OccasionEvent,
  TimelineItem,
  VendorItem,
} from '../types'

/**
 * Default demonstration wedding event showcasing botanical elegance theme.
 */
export const DEFAULT_WEDDING_EVENT: OccasionEvent = {
  id: 'evt-wedding-demo',
  title: 'Sophia & Liam’s Botanical Romance Wedding',
  type: 'wedding',
  date: '2026-11-14',
  location: 'Kew Royal Conservatories & Orangery',
  guestCount: 120,
  vibe: 'Timeless botanical elegance with candlelit dinner and acoustic strings',
  targetBudget: 35000,
  currency: 'USD',
  notes: 'Outdoor ceremony on lawn; indoor orangery reception if rain.',
  createdAt: '2026-10-01T10:00:00.000Z',
  updatedAt: '2026-10-20T10:00:00.000Z',
}

/**
 * Preconfigured budget allocations for the demo wedding event.
 */
export const DEFAULT_WEDDING_BUDGET: BudgetItem[] = [
  { id: 'b-1', eventId: 'evt-wedding-demo', name: 'Conservatory Venue Hire & Bridal Suite', category: 'venue', estimatedCost: 11000, actualCost: 11500, isPaid: true },
  { id: 'b-2', eventId: 'evt-wedding-demo', name: 'Farm-to-Table Plated Dinner & Canapes (120 guests)', category: 'catering', estimatedCost: 9600, actualCost: 9600, isPaid: true },
  { id: 'b-3', eventId: 'evt-wedding-demo', name: 'Curated Open Bar & Champagne Toast', category: 'catering', estimatedCost: 3200, actualCost: 3000, isPaid: false },
  { id: 'b-4', eventId: 'evt-wedding-demo', name: 'Ceremony Arch, Hanging Greenery & Table Florals', category: 'decor', estimatedCost: 3500, actualCost: 3400, isPaid: true },
  { id: 'b-5', eventId: 'evt-wedding-demo', name: 'Fine Art Photographer (8 Hours + Drone)', category: 'photo_video', estimatedCost: 3200, actualCost: 3200, isPaid: true },
  { id: 'b-6', eventId: 'evt-wedding-demo', name: 'Live Acoustic String Duo + Evening DJ Fusion', category: 'entertainment', estimatedCost: 2200, actualCost: 2100, isPaid: false },
  { id: 'b-7', eventId: 'evt-wedding-demo', name: 'Bridal Gown, Alterations & Tuxedo Rental', category: 'attire_beauty', estimatedCost: 2000, actualCost: 1950, isPaid: true },
  { id: 'b-8', eventId: 'evt-wedding-demo', name: 'Foil-pressed Invitation Suites & Calligraphy', category: 'invitations_marketing', estimatedCost: 650, actualCost: 620, isPaid: true },
  { id: 'b-9', eventId: 'evt-wedding-demo', name: 'Handmade Botanical Olive Oil Guest Favors', category: 'favors_gifts', estimatedCost: 450, actualCost: 400, isPaid: false },
  { id: 'b-10', eventId: 'evt-wedding-demo', name: 'Event Liability Insurance & Day Contingency', category: 'permits_safety', estimatedCost: 500, actualCost: 450, isPaid: true },
]

/**
 * Step-by-step phased timeline for the demo wedding event.
 */
export const DEFAULT_WEDDING_TIMELINE: TimelineItem[] = [
  { id: 't-1', eventId: 'evt-wedding-demo', title: 'Sign Orangery Venue Contract & Deposit', phase: 'pre_planning', dueDate: '2026-05-01', completed: true, priority: 'high' },
  { id: 't-2', eventId: 'evt-wedding-demo', title: 'Book Photographer & Reserve Engagement Shoot', phase: 'pre_planning', dueDate: '2026-06-15', completed: true, priority: 'high' },
  { id: 't-3', eventId: 'evt-wedding-demo', title: 'Catering Tasting & Custom Cocktail Finalization', phase: 'middle_planning', dueDate: '2026-08-20', completed: true, priority: 'high' },
  { id: 't-4', eventId: 'evt-wedding-demo', title: 'Mail Formal Invitations with RSVP Deadline', phase: 'middle_planning', dueDate: '2026-09-01', completed: true, priority: 'medium' },
  { id: 't-5', eventId: 'evt-wedding-demo', title: 'Final Dress & Tuxedo Fittings', phase: 'final_prep', dueDate: '2026-10-15', completed: true, priority: 'high' },
  { id: 't-6', eventId: 'evt-wedding-demo', title: 'Final Seating Chart & Placecards Handed to Planner', phase: 'week_of', dueDate: '2026-11-08', completed: false, priority: 'high' },
  { id: 't-7', eventId: 'evt-wedding-demo', title: 'Wedding Party Rehearsal Walkthrough & Dinner', phase: 'week_of', dueDate: '2026-11-13', completed: false, priority: 'high' },
  { id: 't-8', eventId: 'evt-wedding-demo', title: 'Hair & Makeup Styling Starts (Bridal Suite)', phase: 'day_of', time: '09:30', completed: false, priority: 'high' },
  { id: 't-9', eventId: 'evt-wedding-demo', title: 'Florist Delivers Bouquets & Sets Ceremony Arch', phase: 'day_of', time: '13:00', completed: false, priority: 'medium' },
  { id: 't-10', eventId: 'evt-wedding-demo', title: 'Guests Arrive & Acoustic Prelude Begins', phase: 'day_of', time: '15:30', completed: false, priority: 'high' },
  { id: 't-11', eventId: 'evt-wedding-demo', title: 'Ceremony Begins', phase: 'day_of', time: '16:00', completed: false, priority: 'high' },
  { id: 't-12', eventId: 'evt-wedding-demo', title: 'Cocktail Hour & Golden Hour Portraits', phase: 'day_of', time: '17:00', completed: false, priority: 'medium' },
  { id: 't-13', eventId: 'evt-wedding-demo', title: 'Grand Entrance & Plated Dinner Feasting', phase: 'day_of', time: '18:30', completed: false, priority: 'high' },
  { id: 't-14', eventId: 'evt-wedding-demo', title: 'Cake Cutting & First Dance Under Fairy Lights', phase: 'day_of', time: '20:15', completed: false, priority: 'high' },
  { id: 't-15', eventId: 'evt-wedding-demo', title: 'Sparkler Sendoff & Late Night Bites', phase: 'day_of', time: '22:45', completed: false, priority: 'medium' },
]

/**
 * Pre-populated vendor directory for the demo wedding.
 */
export const DEFAULT_WEDDING_VENDORS: VendorItem[] = [
  { id: 'v-1', eventId: 'evt-wedding-demo', name: 'Kew Conservatory & Gardens', category: 'venue', contactPerson: 'Eleanor Vance', email: 'events@kewconservatory.demo', phone: '+1 555-019-2834', status: 'deposit_paid', quotedAmount: 11500, notes: 'Includes tables, Chiavari chairs, clean-up staff' },
  { id: 'v-2', eventId: 'evt-wedding-demo', name: 'Wild Thyme Organic Catering', category: 'catering', contactPerson: 'Chef Marcus Holt', email: 'marcus@wildthymecatering.demo', phone: '+1 555-018-4721', status: 'deposit_paid', quotedAmount: 9600, notes: 'Includes 12 servers, tableware, and cocktail hour canapés' },
  { id: 'v-3', eventId: 'evt-wedding-demo', name: 'Lumiere Fine Art Photography', category: 'photo_video', contactPerson: 'Clara Chen', email: 'clara@lumierephoto.demo', phone: '+1 555-012-9981', status: 'deposit_paid', quotedAmount: 3200, notes: '2 shooters, 8 hour coverage, full digital delivery in 3 weeks' },
  { id: 'v-4', eventId: 'evt-wedding-demo', name: 'Botanica Bloom Floral Studio', category: 'decor', contactPerson: 'Julian Ramos', email: 'hello@botanicabloom.demo', phone: '+1 555-014-3329', status: 'booked', quotedAmount: 3400, notes: 'Using seasonal olive branches, garden roses, and brass tapers' },
  { id: 'v-5', eventId: 'evt-wedding-demo', name: 'Velvet Strings & DJ Echo', category: 'entertainment', contactPerson: 'David Ross', email: 'bookings@echosounds.demo', phone: '+1 555-017-7712', status: 'quoted', quotedAmount: 2100, notes: 'Duo for ceremony, full DJ & uplighting rig for reception' },
]

/**
 * Milestone 30th birthday demo event.
 */
export const DEFAULT_BIRTHDAY_EVENT: OccasionEvent = {
  id: 'evt-birthday-demo',
  title: 'Marcus’s 30th Studio 54 Disco Bash',
  type: 'birthday',
  date: '2026-11-28',
  location: 'The Velvet Attic Loft & Rooftop',
  guestCount: 65,
  vibe: 'Retro 70s glam, hanging mirror balls, craft cocktail bar & heavy vinyl beats',
  targetBudget: 6000,
  currency: 'USD',
  notes: 'Dress code: Studio 54 metallic chic & sequins',
  createdAt: '2026-10-05T12:00:00.000Z',
  updatedAt: '2026-10-20T10:00:00.000Z',
}

/**
 * Demo budget breakdown for the birthday event.
 */
export const DEFAULT_BIRTHDAY_BUDGET: BudgetItem[] = [
  { id: 'bb-1', eventId: 'evt-birthday-demo', name: 'Velvet Attic Private Loft Rental (6 hours)', category: 'venue', estimatedCost: 1800, actualCost: 1800, isPaid: true },
  { id: 'bb-2', eventId: 'evt-birthday-demo', name: 'Artisan Sliders, Fondue Bar & Grazing Platters', category: 'catering', estimatedCost: 1600, actualCost: 1550, isPaid: true },
  { id: 'bb-3', eventId: 'evt-birthday-demo', name: 'Specialty Cocktail Ingredients & Bar Mixers', category: 'catering', estimatedCost: 600, actualCost: 550, isPaid: false },
  { id: 'bb-4', eventId: 'evt-birthday-demo', name: 'Cluster Mirror Balls & Custom Neon Birthday Sign', category: 'decor', estimatedCost: 500, actualCost: 480, isPaid: true },
  { id: 'bb-5', eventId: 'evt-birthday-demo', name: 'Retro Vinyl DJ (4-hour club set)', category: 'entertainment', estimatedCost: 800, actualCost: 750, isPaid: false },
  { id: 'bb-6', eventId: 'evt-birthday-demo', name: 'Lambeth Vintage Tiered Cake & Sparklers', category: 'catering', estimatedCost: 250, actualCost: 250, isPaid: true },
  { id: 'bb-7', eventId: 'evt-birthday-demo', name: 'Instant Polaroid Cameras & Film Packs', category: 'photo_video', estimatedCost: 200, actualCost: 180, isPaid: true },
]

/**
 * Community festival demo event.
 */
export const DEFAULT_COMMUNITY_EVENT: OccasionEvent = {
  id: 'evt-community-demo',
  title: 'Oakridge Neighborhood Spring Cultural & Arts Fest',
  type: 'community',
  date: '2026-12-05',
  location: 'Oakridge Community Park & Pedestrian Esplanade',
  guestCount: 350,
  vibe: 'Inclusive family festival with live local music, artisan maker stalls, and food trucks',
  targetBudget: 12000,
  currency: 'USD',
  notes: 'Rain location: Adjacent High School Gymnasium. Free admission.',
  createdAt: '2026-10-10T09:00:00.000Z',
  updatedAt: '2026-10-20T10:00:00.000Z',
}

/**
 * Demo budget breakdown for community event.
 */
export const DEFAULT_COMMUNITY_BUDGET: BudgetItem[] = [
  { id: 'cb-1', eventId: 'evt-community-demo', name: 'Municipal Park & Sound Ordinance Permit', category: 'permits_safety', estimatedCost: 850, actualCost: 850, isPaid: true },
  { id: 'cb-2', eventId: 'evt-community-demo', name: 'Covered Stage, Generator & Sound Engineer Rig', category: 'entertainment', estimatedCost: 3500, actualCost: 3400, isPaid: true },
  { id: 'cb-3', eventId: 'evt-community-demo', name: 'Temporary ADA Restrooms & Sanitation Stations', category: 'permits_safety', estimatedCost: 2200, actualCost: 2150, isPaid: true },
  { id: 'cb-4', eventId: 'evt-community-demo', name: 'On-site Licensed Paramedic & Security Detail', category: 'permits_safety', estimatedCost: 1500, actualCost: 1500, isPaid: false },
  { id: 'cb-5', eventId: 'evt-community-demo', name: 'Community Hands-On Art Mural Supplies', category: 'decor', estimatedCost: 900, actualCost: 820, isPaid: true },
  { id: 'cb-6', eventId: 'evt-community-demo', name: 'Wayfinding Banners, Printed Maps & Lawn Signs', category: 'invitations_marketing', estimatedCost: 650, actualCost: 600, isPaid: true },
  { id: 'cb-7', eventId: 'evt-community-demo', name: 'Performers Honorarium & Youth Band Stipends', category: 'entertainment', estimatedCost: 1800, actualCost: 1800, isPaid: false },
]

/**
 * Constructs the default initial application state loaded when no prior saved data exists.
 * @returns Fully populated default AppState with demo events and budgets.
 */
export function getInitialAppState(): AppState {
  const events = [DEFAULT_WEDDING_EVENT, DEFAULT_BIRTHDAY_EVENT, DEFAULT_COMMUNITY_EVENT]
  const budgetItems = [...DEFAULT_WEDDING_BUDGET, ...DEFAULT_BIRTHDAY_BUDGET, ...DEFAULT_COMMUNITY_BUDGET]
  const timelineItems = [...DEFAULT_WEDDING_TIMELINE]
  const vendors = [...DEFAULT_WEDDING_VENDORS]

  return {
    events,
    activeEventId: DEFAULT_WEDDING_EVENT.id,
    budgetItems,
    timelineItems,
    vendors,
    aiSettings: {
      apiKey: '',
      useCustomKey: false,
      model: 'gemini-2.5-flash',
    },
  }
}
