declare interface IUsersCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'UsersCommandSetStrings' {
  const strings: IUsersCommandSetStrings;
  export = strings;
}
