import { shuffle, orderBy } from 'lodash-es';

export const FILTER_ACTIONS = {
  SET_ORDER: 'set_order',
  SET_QUERY: 'set_query',
  SET_CATEGORIES: 'set_categories',
  REMOVE_CATEGORY: 'remove_category',
  SET_RATING: 'set_rating',
  SET_RECENT: 'set_recent',
  SET_STATUS: 'set_status',
};

export const PROJECT_ORDERINGS = {
  RANDOM: { value: 'Random', label: 'Random', fn: projects => shuffle(projects) },
  CREATED: {
    value: 'Newest',
    label: 'Newest Project',
    fn: projects => orderBy(projects, ['created_date'], ['desc']),
  },
};

export const PROJECT_FILTERS = {
  limit: 20,
  order: PROJECT_ORDERINGS.RANDOM,
  query: '',
  categories: [],
  rating: null,
  recent: null,
  status: null,
};

export const PREP_ORDERINGS = {
  RANDOM: { value: 'Random', label: 'Random', fn: projects => shuffle(projects) },
  RANK: {
    value: 'Rank',
    label: 'Rank',
    fn: projects => orderBy(projects, ['rank'], ['asc']),
  },
};

export const PREP_FILTERS = {
  limit: 20,
  order: PREP_ORDERINGS.RANDOM,
  query: '',
  categories: [],
};

export function projectFilterReducer(state, action) {
  const { type, payload = null } = action;
  switch (type) {
    case FILTER_ACTIONS.SET_ORDER:
      return { ...state, order: payload };
    case FILTER_ACTIONS.SET_QUERY:
      return { ...state, query: payload };
    case FILTER_ACTIONS.SET_CATEGORIES:
      return { ...state, categories: payload };
    case FILTER_ACTIONS.REMOVE_CATEGORY:
      const categories = state.categories.filter(category => category !== payload);
      return { ...state, categories };
    case FILTER_ACTIONS.SET_RATING:
      return { ...state, rating: payload };
    case FILTER_ACTIONS.SET_RECENT:
      return { ...state, recent: payload };
    case FILTER_ACTIONS.SET_STATUS:
      return { ...state, status: payload };
    default:
      throw new Error(`Unknown action ${type}`);
  }
}

export function pRepFilterReducer(state, action) {
  const { type, payload = null } = action;
  switch (type) {
    case FILTER_ACTIONS.SET_ORDER:
      return { ...state, order: payload };
    case FILTER_ACTIONS.SET_QUERY:
      return { ...state, query: payload };
    case FILTER_ACTIONS.SET_CATEGORIES:
      return { ...state, categories: payload };
    case FILTER_ACTIONS.REMOVE_CATEGORY:
      const categories = state.categories.filter(category => category !== payload);
      return { ...state, categories };
    default:
      throw new Error(`Unknown action ${type}`);
  }
}