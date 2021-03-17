declare interface IDealerListCommandSetStrings {
  Command1: string;
  Command2: string;
}

declare module 'DealerListCommandSetStrings' {
  const strings: IDealerListCommandSetStrings;
  export = strings;
}
