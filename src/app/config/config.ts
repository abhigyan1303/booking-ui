// config.ts
export const config = {
  theme: 'default', // 'dark', 'light', or 'default' etc.
  header: {
    dropdownItems: [
      { label: 'Profile', action: 'profile' },
      { label: 'Logout', action: 'logout' }
    ]
  },
  leftDrawer: {
    headerText: 'Menu',
    descriptionText: 'Select an option',
    menuItems: [
      { label: 'Home', path: '/' },
      { label: 'User', path: '/user', role: ['superAdmin'] },
      { label: 'Manage Buses', path: '/buses', role: ['superAdmin', 'admin'] },
      { label: 'Manage Routes', path: '/routes', role: ['superAdmin', 'admin'] },
      { label: 'Manage Trips', path: '/trip', role: ['superAdmin', 'admin'] },
      { label: 'Manage Bookings', path: '/bookings', role: ['superAdmin', 'admin'] }
    ]
  }
};