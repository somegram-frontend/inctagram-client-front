type ProfileSettings = {
  title: string,
  generalInformation: string,
  devices: string,
  accountManagement: string,
  myPayments: string,
}
type Profile={
  title:string,
  following:string,
  followers:string,
  publications:string,
  profileSettings:ProfileSettings,
}
export type Translation = {
  home: string;
  create: string;
  profile: Profile;
  messenger: string;
  search: string;
  statistics: string;
  favorites: string;
  logout: string;
}