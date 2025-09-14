export const ROLE_PERMISSIONS = {
  owner: {
    customers: ['create', 'read', 'update', 'delete'],
    orders: ['create', 'read', 'update', 'delete'],
    invoices: ['create', 'read', 'update', 'delete'],
    payments: ['create', 'read', 'update', 'delete'],
    items: ['create', 'read', 'update', 'delete'],
    users: ['create', 'read', 'update', 'delete'], 
    settings: ['read', 'update']
  },
  manager: {
    customers: ['create', 'read', 'update', 'delete'],
    orders: ['create', 'read', 'update', 'delete'],
    invoices: ['create', 'read', 'update', 'delete'],
    payments: ['create', 'read', 'update', 'delete'],
    items: ['create', 'read', 'update', 'delete'],
    users: ['read'], // Can only view users
    settings: ['read']
  },
  staff: {
    customers: ['create', 'read', 'update'],
    orders: ['create', 'read', 'update'],
    invoices: ['create', 'read'],
    payments: ['create', 'read'],
    items: ['read'],
    users: [], // Cannot access user management
    settings: []
  },
  accountant: {
    customers: ['read'],
    orders: ['read'],
    invoices: ['create', 'read', 'update'],
    payments: ['create', 'read', 'update'],
    items: ['read'],
    users: [],
    settings: []
  },
  viewer: {
    customers: ['read'],
    orders: ['read'],
    invoices: ['read'],
    payments: ['read'],
    items: ['read'],
    users: [],
    settings: []
  },
};