type GeneralInformation = {
  title: string,
  username: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  selectYourCountry: string;
  selectYourCity: string;
  aboutMe: string;
  addProfilePhoto: string;
  saveChanges: string;
};
type Profile = {
  title: string,
  following: string,
  followers: string,
  publications: string,
}
type Common = {
  yes: string;
  no: string;
  save: string;
};
export type Translation = {
  home: string;
  create: string;
  profile: Profile;
  profileSettings: string,
  generalInformation: GeneralInformation,
  messenger: string;
  search: string;
  statistics: string;
  favorites: string;
  logout: string;
  uploadAvatar: {
    title: string;
    selectFromComputer: string;
  };
  deletePhoto: {
    title: string;
    confirmationMessage: string;
  };
  common: Common;
}