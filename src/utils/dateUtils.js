/**
 * Date and Timestamp Utilities for RentFlow / EstatePulse
 * Replaces hardcoded dates with dynamic, timezone-safe calculations.
 */

/**
 * Returns month and full year (e.g., "October 2026")
 */
export const getCurrentMonthYear = (date = new Date()) => {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

/**
 * Returns short month and full year (e.g., "Oct 2026")
 */
export const getShortMonthYear = (date = new Date()) => {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

/**
 * Returns ISO date string YYYY-MM-DD
 */
export const toISODateString = (date = new Date()) => {
  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return new Date().toISOString().split('T')[0];
  return d.toISOString().split('T')[0];
};

/**
 * Adds days to a base date and returns a new Date object
 */
export const addDays = (days, baseDate = new Date()) => {
  const d = new Date(baseDate);
  d.setDate(d.getDate() + Number(days));
  return d;
};

/**
 * Adds days to a base date and returns ISO string YYYY-MM-DD
 */
export const addDaysISO = (days, baseDate = new Date()) => {
  return toISODateString(addDays(days, baseDate));
};

/**
 * Adds months to a base date and returns a new Date object
 */
export const addMonths = (months, baseDate = new Date()) => {
  const d = new Date(baseDate);
  d.setMonth(d.getMonth() + Number(months));
  return d;
};

/**
 * Adds months to a base date and returns ISO string YYYY-MM-DD
 */
export const addMonthsISO = (months, baseDate = new Date()) => {
  return toISODateString(addMonths(months, baseDate));
};

/**
 * Calculates remaining days until target date from today (or baseDate)
 */
export const getDaysRemaining = (targetDate, baseDate = new Date()) => {
  if (!targetDate) return 0;
  const target = new Date(targetDate);
  const base = new Date(baseDate);
  if (isNaN(target.getTime())) return 0;
  return Math.ceil((target - base) / (1000 * 60 * 60 * 24));
};

/**
 * Checks if a date expires within the given threshold of days (e.g. 7 days)
 */
export const isExpiringWithinDays = (targetDate, daysThreshold = 7, baseDate = new Date()) => {
  const diffDays = getDaysRemaining(targetDate, baseDate);
  return diffDays >= 0 && diffDays <= daysThreshold;
};

/**
 * Generates dynamic list of month-year options (e.g. for month pickers)
 * Includes future months, current month, and past months, plus any existing payments months
 */
export const getDynamicMonthOptions = (countPast = 6, countFuture = 2, baseDate = new Date(), extraMonths = []) => {
  const options = [];
  const base = new Date(baseDate);

  // Generate from future down to past
  for (let i = countFuture; i >= -countPast; i--) {
    const d = new Date(base.getFullYear(), base.getMonth() + i, 1);
    const mStr = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!options.includes(mStr)) {
      options.push(mStr);
    }
  }

  // Include any extra months from database / historical records
  if (Array.isArray(extraMonths)) {
    extraMonths.forEach(m => {
      if (m && typeof m === 'string' && !options.includes(m)) {
        options.push(m);
      }
    });
  }

  return options;
};

/**
 * Formats a date into a clean display format DD/MM/YYYY or readable localized string
 */
export const formatDisplayDate = (dateVal) => {
  if (!dateVal) return '';
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return String(dateVal);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
};
