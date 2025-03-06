export type Language = 'ru' | 'en'
type Notification = {
  title: string
  newNotification: string
  new: string
}

type MyPayments = {
  title: string
  dateOfPayment: string
  endDateOfSubscription: string
  price: string
  subscriptionType: string
  paymentType: string
  day: string
  weekly: string
  month: string
  monthly: string
}
type AccountManagement = {
  title: string
  subscription: string
  expireAt: string
  nextPayment: string
  autoRenewal: string
  updating: string
  deleteSubscription: string
  accountType: string
  personal: string
  business: string
  subscriptionCosts: string
  day: string
  week: string
  month: string
  or: string
}
type Devices = {
  title: string
}
type GeneralInformation = {
  title: string
  username: string
  firstName: string
  lastName: string
  dateOfBirth: string
  selectYourCountry: string
  selectYourCity: string
  aboutMe: string
  addProfilePhoto: string
  saveChanges: string
}
type Profile = {
  title: string
  following: string
  followers: string
  publications: string
}
type Common = {
  yes: string
  no: string
  save: string
}
type Pagination = {
  show: string
  onPage: string
}
export type Translation = {
  home: string
  create: string
  profile: Profile
  profileSettings: string
  generalInformation: GeneralInformation
  devices: Devices
  accountManagement: AccountManagement
  myPayments: MyPayments
  messenger: string
  search: string
  statistics: string
  favorites: string
  logout: string
  uploadAvatar: {
    title: string
    selectFromComputer: string
  }
  deletePhoto: {
    title: string
    confirmationMessage: string
  }
  common: Common
  pagination: Pagination
  notifications: Notification
}
