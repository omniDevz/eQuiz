import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    title: string;
    colors: {
      background: string;
      backgroundGradient: string;

      primary: string;
    };
    shadows: {
      container: string;
      item: string;
    };
  }
}
