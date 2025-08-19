export const SideNavDetails = [
  { name: "Dashboard", iconName: 'dashboard', route: '/app/dashboard', heading: "Dashboard", subHeading: null },
  { name: "Resources", iconName: 'group', route: '/app/resources', heading: "Resources", subHeading: "List of Resources" },
  { name: "Tasks", iconName: 'assignment', route: '/app/tasks', heading: "Tasks", subHeading: "List of Tasks" }
]

export const ResourceAction = [
  { type: 'visibility', icon: 'search', toolTip: 'View' },
  { type: 'edit', icon: 'edit', toolTip: 'Edit' },
  { type: 'delete', icon: 'delete_outline', toolTip: 'Delete' }
]

export const ReasourceDisplayedColumnNames = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' },
  { key: 'cost', label: 'Cost' }
]

export const TaskActions = [
  { type: 'visibility', icon: 'search', toolTip: 'View' },
  { type: 'edit', icon: 'edit', toolTip: 'Edit' },
  { type: 'delete', icon: 'delete_outline', toolTip: 'Delete' }
]

export const TaskDisplayedColumnNames = [
  { key: 'task', label: 'Task' },
  { key: 'startDate', label: 'Start Date' },
  { key: 'endDate', label: 'End Date' },
  { key: 'status', label: 'Status' }
];

export const ResourceStatus = [
  { id: 0, name: 'Available', value: 'Available' },
  { id: 1, name: 'Unavailable', value: 'Unavailable' }
]

export const TaskStatus = [
  { id: 1, name: 'Assigned', value: 'Assigned' },
  { id: 2, name: 'In Progress', value: 'Inprogress' },
  { id: 3, name: 'Completed ', value: 'Completed' }
]
export const DashboardTaskDisplayedColumnNames = [
  { key: 'task', label: 'Task' },
  { key: 'startDate', label: 'Start Date' },
  { key: 'endDate', label: 'End Date' }
];

export const CountryDetails: CountryDetail[] = [
  { value: "USD", name: "United States" },
  { value: "INR", name: "India" },
  { value: "GBP", name: "United Kingdom" },
  { value: "EUR", name: "European Union" },
  { value: "JPY", name: "Japan" },
];

export interface CountryDetail {
  value: string;
  name: string;
}