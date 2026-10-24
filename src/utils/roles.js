/**
 * roles.js — TRAVGOD Role & Permissions Engine
 * Source of truth for Traveler vs Local access, restrictions, and route guards.
 * No admin role for hackathon scope.
 *
 * TWO roles only: TRAVELER and LOCAL (stored as 'guide').
 * Default-deny: if not listed here, it's not allowed.
 */

import { Storage } from './storage.js';

// ── Role Constants ──────────────────────────────────────────────────────────
export const ROLES = {
  TRAVELER: 'traveler',
  LOCAL: 'guide',       // stored as 'guide' for backward compat with existing data
};

// ── Local Status Stages ─────────────────────────────────────────────────────
export const LOCAL_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  IN_REVIEW: 'in_review',
  NEEDS_INFO: 'needs_info',
  REJECTED: 'rejected',
  VERIFIED: 'verified',
  PAUSED: 'paused',         // vacation mode: hidden, no new requests
  SUSPENDED: 'suspended',   // read-only: bookings/earnings/support only
};

// ── Traveler Status Stages ──────────────────────────────────────────────────
export const TRAVELER_STATUS = {
  EMAIL_UNVERIFIED: 'email_unverified',  // can browse/save, NOT send requests
  ACTIVE: 'active',
  RESTRICTED: 'restricted',             // existing bookings only, new needs approval
  SUSPENDED: 'suspended',               // read-only: past bookings/receipts only
};

// Backward compat alias
export const TRAVELER_STATUS_UNVERIFIED = TRAVELER_STATUS.EMAIL_UNVERIFIED;

// ── Permissions Matrix ──────────────────────────────────────────────────────
export const PERMISSIONS = {
  traveler: {
    canSendInquiry: true,
    canSendRequest: true,
    canPay: true,
    canStartChat: true,
    canAcceptRequest: false,
    canDeclineRequest: false,
    canCounterRequest: false,
    canCreateExperience: false,
    canAddHiddenSpot: false,
    canSetAvailability: false,
    canViewEarnings: false,
    canWriteReview: true,
    canReplyToReview: false,
    canPlanTrip: true,
    canSavePlaces: true,
    canViewTrips: true,
    canViewBookings: true,
    canCheckIn: true,
    canReleasePayment: true,
    canPostCommunity: true,
    canAnswerCommunity: true,
    canBlockReport: true,
    canExportData: true,
    maxOpenRequests: 5,
    maxRequestsPerDay: 10,
    maxMessagesBeforeRequest: 10,
    maxMessagesPerMinute: 20,
    maxCommunityPostsPerDay: 5,
    maxAIQuestionsPerDay: 30,
  },
  guide: {
    canSendInquiry: false,
    canSendRequest: false,
    canPay: false,
    canStartChat: false,         // Locals can NEVER start a chat
    canAcceptRequest: true,
    canDeclineRequest: true,
    canCounterRequest: true,
    canCreateExperience: true,
    canAddHiddenSpot: true,
    canSetAvailability: true,
    canViewEarnings: true,
    canWriteReview: false,
    canReplyToReview: true,
    canPlanTrip: false,
    canSavePlaces: true,
    canViewTrips: false,         // Redirected to host dashboard
    canViewBookings: false,      // Redirected to host bookings
    canCheckIn: true,            // Guide check-in
    canReleasePayment: false,
    canPostCommunity: true,
    canAnswerCommunity: true,    // With Verified badge
    canBlockReport: true,
    canExportData: true,
    maxActiveExperiences: 8,
    maxMessagesPerMinute: 30,
    maxCommunityAnswersPerDay: 20,
    maxHiddenSpotsPerWeek: 5,
    responseDeadlineHours: 24,
    responseDeadlineUrgentHours: 12,
  }
};

// ── Traveler Navigation ─────────────────────────────────────────────────────
export const TRAVELER_NAV = {
  bottomTabs: [
    { id: 'explore', label: 'Explore', icon: 'compass', route: '#/d/rome' },
    { id: 'trips', label: 'Trips', icon: 'map', route: '#/trips' },
    { id: 'locals', label: 'Locals', icon: 'users', route: '#/locals' },
    { id: 'messages', label: 'Messages', icon: 'message-circle', route: '#/messages' },
    { id: 'profile', label: 'Profile', icon: 'user', route: '#/profile' },
  ],
  headerNav: [
    { label: 'Home', route: '#/', id: 'home' },
    { label: 'Explore', route: '#/explore', id: 'explore' },
    { label: 'My Trips', route: '#/trips', id: 'trips' },
    { label: 'Locals', route: '#/locals', id: 'locals' },
    { label: 'About', route: '#/about', id: 'about' },
  ],
  menuExtras: [
    { label: 'Bookings', route: '#/bookings', icon: 'calendar-check' },
    { label: 'Saved', route: '#/saved', icon: 'heart' },
    { label: 'Safety Center', route: '#/safety', icon: 'shield' },
    { label: 'Settings', route: '#/settings', icon: 'settings' },
    { label: 'Become a Local', route: '#/become-a-local', icon: 'star' },
  ],
};

// ── Local Navigation ────────────────────────────────────────────────────────
export const LOCAL_NAV_VERIFIED = {
  bottomTabs: [
    { id: 'home', label: 'Home', icon: 'layout-dashboard', route: '#/host' },
    { id: 'requests', label: 'Requests', icon: 'inbox', route: '#/host/requests' },
    { id: 'calendar', label: 'Calendar', icon: 'calendar', route: '#/host/calendar' },
    { id: 'messages', label: 'Messages', icon: 'message-circle', route: '#/host/messages' },
    { id: 'more', label: 'More', icon: 'menu', route: '#/host/more' },
  ],
  headerNav: [
    { label: 'Dashboard', route: '#/host', id: 'host' },
    { label: 'Requests', route: '#/host/requests', id: 'requests' },
    { label: 'Experiences', route: '#/host/experiences', id: 'experiences' },
    { label: 'Explore', route: '#/d/rome', id: 'explore' },
  ],
  menuExtras: [
    { label: 'Experiences', route: '#/host/experiences', icon: 'sparkles' },
    { label: 'Hidden Spots', route: '#/host/spots', icon: 'map-pin' },
    { label: 'Earnings', route: '#/host/earnings', icon: 'wallet' },
    { label: 'Reviews', route: '#/host/reviews', icon: 'star' },
    { label: 'Training', route: '#/host/training', icon: 'graduation-cap' },
    { label: 'My Profile', route: '#/host/profile', icon: 'user' },
    { label: 'Explore', route: '#/d/rome', icon: 'compass' },
    { label: 'Community', route: '#/community', icon: 'message-square' },
    { label: 'Safety', route: '#/safety', icon: 'shield' },
    { label: 'Settings', route: '#/settings', icon: 'settings' },
  ],
};

export const LOCAL_NAV_UNVERIFIED = {
  bottomTabs: [
    { id: 'application', label: 'Application', icon: 'clipboard-list', route: '#/become-a-local' },
    { id: 'training', label: 'Training', icon: 'graduation-cap', route: '#/host/training' },
    { id: 'community', label: 'Community', icon: 'message-square', route: '#/community' },
    { id: 'profile', label: 'Profile', icon: 'user', route: '#/profile' },
  ],
};

// ── Route Guards ────────────────────────────────────────────────────────────
// Returns { allowed: boolean, redirect: string | null }
export function checkRouteAccess(hash) {
  const user = getCurrentUser();
  const role = getUserRole();
  const localStatus = getLocalStatus();

  // Public routes accessible by everyone (even logged out)
  const publicRoutes = ['/', '/about', '/signin', '/onboarding', '/locals', '/safety'];
  if (publicRoutes.some(r => hash === r || hash.startsWith(r + '/'))) {
    return { allowed: true, redirect: null };
  }

  // Destination pages and explore always accessible
  if (hash.startsWith('/d/') || hash === '/explore') {
    return { allowed: true, redirect: null };
  }

  // Not logged in — prompt sign in (preserves ?next= via state.pendingRedirect in main.js)
  if (!user) {
    return { allowed: false, redirect: '/signin' };
  }

  // ── LOCAL role guards ────────────────────────────────────────────────────
  if (role === ROLES.LOCAL) {
    // Locals CANNOT access traveler-specific routes — redirect to host
    if (hash === '/trips' || hash === '/bookings') {
      return { allowed: false, redirect: '/host' };
    }
    if (hash.startsWith('/request') || hash.startsWith('/checkout')) {
      return { allowed: false, redirect: '/host' };
    }
    // /bookings → /host/bookings
    if (hash === '/bookings') {
      return { allowed: false, redirect: '/host' };
    }
    // /become-a-local only for draft/needs_info/rejected locals
    if (hash === '/become-a-local' || hash.startsWith('/become-a-local/')) {
      const editableStatuses = [LOCAL_STATUS.DRAFT, LOCAL_STATUS.NEEDS_INFO, LOCAL_STATUS.REJECTED];
      if (!editableStatuses.includes(localStatus)) {
        return { allowed: false, redirect: '/host' };
      }
    }
    // Suspended locals: only host, earnings, support
    if (localStatus === LOCAL_STATUS.SUSPENDED) {
      const allowedForSuspended = ['/host', '/host/earnings'];
      if (!allowedForSuspended.some(p => hash === p || hash.startsWith(p + '/'))) {
        return { allowed: false, redirect: '/host' };
      }
    }
  }

  // ── TRAVELER role guards ─────────────────────────────────────────────────
  if (role === ROLES.TRAVELER) {
    // Travelers CANNOT access host routes
    if (hash.startsWith('/host')) {
      return { allowed: false, redirect: '/become-a-local' };
    }
  }

  return { allowed: true, redirect: null };
}

// ── User Helpers ────────────────────────────────────────────────────────────
export function getCurrentUser() {
  return Storage.get('travgod_user', null);
}

export function getUserRole() {
  const user = getCurrentUser();
  if (!user) return null;
  return user.role || ROLES.TRAVELER;
}

export function isLoggedIn() {
  return !!getCurrentUser();
}

export function isTraveler() {
  return getUserRole() === ROLES.TRAVELER;
}

export function isLocal() {
  return getUserRole() === ROLES.LOCAL;
}

export function getLocalStatus() {
  const user = getCurrentUser();
  if (!user || user.role !== ROLES.LOCAL) return null;
  return user.localStatus || LOCAL_STATUS.VERIFIED; // default to verified for demo
}

export function isLocalVerified() {
  const status = getLocalStatus();
  return status === LOCAL_STATUS.VERIFIED;
}

export function isLocalPaused() {
  const status = getLocalStatus();
  return status === LOCAL_STATUS.PAUSED;
}

export function canLocalPublish() {
  const status = getLocalStatus();
  return status === LOCAL_STATUS.VERIFIED;
}

export function getNavConfig() {
  const role = getUserRole();
  if (role === ROLES.LOCAL) {
    const status = getLocalStatus();
    // Suspended locals get a stripped nav: Home, Bookings, Earnings, Help
    if (status === LOCAL_STATUS.SUSPENDED) {
      return {
        bottomTabs: [
          { id: 'home', label: 'Home', icon: 'layout-dashboard', route: '#/host' },
          { id: 'earnings', label: 'Earnings', icon: 'wallet', route: '#/host/earnings' },
          { id: 'help', label: 'Help', icon: 'life-buoy', route: '#/host/more' },
        ],
      };
    }
    // Rejected locals: Application, Help, Community, Profile
    if (status === LOCAL_STATUS.REJECTED) {
      return {
        bottomTabs: [
          { id: 'application', label: 'Application', icon: 'clipboard-list', route: '#/become-a-local' },
          { id: 'community', label: 'Community', icon: 'message-square', route: '#/community' },
          { id: 'profile', label: 'Profile', icon: 'user', route: '#/profile' },
          { id: 'help', label: 'Help', icon: 'life-buoy', route: '#/host/more' },
        ],
      };
    }
    const verifiedStatuses = [LOCAL_STATUS.VERIFIED, LOCAL_STATUS.PAUSED];
    if (verifiedStatuses.includes(status)) {
      return LOCAL_NAV_VERIFIED;
    }
    return LOCAL_NAV_UNVERIFIED;
  }
  return TRAVELER_NAV;
}

export function getPermissions() {
  const role = getUserRole();
  return PERMISSIONS[role] || PERMISSIONS.traveler;
}

// ── Role Switcher (dual-role account) ───────────────────────────────────────
export function switchRole(newRole) {
  const user = getCurrentUser();
  if (!user) return;
  user.role = newRole;
  Storage.set('travgod_user', user);
}

// ── can(action) — Status-aware policy check ─────────────────────────────────
// Returns { allowed: boolean, reason: string }
// Use this in all UI components to conditionally show/hide/disable controls.
export function can(action) {
  const user = getCurrentUser();
  if (!user) {
    return { allowed: false, reason: 'login_required' };
  }
  const role = getUserRole();
  const travelerStatus = user.travelerStatus || TRAVELER_STATUS.ACTIVE;
  const localStatus = getLocalStatus();

  // ── TRAVELER actions ─────────────────────────────────────────────────────
  if (role === ROLES.TRAVELER) {
    // Suspended traveler: read-only past bookings/receipts only
    if (travelerStatus === TRAVELER_STATUS.SUSPENDED) {
      const allowed = ['view_past_bookings', 'view_receipts'].includes(action);
      return { allowed, reason: allowed ? 'ok' : 'account_suspended' };
    }

    switch (action) {
      case 'save_item':
      case 'plan_trip':
      case 'view_bookings':
        // email_unverified can browse, save, plan
        return { allowed: true, reason: 'ok' };

      case 'send_inquiry':
      case 'send_request':
      case 'pay':
      case 'post_community':
        if (travelerStatus === TRAVELER_STATUS.EMAIL_UNVERIFIED) {
          return { allowed: false, reason: 'email_not_verified' };
        }
        if (travelerStatus === TRAVELER_STATUS.RESTRICTED && action === 'send_request') {
          return { allowed: false, reason: 'account_restricted_needs_approval' };
        }
        return { allowed: true, reason: 'ok' };

      case 'start_chat':
        if (travelerStatus === TRAVELER_STATUS.EMAIL_UNVERIFIED) {
          return { allowed: false, reason: 'email_not_verified' };
        }
        return { allowed: true, reason: 'ok' };

      case 'write_review':
      case 'cancel_booking':
      case 'check_in':
      case 'release_payment':
      case 'report_problem':
        return { allowed: travelerStatus === TRAVELER_STATUS.ACTIVE || travelerStatus === TRAVELER_STATUS.RESTRICTED, reason: 'ok' };

      // Locals-only actions — travelers never
      case 'accept_request':
      case 'decline_request':
      case 'counter_request':
      case 'create_experience':
      case 'publish_experience':
      case 'add_hidden_spot':
      case 'set_availability':
      case 'view_earnings':
      case 'reply_to_review':
      case 'start_chat_as_local':
        return { allowed: false, reason: 'wrong_role' };

      default:
        return { allowed: true, reason: 'ok' };
    }
  }

  // ── LOCAL actions ────────────────────────────────────────────────────────
  if (role === ROLES.LOCAL) {
    // Locals can NEVER do these
    if (['send_request', 'send_inquiry', 'pay', 'start_chat', 'write_review',
         'plan_trip', 'view_trips'].includes(action)) {
      return { allowed: false, reason: 'local_cannot_do_this' };
    }
    // Locals can NEVER initiate a conversation
    if (action === 'start_chat_as_local') {
      return { allowed: false, reason: 'local_cannot_initiate' };
    }

    // Suspended local: can only view bookings, earnings, contact support
    if (localStatus === LOCAL_STATUS.SUSPENDED) {
      const readOnly = ['view_bookings', 'view_earnings', 'contact_support', 'view_past_bookings'].includes(action);
      return { allowed: readOnly, reason: readOnly ? 'ok' : 'account_suspended' };
    }

    // Rejected local
    if (localStatus === LOCAL_STATUS.REJECTED) {
      const allowed = ['edit_application', 'reapply', 'take_training', 'view_community'].includes(action);
      return { allowed, reason: allowed ? 'ok' : 'application_rejected' };
    }

    // Draft / submitted / in_review: limited
    if ([LOCAL_STATUS.DRAFT, LOCAL_STATUS.SUBMITTED, LOCAL_STATUS.IN_REVIEW].includes(localStatus)) {
      const allowed = ['take_training', 'view_community', 'view_host_dashboard'].includes(action)
        || (localStatus === LOCAL_STATUS.DRAFT && action === 'edit_application');
      return { allowed, reason: allowed ? 'ok' : `status_${localStatus}` };
    }

    // needs_info: can edit and resubmit
    if (localStatus === LOCAL_STATUS.NEEDS_INFO) {
      const allowed = ['edit_application', 'resubmit_application', 'take_training', 'view_community'].includes(action);
      return { allowed, reason: allowed ? 'ok' : 'needs_info_restricted' };
    }

    // Paused local: hidden, no new requests but can manage existing
    if (localStatus === LOCAL_STATUS.PAUSED) {
      if (['accept_request', 'create_new_booking'].includes(action)) {
        return { allowed: false, reason: 'local_paused_no_new_requests' };
      }
      // Can reply, finish bookings, edit profile
      const allowed = ['reply_to_thread', 'view_requests', 'view_bookings', 'view_earnings',
        'edit_profile', 'decline_request', 'reply_to_review', 'view_community', 'view_host_dashboard'].includes(action);
      return { allowed, reason: allowed ? 'ok' : 'local_paused' };
    }

    // Verified local: full access
    if (localStatus === LOCAL_STATUS.VERIFIED) {
      switch (action) {
        case 'accept_request':
        case 'decline_request':
        case 'counter_request':
        case 'view_requests':
        case 'create_experience':
        case 'publish_experience':
        case 'add_hidden_spot':
        case 'set_availability':
        case 'view_earnings':
        case 'edit_profile':
        case 'reply_to_thread':
        case 'reply_to_review':
        case 'view_bookings':
        case 'take_training':
        case 'view_community':
        case 'view_host_dashboard':
        case 'check_in':
          return { allowed: true, reason: 'ok' };
        default:
          return { allowed: true, reason: 'ok' };
      }
    }
  }

  return { allowed: false, reason: 'unknown' };
}

// ── Status banner config — used by HostDashboardView ────────────────────────
export function getLocalStatusBanner(status) {
  const banners = {
    [LOCAL_STATUS.DRAFT]: {
      color: '#64748b', bg: '#f1f5f9', border: '#e2e8f0',
      icon: 'file-edit',
      label: 'Draft',
      message: 'Complete your application to be listed as a Local Guide.',
      action: 'Continue Application', actionRoute: '#/become-a-local',
    },
    [LOCAL_STATUS.SUBMITTED]: {
      color: '#0ea5e9', bg: '#e0f2fe', border: '#bae6fd',
      icon: 'send',
      label: 'Application Submitted',
      message: 'Your application is being reviewed. This usually takes 1–2 business days. You cannot edit your application while it\'s in review.',
      action: null,
    },
    [LOCAL_STATUS.IN_REVIEW]: {
      color: '#8b5cf6', bg: '#ede9fe', border: '#ddd6fe',
      icon: 'search',
      label: 'Under Review',
      message: 'Our team is actively reviewing your profile and documents. You can take the Safety Training while you wait.',
      action: 'Take Safety Training', actionRoute: '#/host/training',
    },
    [LOCAL_STATUS.NEEDS_INFO]: {
      color: '#f59e0b', bg: '#fef3c7', border: '#fde68a',
      icon: 'alert-triangle',
      label: 'Action Required',
      message: 'We need additional information from you before your application can proceed. Please update your application.',
      action: 'Update Application', actionRoute: '#/become-a-local',
    },
    [LOCAL_STATUS.REJECTED]: {
      color: '#ef4444', bg: '#fee2e2', border: '#fecaca',
      icon: 'x-circle',
      label: 'Application Not Approved',
      message: 'Unfortunately your application was not approved at this time. You may reapply once. Check your email for the specific reason.',
      action: 'Reapply', actionRoute: '#/become-a-local',
    },
    [LOCAL_STATUS.PAUSED]: {
      color: '#f59e0b', bg: '#fef3c7', border: '#fde68a',
      icon: 'pause-circle',
      label: 'Vacation Mode — Hidden from Search',
      message: 'You\'re in vacation mode. You won\'t receive new requests and you\'re hidden from search. Finish your existing bookings and disable vacation mode when you\'re ready.',
      action: 'Disable Vacation Mode', actionHandler: 'disable_vacation',
    },
    [LOCAL_STATUS.SUSPENDED]: {
      color: '#ef4444', bg: '#fee2e2', border: '#fecaca',
      icon: 'shield-x',
      label: 'Account Suspended',
      message: 'Your account has been suspended. You can view past bookings and earnings. Contact support for more information.',
      action: 'Contact Support', actionRoute: 'mailto:support@travgod.com',
    },
  };
  return banners[status] || null;
}

// ── Visibility: What a Traveler sees about a Local ──────────────────────────
export function getLocalPublicProfile(localData) {
  // Strip private fields that travelers should NEVER see
  const {
    idDocuments, selfie, policeCertificate, licenceFile,
    legalName, phone, email, payoutDetails, earnings,
    strikes, exactLocation,
    ...publicProfile
  } = localData;
  return publicProfile;
}

// ── Visibility: What a Local sees about a Traveler (only after inquiry) ─────
export function getTravelerVisibleProfile(travelerData, hasInquiry = false) {
  if (!hasInquiry) return null;
  return {
    firstName: travelerData.name?.split(' ')[0],
    country: travelerData.country,
    languages: travelerData.primaryLang,
    interests: travelerData.dna?.interests,
  };
}
